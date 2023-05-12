import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { memo, useCallback, useContext, useEffect, useState } from 'react'
import CommonTexts from '../../Components/CommonTexts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomButton from '../../Components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import ItemsCard from './ItemsCard'
import PandaContext from '../../contexts/Panda'
import reactotron from '../../ReactotronConfig'
import moment from 'moment'
import customAxios from '../../CustomeAxios'
import AllInOneSDKManager from 'paytm_allinone_react-native';
import CartContext from '../../contexts/Cart'
import LoaderContext from '../../contexts/Loader'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

const OrderCard = memo(({ item }) => {

    const contextPanda = useContext(PandaContext)
    const cartContext = useContext(CartContext)
    const loadingg = useContext(LoaderContext)
    let active = contextPanda.active


    const [showItems, setShowItems] = useState(false)
    const [showAddress, setShowAddress] = useState(false)

    const [qty, setQty] = useState('')
    const [totalRate, setTotalRate] = useState('')

    const navigation = useNavigation()

    const {width, height} = useWindowDimensions()


    useEffect(() => {
        if (item?.myOrder) {
            setQty(item?.myOrder.reduce((total, currentValue) => total = total + parseInt(currentValue.quandity), 0))
            setTotalRate(item?.myOrder.reduce((total, currentValue) => total = total + parseInt(currentValue.rate), 0))
        }
    }, [item?.myOrder])

    const clickItem = useCallback(() => {
        setShowItems(!showItems)
    })

    const clickAddress = useCallback(() => {
        setShowAddress(!showAddress)
    })

    const clickDetails = useCallback(() => {
        navigation.navigate('ViewDetails', { item: item, qty: qty, totalRate: totalRate })
    }, [])

    const clickRateOrder = useCallback(() => {
        navigation.navigate('RateOrder', { item: item})
    }, [])

    const payWithPayTM = async (data) => {
        const { paymentDetails } = data
        let isStaging = true
        const callbackUrl = {
            true: "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=",
            false: "https://securegw.paytm.in/theia/paytmCallback?ORDER_ID="
        }
        await AllInOneSDKManager.startTransaction(
            paymentDetails?.orderId,//orderId
            paymentDetails?.mid,//mid
            paymentDetails?.txnToken,//txnToken
            paymentDetails?.amount.toFixed(2),//amount
            `${callbackUrl[isStaging]}${paymentDetails?.orderId}`,//callbackUrl
            isStaging,//isStaging
            false,//appInvokeRestricted
          `paytm${paymentDetails?.mid}`//urlScheme
         ).then((result) => {
            if(has(result, "STATUS")){
                updatePaymentResponse(result)
            }
            else{
                let data = {
                    STATUS: 'TXN_FAILURE',
                    RESPMSG: 'User Cancelled transaction',
                    ORDERID: paymentDetails?.orderId
                }
                updatePaymentResponse(data)
            }
            console.log("PAYTM =>", JSON.stringify(result));
            
            
        }).catch((err) => {
            Toast.show({ type: 'error', text1: err || "Something went wrong !!!" });
            reactotron.log("PAYTM ERROR=>", JSON.stringify(err));
        });

    }

    const updatePaymentResponse = async(data) => {
        let details = data
        await customAxios.post(`customer/order/payment/status`, data)
        .then(async response => {
            cartContext?.setCart(null)
            setCartItems(null)
            if (details?.STATUS == "TXN_SUCCESS") {
                Toast.show({ type: 'success', text1: 'Payment Success' })
                navigation.navigate("order")
            } else {
                Toast.show({ type: 'error', text1: details?.RESPMSG || "Something went wrong !!!" })
                navigation.navigate("order")
            }
            
        }).catch(async error => {
            console.log(error)
            Toast.show({ type: 'error', text1: error || "Something went wrong !!!" });
            navigation.navigate("order")
        })
    }

    const payAmount = useCallback(async() => {
        loadingg.setLoading(true)
        let data = {
            id: item?._id
        }
        await customAxios.post(`customer/order/paynow`, data)
            .then(async response => {
                const { data } = response
                if (data?.status) {
                    payWithPayTM(data?.data)
                } else {
                    Toast.show({ type: 'error', text1: data?.message || "Something went wrong !!!" });
                }
                loadingg.setLoading(false)
            })
            .catch(async error => {
                console.log(error)
                Toast.show({
                    type: 'error',
                    text1: error
                });
                loadingg.setLoading(false)
            })
    }, [])


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.textMedum}>{'Order ID '}</Text>
                    <CommonTexts label={item?.order_id} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.dateText}>{moment(item?.created_at).format("DD-MM-YYYY") }</Text>
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <View>
                    <Text style={styles.textRegular}>{'Total Items'}</Text>
                    <Text style={styles.textBold}>{item?.product_details.length}</Text>
                </View>
                <View>
                    <Text style={styles.textRegular}>{'Total Payment'}</Text>
                    <Text style={styles.textBold}>{item?.grand_total}</Text>
                </View>
                <View>
                    <Text style={styles.textRegular}>{'Current Status'}</Text>
                    <View 
                        style={
                            item?.status === 'pending' ? styles.pendingStatusBox : item?.status === 'completed' ? styles.completedStatusBox : null
                        }
                    >
                        <Text style={item?.status === 'pending' ? styles.pendingStatusText : item?.status === 'completed' ? styles.completedStatusText : null} >{item?.status}</Text>
                    </View>
                </View>
            </View>

            <View style={{ backgroundColor: '#fff', paddingBottom: 10, }}>
                <View style={styles.itemsRow}>
                    <Text style={styles.textBold}>{'Items'}</Text>
                    <TouchableOpacity onPress={clickItem}>
                        <Ionicons name={showItems ? 'chevron-up-circle' : 'chevron-down-circle'} size={22} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} />
                    </TouchableOpacity>
                </View>

                {showItems && <>
                    <View style={styles.itemsHeadingView}>
                        <View style={{ flex: 0.5 }}>
                            <Text style={styles.textRegular}>{'Product'}</Text>
                        </View>
                        <Text style={styles.textBold}>{'Qty'}</Text>
                        <Text style={styles.textBold}>{'Price'}</Text>
                    </View>
                    {item?.product_details.map((ite) => 
                        <ItemsCard item={ite} key={ite?._id} date={item?.created_at} />
                    )}
                </>}
            </View>

            <View
                style={{ backgroundColor: '#fff', paddingBottom: 10, borderTopWidth: showItems ? 0 : 1, borderColor: '#00000029', marginHorizontal: 7 }}
            >
                <View style={styles.shippingView}>
                    <Text style={styles.textBold}>{'Qbuy Panda Slot Based Shipping'}</Text>
                    <TouchableOpacity onPress={clickAddress}>
                        <Ionicons name={showAddress ? 'chevron-up-circle' : 'chevron-down-circle'} size={22} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} />
                    </TouchableOpacity>

                </View>
                {showAddress && <View style={styles.addressBox}>
                    <CommonTexts label={'HOME'} fontSize={13} />
                    <Text style={styles.addressText}>{item?.shipaddress?.area?.address}</Text>
                </View>}

                {item?.paymentStatus === 'success' && 
                <>

                    {item?.status === 'pending' ? <CustomButton
                        onPress={clickDetails}
                        label={'View Details'}
                        bg = {active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#576FD0'}
                        mt={8}
                    /> : item?.status === 'completed' ? 
                    <View style={{flex:1,  marginTop:8, flexDirection:'row', justifyContent:'space-between'}}>

                        <CustomButton
                            onPress={clickDetails}
                            label={'Details'}
                            bg='#576FD0'
                            width={width/3.5}
                        />
                        <CustomButton
                            // onPress={() => navigation.navigate('ViewDetails', { item: item, qty: qty, totalRate: totalRate })}
                            label={'Reorder'}
                            bg='#D0A857'
                            width={width/3.5}
                        />
                        <CustomButton
                            onPress={clickRateOrder}
                            label={'Rate Order'}
                            bg='#58D36E'
                            width={width/3.5}
                        />


                    </View>   : null 
                }
                </>
                
                }

                {item?.payment_status === 'pending' && <CustomButton
                    onPress={payAmount}
                    label={'Pay Now'}
                    bg={ active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                    mt={8}
                />}
            </View>



        </View>
    )
})

export default OrderCard

const styles = StyleSheet.create({
    container : { 
        borderRadius: 10, 
        shadowOpacity: 0.1, 
        shadowRadius: 2, 
        marginBottom: 20, 
        backgroundColor: '#fff', 
        shadowOffset: { height: 5, width: 1 } ,
        elevation:2,
        marginHorizontal:2
    },
    header : { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F8F8F8', 
        borderTopRightRadius: 15, 
        borderTopLeftRadius: 15, 
        padding: 6, 
        justifyContent: 'space-between' 
    },
    itemsRow : { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginHorizontal: 7 
    },
    itemsHeadingView : { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        justifyContent: 'space-between', 
        marginTop: 10, 
        marginHorizontal: 7, 
        marginBottom: 10 
    },
    textMedum : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    dateText : {
        fontFamily: 'Poppins-Regular',
        color: '#555555A3',
        fontSize: 10,
    },
    itemsContainer : { 
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: '#fff', 
        justifyContent: 'space-between', 
        margin: 7, 
        borderBottomWidth: 1, 
        paddingBottom: 10, 
        borderColor: '#00000029' 
    },
    textRegular : {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
    },
    pendingStatusBox : { 
        backgroundColor: '#FFF297', 
        borderRadius: 5, 
        alignItems: 'center' 
    },
    completedStatusBox : { 
        backgroundColor: '#CEFF97', 
        borderRadius: 5, 
        alignItems: 'center' 
    },
    pendingStatusText : {
        fontFamily: 'Poppins-Regular',
        color: '#B7A000',
        fontSize: 10,
        marginVertical: 4
    },
    completedStatusText : {
        fontFamily: 'Poppins-Regular',
        color: '#23B700',
        fontSize: 10,
        marginVertical: 4
    },
    
    textBold : {
        fontFamily: 'Poppins-Bold',
        color: '#23233C',
        fontSize: 11,
    },
    addressText : {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 12, marginTop: 5
    },
    shippingView : { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingTop: 5 
    },
    addressBox : { 
        backgroundColor: '#F3F3F3', 
        padding: 10,
        borderRadius: 10 
    }

})