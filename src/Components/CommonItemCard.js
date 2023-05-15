import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, useWindowDimensions, ScrollView } from 'react-native'
import React, { useRef, useState, useEffect, useContext, startTransition, useCallback, memo, useMemo } from 'react'
import FastImage from 'react-native-fast-image'
import CommonAddButton from './CommonAddButton'
import RBSheet from "react-native-raw-bottom-sheet";
import CommonTexts from './CommonTexts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Toast from 'react-native-toast-message'
import Fontisto from 'react-native-vector-icons/Fontisto'
import FoodSuggestionCard from './FoodSuggestionCard'
import { BlurView } from "@react-native-community/blur";
import { useNavigation } from '@react-navigation/native'
import ItemAddedFromSuggtnCard from './ItemAddedFromSuggtnCard'
import PandaContext from '../contexts/Panda'
import CommonRating from './CommonRating';
import reactotron from '../ReactotronConfig';
import { IMG_URL } from '../config/constants';
import moment from 'moment';
import { min, max } from 'lodash'
import customAxios from '../CustomeAxios';
import CartContext from '../contexts/Cart';
import AuthContext from '../contexts/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderContext from '../contexts/Loader';
import LinearGradient from 'react-native-linear-gradient';
import { has } from 'lodash'

const CommonItemCard = memo(({ height, width, item, marginHorizontal, wishlistIcon, addToCart, mr, ml, mb }) => {


    const contextPanda = useContext(PandaContext)
    const cartContext = useContext(CartContext)
    const userContext = useContext(AuthContext)
    let active = contextPanda.active

    const loadingg = useContext(LoaderContext)



    const refRBSheet = useRef();
    const navigation = useNavigation()
    const [total, setTotal] = useState('')
    const [heart, setHeart] = useState(wishlistIcon ? wishlistIcon : item?.is_wishlist)



    const handleClick = useCallback(() => {
        
        startTransition(() => {
            // if(item?.stock === true){
            //     navigation.navigate('SingleItemScreen', { item: item })
            // }else{
            //     Toast.show({
            //         type: 'error',
            //         text1: 'Item is out of stock'
            //     })
            // }
            navigation.navigate('SingleItemScreen', { item: item })
        })
    }, [])

    const openBottomSheet = () => {
        addToCart(item)
        //refRBSheet.current.open()
        //navigation.navigate('SingleItemScreen', { item: item })
    }

    // const addToCart = useCallback(async () => {
    //     loadingg.setLoading(true)
    //     let cartItems;
    //     let url;

    //     if(item?.variants?.length === 0){
    //         if(cartContext?.cart){
    //             url = "customer/cart/update";
    //             let existing = cartContext?.cart?.product_details?.findIndex(prod => prod.product_id === item?._id)
    //             if(existing >= 0){
    //                 let cartProducts = cartContext?.cart?.product_details;
    //                 cartProducts[existing].quantity = cartProducts[existing].quantity + 1;
    //                 cartItems = {
    //                     cart_id: cartContext?.cart?._id,
    //                     product_details: cartProducts,
    //                     user_id: userContext?.userData?._id
    //                 }
    //             }
    //             else{
    //                 let productDetails = {
    //                     product_id: item?._id,
    //                     name: item?.name,
    //                     image: item?.product_image,
    //                     type: 'single',
    //                     variants: null,
    //                     quantity: 1
    //                 };

    //                 cartItems = {
    //                     cart_id: cartContext?.cart?._id,
    //                     product_details: [...cartContext?.cart?.product_details, productDetails],
    //                     user_id: userContext?.userData?._id
    //                 }
    //             }
    //         }
    //         else{
    //             url = "customer/cart/add";
    //             let productDetails = {
    //                 product_id: item?._id,
    //                 name: item?.name,
    //                 image: item?.product_image,
    //                 type: "single",
    //                 variants:  null,
    //                 quantity: 1
    //             };

    //             cartItems = {
    //                 product_details: [productDetails],
    //                 user_id: userContext?.userData?._id
    //             }
    //         }

    //         await customAxios.post(url, cartItems)
    //         .then(async response => {
    //             cartContext.setCart(response?.data?.data)
    //             await AsyncStorage.setItem("cartId", response?.data?.data?._id)
    //             loadingg.setLoading(false)
    //         })
    //         .catch(async error => {
    //             loadingg.setLoading(false)
    //         })
    //     }
    //     else{
    //         navigation.navigate('SingleItemScreen', { item: item })
    //     }





    // }, [cartContext?.cart])

    const closeRbSheet = useCallback(() => {
        refRBSheet.current.close()
    }, [])



    const getPrice = () => {
        if (item?.variants?.length > 0) {
            let variants = [];
            item?.variants?.map(vari => {
                if (vari?.offer_price && vari?.offer_price > 0 && (moment(vari?.offer_date_from, "YYYY-MM-DD") <= moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD")) && (moment(vari?.offer_date_to, "YYYY-MM-DD") >= moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD"))) {
                    variants.push(vari?.offer_price);
                }
                else {
                    if (vari?.regular_price > 0) {
                        variants.push(vari?.regular_price);
                    }
                    else if (vari?.seller_price > 0) {
                        let commission = 0;
                        if (vari?.commission) {
                            commission = (parseFloat(vari?.seller_price) / 100) * parseFloat(vari?.commission)
                        }

                        let price = parseFloat(vari?.seller_price) + commission;
                        variants.push(price)
                    }
                }
            })
            if (variants && variants?.length > 0) {
                return `₹${min(variants)} - ₹${max(variants)}`
            }
            else {
                return 0;
            }
        }
        else {
            if (item?.offer_price && item?.offer_price > 0) {
                if (item?.offer_price && (moment(item?.offer_date_from, "YYYY-MM-DD") <= moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD")) && (moment(item?.offer_date_to, "YYYY-MM-DD") >= moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD"))) {
                    return `₹${item?.offer_price}`;
                }
                else {
                    if (item?.regular_price && item?.regular_price > 0) {
                        return `₹${item?.regular_price}`;
                    }
                    else if (item?.seller_price && item?.seller_price > 0) {
                        let commission = 0;
                        if (item?.commission) {
                            commission = (parseFloat(item?.seller_price) / 100) * parseFloat(item?.commission)
                        }
                        let price = parseFloat(item?.seller_price) + commission;
                        return `₹${price}`
                    }
                    else {
                        return 0;
                    }
                }
            }
            else {
                if (parseFloat(item?.regular_price) > 0) {
                    return `₹${item?.regular_price}`;
                }
                else if (item?.seller_price > 0) {
                    let commission = 0;
                    if (item?.commission) {
                        commission = (parseFloat(item?.seller_price) / 100) * parseFloat(item?.commission)
                    }
                    let price = parseFloat(item?.seller_price) + commission;
                    return `₹${price}`;
                }
                else {
                    return 0;
                }
            }
        }
    }

    const RemoveAction = useCallback(async () => {

        let datas = {
            type: active,
            product_id: item?._id
        }

        await customAxios.post(`customer/wishlist/delete`, datas)
            .then(async response => {
                setHeart(!heart)
                // if(has(response?.data, 'data')){

                // }
                // else if(has(response?.data, 'message')){
                //     Toast.show({
                //         type: 'info',
                //         text1: response?.data?.message
                //     })
                // }
                // reactotron.log({response})
                // setAvailabelPdts(response?.data?.data)
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
            })

    }, [heart])

    const AddAction = useCallback(async () => {
        //setHeart(!heart)

        let datas = {
            type: active,
            product_id: item?._id
        }

        await customAxios.post(`customer/wishlist/create`, datas)
            .then(async response => {
                setHeart(!heart)
                // if(has(response?.data, 'data')){
                //     setHeart(!heart)
                // }
                // else if(has(response?.data, 'message')){
                //     Toast.show({
                //         type: 'info',
                //         text1: response?.data?.message
                //     })
                // }
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
            })

    }, [heart])


    return (
        <>
            <TouchableOpacity
                onPress={getPrice() != 0 ? handleClick : null}
                style={{ marginHorizontal: marginHorizontal, marginRight: mr, marginLeft: ml, marginBottom: mb }}
            >
                <FastImage
                    // source={{ uri: `${IMG_URL}${item?.product_image}` }}
                    source={item?.product_image === null ? require('../Images/jeans.jpg') : { uri: `${IMG_URL}${item?.product_image}` }}
                    style={{ height: height ? height : 110, width: width, justifyContent: 'flex-end', borderRadius: 16 }}
                >
                    <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)']} style={{ height: '100%', justifyContent: 'flex-end', padding: 10 }}>
                        {/* {(item?.stock === (true || false) && parseFloat(item?.stock_value) >= 1)  &&
                        <Text style={{color:'red'}}>OUT OF STOCK{item?.stock_value}</Text>} */}
                        <Text style={styles.textSemi}>{item?.name}</Text>
                        <Text style={styles.textSemi}>{getPrice()}</Text>
                        <Text style={styles.lightText}>{item?.store?.name}</Text>
                    </LinearGradient>

                    {getPrice() != 0 && <View style={styles.addContainer}>
                        <CommonAddButton
                            onPress={openBottomSheet}
                        />
                    </View>}

                    {/* {!fashion && item?.openCloseTag && <View
                        style={{ position: 'absolute', right: 7, top: 7, backgroundColor: item?.openCloseTag === 'Closes Soon' ? '#FF0000' : '#58D36E', borderRadius: 8 }}
                    >
                        <Text style={styles.tagText}>{item?.openCloseTag}</Text>
                    </View>} */}

                    {active === 'fashion' || active === 'green' && <TouchableOpacity
                        onPress={heart ? RemoveAction : AddAction}
                        style={styles.hearIcon}
                    >
                        <Fontisto name={"heart"} color={heart ? "#FF6464" : '#EDEDED'} size={12} />
                    </TouchableOpacity>}

                </FastImage>

            </TouchableOpacity>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={false}
                closeOnPressMask={true}
                height={450}
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent",
                    },
                    draggableIcon: {
                        backgroundColor: "#000"
                    },
                    container: {
                        backgroundColor: 'transparent',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    },
                }}
            >
                <BlurView
                    blurType="light"
                    blurAmount={25}
                    style={{ flex: 1 }}
                >
                    <View style={{ paddingHorizontal: 15, flex: 1 }}>
                        <View style={styles.RBsheetHeader}>
                            <CommonTexts label={active === 'fashion' || active === 'green' ? "Similar Products" : 'More items you may like...'} />
                            <TouchableOpacity
                                onPress={closeRbSheet}
                            >
                                <Ionicons name='close-circle' color='#000' size={25} />
                            </TouchableOpacity>
                        </View>
                        {/* {addedList?.map((item, index) => <ItemAddedFromSuggtnCard item={item} key={index} />)} */}
                        {/* <ScrollView >
                            {suggestions?.map((item) =>
                                <FoodSuggestionCard
                                    onPress={() => setAddedList(oldArray => [...oldArray, item])}
                                    item={item}
                                    key={item?._id}
                                />
                            )}
                        </ScrollView> */}
                    </View>
                </BlurView>
                <View
                    style={{
                        backgroundColor: active === 'fashion' ? '#FF7190' : active === 'green' ? '#8ED053' : '#58D36E',
                        height: 60,
                        flexDirection: 'row',   
                        alignItems: 'center',
                        paddingHorizontal: 40,
                        width: '100%',
                    }}
                >
                   
                    <View style={styles.totalCount}>
                        {/* <Text style={styles.bottomCountText}>{addedList.length} item</Text> */}
                        <Text style={styles.bottomRateText}>₹ {total}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.viewCartBox}
                    // onPress={viewCart}
                    >
                        <CommonTexts label={'View Cart'} color='#fff' fontSize={23} />
                    </TouchableOpacity>

                </View>
            </RBSheet>
        </>
    )
})

export default CommonItemCard

const styles = StyleSheet.create({


    bottomCountText: {
        fontFamily: 'Poppins-medium',
        color: '#fff',
        fontSize: 11,
    },
    bottomRateText: {
        fontFamily: 'Poppins-ExtraBold',
        color: '#fff',
        fontSize: 18,
    },
    textSemi: {
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        fontSize: 10,
        paddingBottom: 2
    },
    lightText: {
        fontFamily: 'Poppins-Light',
        color: '#fff',
        fontSize: 7,
        marginBottom: 3
    },
    addContainer: {
        position: 'absolute',
        right: 5,
        bottom: 10
    },
    tagText: {
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        fontSize: 12,
        padding: 5
    },
    hearIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'

    },
    RBsheetHeader: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 10
    },
    totalCount: {
        borderRightWidth: 3,
        borderColor: '#fff',
        flex: 0.4
    },
    outofstock: {
        borderRightWidth: 3,
        borderColor: '#fff',
        flex: 0.4
    },
    viewCartBox: {
        alignItems: 'flex-end',
        flex: 0.5
    }
})