import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useRef, useState, useEffect, useContext, useCallback } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import ItemsCard from '../../MyOrders/ItemsCard'
import CheckoutItemCard from './CheckoutItemCard'
import AddMoreItem from './AddMoreItem'
import CustomButton from '../../../Components/CustomButton'
import ChooseDeliverySpeed from './ChooseDeliverySpeed'
import CommonInput from '../../../Components/CommonInput'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { uniq } from 'lodash'
import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'
import AllInOneSDKManager from 'paytm_allinone_react-native';



import FastImage from 'react-native-fast-image'
import ChooseTip from './ChooseTip'
import ChooseDeliveryType from './ChooseDeliveryType'
import CommonTexts from '../../../Components/CommonTexts'
import PandaContext from '../../../contexts/Panda'
import reactotron from '../../../ReactotronConfig'
import customAxios from '../../../CustomeAxios'
import AuthContext from '../../../contexts/Auth'
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/core'
import CartContext from '../../../contexts/Cart'
import Toast from 'react-native-toast-message'
import PaymentMethod from './PaymentMethod'
import { RefreshControl } from 'react-native-gesture-handler'
import LoaderContext from '../../../contexts/Loader'


const Checkout = ({ navigation }) => {


    const contextPanda = useContext(PandaContext)
    const cartContext = useContext(CartContext)
    const authContext = useContext(AuthContext)
    let active = contextPanda.active

    const loadingg = useContext(LoaderContext)
    const loader = loadingg?.loading

    const refRBSheet = useRef();


    const [cartItems, setCartItems] = useState(null)
    const [deliveryCharge, setDeliveryCharge] = useState(null)


    const [selected, setSelected] = useState('1')
    const [selectedTip, setSelectedTip] = useState('2')
    const [selectedDelivery, setSelectedDelivery] = useState('1')
    const [price, setPrice] = useState('')
    const [showList, setShowList] = useState(false)
    const [payment, setPayment] = useState([
        {
            _id: 'online',
            name: "Online",
            selected: true
        },
        {
            _id: 'COD',
            name: "COD",
            selected: false
        }
    ])





    const schema = yup.object({
        mobile: yup.string().min(8).required('Phone number is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });



    reactotron.log({ cartItems })

    useFocusEffect(
        React.useCallback(() => {
            if(cartContext?.cart?._id){
                getCartItems()
            }
            
        }, [cartContext?.cart?._id])
    );

    const getCartItems = async () => {
        await customAxios.get(`customer/cart/show/${cartContext?.cart?._id}`)
            .then(async response => {
                reactotron.log({ data: response?.data?.data })
                setCartItems(response?.data?.data)
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
            })

    }



    myOrder = [
        {
            _id: '1',
            name: 'Chicken Biriyani',
            shop: 'Jeff biriyani shop',
            count: 1,
            rate: 250,
        },
        {
            _id: '2',
            name: 'Chicken Dum Biriyani',
            shop: 'Zam Zam',
            count: 2,
            rate: 260
        },
        // {
        //     _id: '3',
        //     name: 'Chicken Dum Biriyani',
        //     shop: 'Zam Zam',
        //     count: 2,
        //     rate: 260
        // },


    ]

    // let duplicate = myOrder.map(item=> item.name);
    // let result = [...new Set(duplicate)];
    //  console.log({result})


    const getDeliveryFee = () => {
        let delivery = 0;
        cartItems?.product_details?.map(data => {
            if (data?.type === "single") {
                if (data?.productdata?.fixed_delivery_price && parseFloat(data?.productdata?.fixed_delivery_price) > 0) {
                    delivery += parseFloat(data?.productdata?.fixed_delivery_price)
                }
            }
            else {
                if (data?.variants?.fixed_delivery_price && parseFloat(data?.variants?.fixed_delivery_price) > 0) {
                    delivery += parseFloat(data?.variants?.fixed_delivery_price)
                }
            }
        })

        return delivery;
    }

    const getTotalAmount = () => {
        let amount = 0;
        let delivery = 0;
        let amountArray = []
        cartItems?.product_details?.map(data => {
            if (data?.type === "single") {
                if (data?.productdata?.fixed_delivery_price && parseFloat(data?.productdata?.fixed_delivery_price) > 0) {
                    delivery += parseFloat(data?.productdata?.fixed_delivery_price)
                }
                if (parseFloat(data?.productdata?.offer_price) > 0) {
                    if (moment(data?.productdata?.offer_date_from, "YYYY-MM-DD") < moment() && moment(data?.productdata?.offer_date_to, "YYYY-MM-DD") > moment()) {
                        let finalPrice = parseFloat(data?.productdata?.offer_price) * parseFloat(data?.quantity);
                        //amountArray.push(finalPrice)
                        amount += finalPrice
                    }
                    else {
                        if (parseFloat(data?.productdata?.regular_price) > 0) {
                            let finalPrice = parseFloat(data?.productdata?.regular_price) * parseFloat(data?.quantity);
                            //amountArray.push(finalPrice)
                            //amountArray.push(`${data?.productdata?.regular_price} -${finalPrice}`)
                            amount += finalPrice
                        }
                        else {
                            let commission = (parseFloat(data?.productdata?.seller_price) / 100) * parseFloat(data?.productdata?.commission)
                            let amounts = (parseFloat(data?.productdata?.seller_price) + parseFloat(commission)) * parseFloat(data?.quantity);

                            amount += amounts
                        }
                    }
                }
                else if (parseFloat(data?.productdata?.regular_price) > 0) {
                    let finalPrice = parseFloat(data?.productdata?.regular_price) * parseFloat(data?.quantity);
                    //amountArray.push(finalPrice)

                    amount += finalPrice
                }
                else {
                    let commission = (parseFloat(data?.productdata?.seller_price) / 100) * parseFloat(data?.productdata?.commission)
                    let amounts = (parseFloat(data?.productdata?.seller_price) + parseFloat(commission)) * parseFloat(data?.quantity);
                    //amountArray.push(`${data?.productdata?.seller_price} ${amounts}`)
                    amount += amounts
                }
            }
            else {
                if (parseFloat(data?.variants?.offer_price) > 0) {
                    if (moment(data?.variants?.offer_date_from, "YYYY-MM-DD") < moment() && moment(data?.variants?.offer_date_to, "YYYY-MM-DD") > moment()) {
                        let finalPrice = parseFloat(data?.variants?.offer_price) * parseFloat(data?.quantity);
                        //amountArray.push(finalPrice)
                        amount += finalPrice
                    }
                    else {
                        if (parseFloat(data?.variants?.regular_price) > 0) {
                            let finalPrice = parseFloat(data?.variants?.regular_price) * parseFloat(data?.quantity);
                            //amountArray.push(finalPrice)
                            amount += finalPrice
                        }
                        else {
                            let commission = (parseFloat(data?.variants?.seller_price) / 100) * parseFloat(data?.productdata?.commission)
                            let amounts = (parseFloat(data?.variants?.seller_price) + parseFloat(commission)) * parseFloat(data?.quantity);
                            //amountArray.push(amounts)
                            amount += amounts
                        }
                    }
                }
                else if (parseFloat(data?.variants?.regular_price) > 0) {
                    let finalPrice = parseFloat(data?.variants?.regular_price) * parseFloat(data?.quantity);
                    //amountArray.push(finalPrice)
                    amount += finalPrice
                }
                else {
                    let commission = (parseFloat(data?.variants?.seller_price) / 100) * parseFloat(data?.productdata?.commission)
                    let amounts = (parseFloat(data?.variants?.seller_price) + parseFloat(commission)) * parseFloat(data?.quantity);
                    //amountArray.push(amounts)
                    amount += amounts
                }
            }
        })
        reactotron.log({ amountArray })
        return amount;
    }


    


    datas = [
        {
            _id: '1',
            name: 'Slot Based',
            timing: '60 - 90 min',
            rate: 56
        },
        {
            _id: '2',
            name: 'Express Delivery',
            timing: '45 - 60 min',
            rate: 93
        },
        {
            _id: '3',
            name: 'Economic',
            timing: 'within 24 hrs',
            rate: 28
        },

    ]

    tips = [
        {
            _id: '1',
            rate: '₹ 10'
        },
        {
            _id: '2',
            most: 'Most Tipped',
            rate: '₹ 20'
        },
        {
            _id: '3',
            rate: '₹ 30'
        },
        {
            _id: '4',
            rate: 'other'
        },
    ]

    delivery = [
        {
            _id: '1',
            name: 'Leave at the door',
            iconName: 'door-closed'
        },
        {
            _id: '2',
            name: 'Avoid ringing the bell',
            iconName: 'bell'
        },
        {
            _id: '3',
            name: 'Avoid calling',
            iconName: 'mobile'
        },
        {
            _id: '4',
            name: 'Leave with the security',
            iconName: 'user-alt'

        },
    ]

    let charges = [
        {
            _id: '1',
            name: 'Sub-Total',
            rate: '460',
            flashIcon: false
        },
        {
            _id: '2',
            name: 'Platform & Other Charges',
            rate: '10',
            flashIcon: false
        },
        {
            _id: '3',
            name: 'Surge Charge',
            rate: '20',
            flashIcon: true
        },
        {
            _id: '4',
            name: 'Delivery Charge (Slot Based)',
            rate: '60',
            flashIcon: false

        },
    ]

    useEffect(() => {
        if (charges) {
            setPrice(charges.reduce((total, currentValue) => total = total + parseInt(currentValue.rate), 0))
        }
    }, [charges])

    const clickAddtails = useCallback(() => {
        navigation.navigate('AddDetails')
    }, [])

    const gotoCoupons = useCallback(() => {
        navigation.navigate('Coupons')
    }, [])

    const clickBillDetails = useCallback(() => {
        setShowList(!showList)
    })

    const placeOrder = async () => {

        let products = [];
        let amount = 0;

        cartItems?.product_details?.map(data => {
            if (data?.type === "single") {
                if (data?.productdata?.fixed_delivery_price && parseFloat(data?.productdata?.fixed_delivery_price) > 0) {
                    delivery += parseFloat(data?.productdata?.fixed_delivery_price)
                }
                if (parseFloat(data?.productdata?.offer_price) > 0) {
                    if (moment(data?.productdata?.offer_date_from, "YYYY-MM-DD") < moment() && moment(data?.productdata?.offer_date_to, "YYYY-MM-DD") > moment()) {
                        let finalPrice = parseFloat(data?.productdata?.offer_price) * parseFloat(data?.quantity);
                        //amountArray.push(finalPrice)
                        amount += finalPrice

                        products.push({
                            product_id: data?.product_id,
                            name: data?.name,
                            image: data?.image,
                            type: data?.type,
                            variant_id: data?.type === "variant" ?  data?.variants?._id : null,
                            quantity: data?.quantity,
                            price: finalPrice,
                            unitPrice: parseFloat(data?.productdata?.offer_price),
                            deliveryPrice: data?.productdata?.fixed_delivery_price
                        })
                    }
                    else {
                        if (parseFloat(data?.productdata?.regular_price) > 0) {
                            let finalPrice = parseFloat(data?.productdata?.regular_price) * parseFloat(data?.quantity);
                            //amountArray.push(finalPrice)
                            //amountArray.push(`${data?.productdata?.regular_price} -${finalPrice}`)
                            amount += finalPrice
                            products.push({
                                product_id: data?.product_id,
                                name: data?.name,
                                image: data?.image,
                                type: data?.type,
                                variant_id: data?.type === "variant" ?  data?.variants?._id : null,
                                quantity: data?.quantity,
                                price: finalPrice,
                                unitPrice: parseFloat(data?.productdata?.regular_price),
                                deliveryPrice: data?.productdata?.fixed_delivery_price
                            })
                        }
                        else {
                            let commission = (parseFloat(data?.productdata?.seller_price) / 100) * parseFloat(data?.productdata?.commission)
                            let amounts = (parseFloat(data?.productdata?.seller_price) + parseFloat(commission)) * parseFloat(data?.quantity);

                            amount += amounts
                            products.push({
                                product_id: data?.product_id,
                                name: data?.name,
                                image: data?.image,
                                type: data?.type,
                                variant_id: data?.type === "variant" ?  data?.variants?._id : null,
                                quantity: data?.quantity,
                                price: amounts,
                                unitPrice: parseFloat(data?.productdata?.seller_price) + parseFloat(commission),
                                deliveryPrice: data?.productdata?.fixed_delivery_price
                            })
                        }
                    }
                }
                else if (parseFloat(data?.productdata?.regular_price) > 0) {
                    let finalPrice = parseFloat(data?.productdata?.regular_price) * parseFloat(data?.quantity);
                    //amountArray.push(finalPrice)
                    products.push({
                        product_id: data?.product_id,
                        name: data?.name,
                        image: data?.image,
                        type: data?.type,
                        variant_id: data?.type === "variant" ?  data?.variants?._id : null,
                        quantity: data?.quantity,
                        price: finalPrice,
                        unitPrice: parseFloat(data?.productdata?.regular_price),
                        deliveryPrice: data?.productdata?.fixed_delivery_price
                    })
                    amount += finalPrice
                }
                else {
                    let commission = (parseFloat(data?.productdata?.seller_price) / 100) * parseFloat(data?.productdata?.commission)
                    let amounts = (parseFloat(data?.productdata?.seller_price) + parseFloat(commission)) * parseFloat(data?.quantity);
                    //amountArray.push(`${data?.productdata?.seller_price} ${amounts}`)
                    products.push({
                        product_id: data?.product_id,
                        name: data?.name,
                        image: data?.image,
                        type: data?.type,
                        variant_id: data?.type === "variant" ?  data?.variants?._id : null,
                        quantity: data?.quantity,
                        price: amounts,
                        unitPrice: parseFloat(data?.productdata?.seller_price) + parseFloat(commission),
                        deliveryPrice: data?.productdata?.fixed_delivery_price
                    })
                    amount += amounts
                }
            }
            else {
                if (parseFloat(data?.variants?.offer_price) > 0) {
                    if (moment(data?.variants?.offer_date_from, "YYYY-MM-DD") < moment() && moment(data?.variants?.offer_date_to, "YYYY-MM-DD") > moment()) {
                        let finalPrice = parseFloat(data?.variants?.offer_price) * parseFloat(data?.quantity);
                        //amountArray.push(finalPrice)
                        products.push({
                            product_id: data?.product_id,
                            name: data?.name,
                            image: data?.image,
                            type: data?.type,
                            variant_id: data?.type === "variant" ?  data?.variants?._id : null,
                            quantity: data?.quantity,
                            price: finalPrice,
                            unitPrice: parseFloat(data?.variants?.offer_price),
                            deliveryPrice: data?.variants?.fixed_delivery_price
                        })
                        amount += finalPrice
                        
                    }
                    else {
                        if (parseFloat(data?.variants?.regular_price) > 0) {
                            let finalPrice = parseFloat(data?.variants?.regular_price) * parseFloat(data?.quantity);
                            //amountArray.push(finalPrice)
                            amount += finalPrice
                            products.push({
                                product_id: data?.product_id,
                                name: data?.name,
                                image: data?.image,
                                type: data?.type,
                                variant_id: data?.type === "variant" ?  data?.variants?._id : null,
                                quantity: data?.quantity,
                                price: finalPrice,
                                unitPrice: parseFloat(data?.variants?.regular_price),
                                deliveryPrice: data?.variants?.fixed_delivery_price
                            })
                        }
                        else {
                            let commission = (parseFloat(data?.variants?.seller_price) / 100) * parseFloat(data?.productdata?.commission)
                            let amounts = (parseFloat(data?.variants?.seller_price) + parseFloat(commission)) * parseFloat(data?.quantity);
                            //amountArray.push(amounts)
                            products.push({
                                product_id: data?.product_id,
                                name: data?.name,
                                image: data?.image,
                                type: data?.type,
                                variant_id: data?.type === "variant" ?  data?.variants?._id : null,
                                quantity: data?.quantity,
                                price: amounts,
                                unitPrice: parseFloat(data?.variants?.seller_price) + parseFloat(commission),
                                deliveryPrice: data?.variants?.fixed_delivery_price
                            })
                            amount += amounts
                        }
                    }
                }
                else if (parseFloat(data?.variants?.regular_price) > 0) {
                    let finalPrice = parseFloat(data?.variants?.regular_price) * parseFloat(data?.quantity);
                    //amountArray.push(finalPrice)
                    amount += finalPrice
                    products.push({
                        product_id: data?.product_id,
                        name: data?.name,
                        image: data?.image,
                        type: data?.type,
                        variant_id: data?.type === "variant" ?  data?.variants?._id : null,
                        quantity: data?.quantity,
                        price: finalPrice,
                        unitPrice: parseFloat(data?.variants?.regular_price),
                        deliveryPrice: data?.variants?.fixed_delivery_price
                    })
                }
                else {
                    let commission = (parseFloat(data?.variants?.seller_price) / 100) * parseFloat(data?.productdata?.commission)
                    let amounts = (parseFloat(data?.variants?.seller_price) + parseFloat(commission)) * parseFloat(data?.quantity);
                    //amountArray.push(amounts)
                    amount += amounts
                    products.push({
                        product_id: data?.product_id,
                        name: data?.name,
                        image: data?.image,
                        type: data?.type,
                        variant_id: data?.type === "variant" ?  data?.variants?._id : null,
                        quantity: data?.quantity,
                        price: amounts,
                        unitPrice: parseFloat(data?.variants?.seller_price) + parseFloat(commission),
                        deliveryPrice: data?.variants?.fixed_delivery_price
                    })
                }
            }
        })

        if (!cartContext.defaultAddress?.area?.location) {
            Toast.show({
                type: 'error',
                text1: 'Please add Delevery Address to continue'
            });
            return false;
        }

        let storeId = cartItems?.product_details?.map(prod => {
            //reactotron.log({prod})
            return prod?.productdata?.store?._id ? prod?.productdata?.store?._id : "123"
        })

        //reactotron.log({storeId})

        let uniqueStore = uniq(storeId)


        let delivery = getDeliveryFee();

        let pay = payment.find(pay => pay.selected === true)

        //navigation.navigate('Payment')
        const orderDetails = {
            product_details: products,
            user_id: authContext?.userData?._id,
            billing_address: cartContext?.defaultAddress?._id,
            shipping_address: cartContext?.defaultAddress?._id,
            payment_status: pay._id === "online" ? "pending" : "completed",
            payment_type: pay._id,
            type: active,
            total_amount: amount,
            delivery_charge: delivery,
            delivery_type: "Slot based",
            franchise: cartItems?.product_details?.[0]?.productdata?.franchisee?._id,
            cart_id: cartItems?._id,
            store: uniqueStore
        }

        //reactotron.log({ orderDetails })
        if(products?.length > 0){
            await customAxios.post(`customer/order/create`, orderDetails)
            .then(async response => {
                console.log("response ==>", JSON.stringify(response.data), response.status)
                const { data } = response
                if (data?.status) {
                    if (data?.data?.payment_type == "online" && has(data?.data, "paymentDetails") && !isEmpty(data?.data?.paymentDetails)) {
                        payWithPayTM(data?.data)
                    } else {
                        cartContext?.setCart(null)
                        setCartItems(null)
                        await AsyncStorage.removeItem("cartId");
                        navigation.navigate('OrderPlaced')
                    }
                } else {
                    Toast.show({ type: 'error', text1: data?.message || "Something went wrong !!!" });
                }
            }).catch(error => {
                console.log(error)
                Toast.show({ type: 'error', text1: error || "Something went wrong !!!" });
            })
        }
        else{
            Toast.show({
                type: 'info',
                text1: 'Please add some products to cart to proceed'
            })
        }
        
    }


    const updatePaymentResponse = async(data) => {
        await customAxios.post(`customer/order/payment/status`, data)
        .then(async response => {
            cartContext?.setCart(null)
            setCartItems(null)
            await AsyncStorage.removeItem("cartId");
            navigation.navigate('OrderPlaced')
        }).catch(async error => {
            console.log(error)
            Toast.show({ type: 'error', text1: error || "Something went wrong !!!" });
        })
    }


    const hanldeErrorApi = async (dataValue) => {
        await customAxios.post(`customer/order/payment/status`, dataValue).then(
            (result) => console.log("result", result)).catch(
                error => {
                    console.log(error);
                })


    }

    const payWithPayTM = async (data) => {
        const { paymentDetails } = data
        let isStaging = true
        let userInfo = {
            name: "Renjith"
        }
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
            console.log("PAYTM =>", JSON.stringify(result));
            if (result?.STATUS == "TXN_SUCCESS") {
                updatePaymentResponse(result)
            } else {
                Toast.show({ type: 'error', text1: result?.body?.txnInfo?.RESPMSG || "Something went wrong !!!" })
            }
        }).catch((err) => {
            reactotron.log("PAYTM ERROR=>", JSON.stringify(err));
        });

    }


    const refreshCart = () => {
        getCartItems()
    }


    const navigateToAddress = () => {
        navigation.navigate("account", { screen: "MyAddresses", params: { mode: 'checkout' } })
    }


    const setPaymentMethod = useCallback((id) => {
        let pays = payment?.map(pay => {
            if(pay?._id === id){
                return {
                    ...pay,
                    selected: true
                }
            }
            else{
                return {
                    ...pay,
                    selected: false
                }
            }
        })

        setPayment(pays)
    }, [])


    return (
        <>
            <HeaderWithTitle title={'Checkout'} />
            <ScrollView 
            refreshControl={
                <RefreshControl refreshing={loader} onRefresh={getCartItems} />
            }
            style={{ flex: 1, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#F3F3F3', }}>

                {/* products */}
                <View style={styles.productBox}>
                    <View style={styles.productHeader}>
                        <View style={{ flex: 0.45 }}>
                            <Text style={styles.boldText}>{'Product'}</Text>
                        </View>
                        <Text style={styles.boldText}>{'Price'}</Text>
                        <Text style={styles.boldText}>{'Qty'}</Text>
                        <Text style={styles.boldText}>{'Total'}</Text>
                    </View>
                    <View style={styles.itemUnderProduct}>
                        {cartItems?.product_details.map((item, index) =>
                            <CheckoutItemCard
                                item={item}
                                key={index}
                                index={index}
                                refreshCart={refreshCart}
                            />
                        )}
                    </View>
                    {/* <AddMoreItem />
                    <Text style={styles.regularText}>{'Add Cooking Instructions'}</Text>
                    <View style={styles.saveBox}>
                        <Text style={styles.italicText}>{'Need to be well cooked...'}</Text>
                        <TouchableOpacity>
                            <Text
                                style={{
                                    fontFamily: 'Poppins-ExtraBold',
                                    color: active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#FF7190' : '#5897D3',
                                    fontSize: 12,
                                }}
                            >{'Save'}</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>

                {/* Order for Others */}
                {/* <View style={styles.commonContainer}>
                    <Text style={styles.boldText}>{'Order for Others'}</Text>
                    <Text style={styles.mediumGrayText}>{'Order food for your friends, family etc...'}</Text>
                    <CustomButton
                        onPress={clickAddtails}
                        label={'Add Details'}
                        bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#5897D3'}
                        mt={10}
                    />
                </View> */}

                {/*Delivery Speed */}
                <View style={styles.commonContainer}>
                    <Text style={styles.boldText}>{'Payment Methods'}</Text>
                    {payment.map((item, index) =>
                        <PaymentMethod
                            item={item}
                            key={index}
                            setSelected={setPaymentMethod}
                        />
                    )}
                </View>

                {/* Add Coupon */}
                {/* <View style={styles.commonContainer}>
                    <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={styles.boldText}>{'Add Coupon'}</Text>
                        <TouchableOpacity 
                            onPress={gotoCoupons}                            
                            style={{flexDirection:'row', alignItems:'center',}}>
                            <Text style={{
                                fontFamily: 'Poppins-Medium',
                                color: '#23233C',
                                fontSize: 10,

                            }}>{'View All'}</Text>
                            <Ionicons name='chevron-forward-circle' size={18} color={ active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} marginLeft={3}/>
                        </TouchableOpacity>

                    </View>
                    <Text style={styles.mediumGrayText}>{'Do you have any coupon with you? You can use it here to get additional discounts'}</Text>
                    <View style={styles.enterCouponBox}>
                        <CommonInput
                            width={'75%'}
                            control={control}
                            error={errors.mobile}
                            fieldName="mobile"
                            inputMode={'numeric'}
                            backgroundColor='#F2F2F2'
                            maxHeight={40}
                            placeholder='Enter Coupon'
                            placeholderTextColor={'#A5A5A5'}
                        />
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <CustomButton
                                bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                                label='Apply'
                                width={'90%'}
                            />
                        </View>
                    </View>
                </View> */}

                {/* Give a Tip */}
                {/* <View style={styles.commonContainer}>
                    <Text style={styles.boldText}>{'Give a Tip!'}</Text>
                    <Text style={styles.mediumGrayText}>{'Leave your delivery partner with a tip so that you could show an appreciation for his efforts!'}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {tips.map((item, index) =>
                            <ChooseTip
                                item={item}
                                key={index}
                                selected={selectedTip}
                                setSelected={setSelectedTip}
                            />
                        )}
                    </View>
                </View> */}

                {/* Add Delivery Instructions */}
                {/* <View style={styles.commonContainer}>
                    <Text style={styles.boldText}>{'Add Delivery Instructions'}</Text>
                    <Text style={styles.mediumGrayText}>{'Add necessary instruction for your delivery partner'}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {delivery.map((item, index) =>
                            <ChooseDeliveryType
                                item={item}
                                key={index}
                                selected={selectedDelivery}
                                setSelected={setSelectedDelivery}
                            />
                        )}
                    </View>
                </View> */}

                {/* panda coins */}
                {/* <View 
                    style={{
                        backgroundColor: active === 'green' ? '#fae8d4' : '#cae2fa',
                        height: 80,
                        marginTop: 10,
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingHorizontal: 20,
                        justifyContent: 'space-between'
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FastImage source={active === 'green' ? require('../../../Images/Orangepanda.png') : require('../../../Images/panda.png')} style={styles.logo} />
                        <Text style={styles.boldText}>{'30'}</Text>
                        <Text style={styles.textRegular}>{' Panda coins can be used'}</Text>
                    </View>
                    <CustomButton label={'Apply'} bg={ active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' :  '#586DD3'} width={100} />
                </View> */}

                {/* grand total */}
                <View style={styles.grandTotalBox}>
                    {/* <View style={styles.grandTotalTop}>
                        <Text style={styles.textMedium}>{'Delivery Tip'}</Text>
                        <Text
                            style={{
                                fontFamily: 'Poppins-Medium',
                                fontSize: 11,
                                color: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'
                            }}
                        >{'Add Tip'}</Text>
                    </View> */}
                    {/* <View style={styles.grandTotalMid}>
                        <Text style={styles.textMedium}>{'Govt Taxes & Other Charges'}</Text>
                        <Text style={styles.textMedium}>₹ {'10'}</Text>
                    </View> */}
                    <View style={styles.grandTotalMid}>
                        <Text style={styles.textMedium}>{'Delivery Fee'}</Text>
                        <Text style={styles.textMedium}>₹ {getDeliveryFee()}</Text>
                    </View>

                    <View style={styles.grandTotalBottom}>
                        <Text style={styles.boldText}>{'Grand Total'}</Text>
                        <Text style={styles.boldText}>₹ {getTotalAmount() + getDeliveryFee()}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom View */}
            <View style={styles.addressContainer}>
                <View style={styles.addrHeader}>
                    <View >
                        <Foundation name={'target-two'} color='#FF0000' size={20} marginTop={5} />
                    </View>
                    <View style={{ flex: 0.8, marginLeft: 10 }}>
                        <CommonTexts label={cartContext.defaultAddress?.area?.location} fontSize={21} />
                        <Text
                            style={styles.address}
                        >{cartContext.defaultAddress?.area?.address}</Text>
                    </View>

                    <TouchableOpacity style={{ position: 'absolute', right: 20, top: 10 }} onPress={navigateToAddress}>
                        <MaterialCommunityIcons name={'lead-pencil'} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#5871D3'} size={18} marginTop={5} />
                    </TouchableOpacity>
                </View>
                {!showList && <View style={{ flexDirection: 'row', paddingHorizontal: 40, paddingVertical: 5 }}>
                    <Text
                        style={styles.textMedium}
                    >{'Grand Total  '}</Text>
                    <Text
                        style={styles.boldText}
                    >₹{getTotalAmount() + getDeliveryFee()}</Text>
                </View>}

                {showList && <>
                    <View style={styles.totalBill}>
                        <Text
                            style={styles.boldText}
                        >Total Bill</Text>
                    </View>
                    <View style={styles.charges}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* {item?.flashIcon && <Fontisto name={'flash'} color={'#FF0000'} size={12} marginRight={4}/>} */}
                            <Text
                                style={styles.textMedium}
                            >{"Sub Total"}</Text>
                        </View>
                        <Text
                            style={styles.textMedium}
                        >₹{getTotalAmount()}</Text>

                    </View>
                    <View style={styles.charges}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* {item?.flashIcon && <Fontisto name={'flash'} color={'#FF0000'} size={12} marginRight={4}/>} */}
                            <Text
                                style={styles.textMedium}
                            >{"Delivery Charge"}</Text>
                        </View>
                        <Text
                            style={styles.textMedium}
                        >₹{getDeliveryFee()}</Text>

                    </View>
                    {/* {charges.map(item => 
                        (<View key={item?._id} style={styles.charges}>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                {item?.flashIcon && <Fontisto name={'flash'} color={'#FF0000'} size={12} marginRight={4}/>}
                                <Text
                                    style={styles.textMedium}
                                >{item?.name}</Text>
                            </View>
                            <Text
                                style={styles.textMedium}
                            >₹{item?.rate}</Text>
                            
                        </View>)
                    )} */}
                    <View style={styles.grandTotal}>
                        <Text
                            style={styles.textMedium}
                        >{'Grand Total  '}</Text>
                        <Text
                            style={styles.boldText}
                        >₹{getTotalAmount() + getDeliveryFee()}</Text>
                    </View>
                </>}

                <View
                    style={{
                        backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E',
                        height: 60,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 40,
                        position: 'absolute',
                        width: '100%',
                        bottom: 0
                    }}
                >
                    <TouchableOpacity
                        onPress={clickBillDetails}
                        style={styles.viewDetails}
                    >
                        <CommonTexts label={'View Detailed Bill'} color='#fff' fontSize={12} />
                        <Ionicons name={showList ? 'chevron-down' : 'chevron-up'} size={20} color='#fff' marginLeft={5} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ alignItems: 'flex-end', flex: 0.5 }}
                        onPress={placeOrder}
                    >
                        <CommonTexts label={'Place Order'} color='#fff' fontSize={17} />
                    </TouchableOpacity>
                </View>

            </View>
        </>
    )
}

export default Checkout

const styles = StyleSheet.create({

    productBox: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginHorizontal: 10,
    },

    commonContainer: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginHorizontal: 10,
        padding: 10
    },
    boldText: {
        fontFamily: 'Poppins-Bold',
        color: '#23233C',
        fontSize: 11,
    },
    mediumGrayText: {
        fontFamily: 'Poppins-Medium',
        color: '#A5A5A5',
        fontSize: 9,
        marginTop: 3
    },
    regularText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 12,
        marginLeft: 10,
        marginTop: 10
    },
    italicText: {
        fontFamily: 'Poppins-LightItalic',
        color: '#23233C',
        fontSize: 12,
    },

    saveBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginVertical: 10
    },
    productHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 5,
        borderBottomWidth: 0.5,
        paddingBottom: 10,
        borderColor: '#707070',

    },
    itemUnderProduct: {
        paddingHorizontal: 10,
    },
    logo: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10
    },
    grandTotalBox: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginHorizontal: 10,
        marginBottom: 200
    },

    enterCouponBox: {
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center'
    },
    textRegular: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11
    },
    textMedium: {
        fontFamily: 'Poppins-Medium',
        fontSize: 11,
        color: '#23233C'
    },

    grandTotalTop: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 10
    },
    grandTotalMid: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 0.5,
        paddingVertical: 5,
        borderBottomColor: '#EDEDED',
    },
    grandTotalBottom: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5
    },

    addressContainer: {
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 63,
        shadowOpacity: 0.08,
        elevation: 1
    },
    addrHeader: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F3F3F3'
    },

    address: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
        marginTop: 5
    },
    totalBill: {
        paddingHorizontal: 40,
        paddingVertical: 5,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F3F3F3'
    },
    charges: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        paddingVertical: 5
    },
    grandTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        paddingVertical: 5,
        borderTopWidth: 0.5,
        borderTopColor: '#F3F3F3'
    },
    viewDetails: {
        borderRightWidth: 3,
        borderColor: '#fff',
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center'
    }



})