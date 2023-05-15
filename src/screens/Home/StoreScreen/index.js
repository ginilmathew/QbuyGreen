import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity, ActivityIndicator,RefreshControl } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import FastImage from 'react-native-fast-image'
import PandaContext from '../../../contexts/Panda'
import CommonItemSelect from '../../../Components/CommonItemSelect'
import CommonItemCard from '../../../Components/CommonItemCard'
import TypeCard from '../Grocery/TypeCard'
import { IMG_URL, env, location } from '../../../config/constants'
import LoaderContext from '../../../contexts/Loader'
import customAxios from '../../../CustomeAxios'
import HotelCard from '../Category/HotelCard'
import StoreAddressCard from '../Category/StoreAddressCard'
import Toast from 'react-native-toast-message'
import AuthContext from '../../../contexts/Auth'
import CartContext from '../../../contexts/Cart'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { isEmpty } from 'lodash'


const StoreScreen = ({ route, navigation }) => {

    const { width } = useWindowDimensions()


    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const loadingContex = useContext(LoaderContext)
    const userContext = useContext(AuthContext)
    const cartContext = useContext(CartContext)
    let loadingg = loadingContex?.loading

    const name = route?.params?.name
    const mode = route?.params?.mode
    const item = route?.params?.item
    const storeId = route?.params?.storeId


    const [storeDetails, setStoreDetails] = useState([])
    const [categories, setCategories] = useState([])

    const [selected, setSelected] = useState(false)

    useEffect(() => {
        getStoreDetails()
    }, [])

    const getStoreDetails = async () => {
        loadingContex.setLoading(true)

        let data = {
            vendor_id: item?._id ?  item?._id : storeId,
            coordinates: env === "dev" ? location : userContext?.location
        }

        await customAxios.post(`customer/store`, data)
            .then(async response => {
                setStoreDetails(response?.data?.data)
                loadingContex.setLoading(false)
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
                loadingContex.setLoading(false)
            })
    }



  
    // const addToCart = async (item) => {

    //     let cartItems;
    //     let url;
    //     let productDetails;
    //     let minimumQty = !isEmpty(item?.minimum_qty) ? parseFloat(item?.minimum_qty) : 1

    //     if(item?.variants?.length === 0){
    //         loadingContex.setLoading(true)
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
    //             loadingContex.setLoading(false)
    //         })
    //         .catch(async error => {
    //             Toast.show({
    //                 type: 'error',
    //                 text1: error
    //             })
    //             loadingContex.setLoading(false)
    //         })
    //     }
    //     else{
    //         navigation.navigate('SingleItemScreen', { item: item })
    //     }
        


       

    // }
    const addToCart = async (item) => {

        let cartItems;
        let url;
        let productDetails;
        let minimumQty = !isEmpty(item?.minimum_qty) ? parseFloat(item?.minimum_qty) : 1

        if (item?.variants?.length === 0) {
            
            if (cartContext?.cart) {
                url = "customer/cart/update";
                let existing = cartContext?.cart?.product_details?.findIndex(prod => prod.product_id === item?._id)
                if (existing >= 0) {
                    let cartProducts = cartContext?.cart?.product_details;
                    let quantity = cartProducts[existing].quantity + 1;

                    if(item?.stock_value >= quantity){
                        cartProducts[existing].quantity = cartProducts[existing].quantity + 1;
                        cartItems = {
                            cart_id: cartContext?.cart?._id,
                            product_details: cartProducts,
                            user_id: userContext?.userData?._id
                        }
                    }
                    else{
                        Toast.show({
                            type: 'info',
                            text1: 'Required quantity not available'
                        })
                        return false;
                    }

                    
                }
                else {
                    
                    if(item?.stock === true){
                        if(item?.stock_value >= minimumQty){
                            productDetails = {
                                product_id: item?._id,
                                name: item?.name,
                                image: item?.product_image,
                                type: 'single',
                                variants: null,
                                quantity: minimumQty
                            };
                        }
                        else{
                            Toast.show({
                                type: 'error',
                                text1: "Required quantity not available"
                            });
                            return false;
                        }
                    }
                    else{
                        productDetails = {
                            product_id: item?._id,
                            name: item?.name,
                            image: item?.product_image,
                            type: 'single',
                            variants: null,
                            quantity: minimumQty
                        };
                    }

                    cartItems = {
                        cart_id: cartContext?.cart?._id,
                        product_details: [...cartContext?.cart?.product_details, productDetails],
                        user_id: userContext?.userData?._id
                    }
                }
            }
            else {
                url = "customer/cart/add";
                if(item?.stock === true){
                    if(item?.stock_value >= minimumQty){
                        productDetails = {
                            product_id: item?._id,
                            name: item?.name,
                            image: item?.product_image,
                            type: 'single',
                            variants: null,
                            quantity: minimumQty
                        };
                    }
                    else{
                        Toast.show({
                            type: 'error',
                            text1: "Required quantity not available"
                        });
                        return false;
                    }
                }
                else{
                    productDetails = {
                        product_id: item?._id,
                        name: item?.name,
                        image: item?.product_image,
                        type: 'single',
                        variants: null,
                        quantity: minimumQty
                    };
                }


                cartItems = {
                    product_details: [productDetails],
                    user_id: userContext?.userData?._id
                }
            }
            loadingContex.setLoading(true)
            await customAxios.post(url, cartItems)
                .then(async response => {
                    cartContext.setCart(response?.data?.data)
                    await AsyncStorage.setItem("cartId", response?.data?.data?._id)
                    loadingContex.setLoading(false)
                })
                .catch(async error => {
                    loadingContex.setLoading(false)
                    Toast.show({
                        type: 'error',
                        text1: error
                    })
                })
        }
        else {
            navigation.navigate('SingleItemScreen', { item: item })
        }
    }

    const backToCart = useCallback(() => {
        navigation.navigate('Cart')
    },[])

    const backToCheckout = useCallback(() => {
        navigation.navigate('Checkout')
    },[])


    return (
        <>
            <HeaderWithTitle title={mode === 'store' ? item?.store_name : name} onPressBack={mode === 'cartItem' ? backToCart : mode === 'checkoutItem' ? backToCheckout : '' } />
            <ScrollView
                style={{ flex: 1, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={ loadingContex.loading} onRefresh={getStoreDetails} />
                }>
            
                <View style={{ paddingHorizontal: 10 }}>
                    <FastImage
                        source={item?.store_logo ? { uri: `${IMG_URL}${item?.store_logo}` } : storeDetails?.store_logo ?  { uri: `${IMG_URL}${storeDetails?.store_logo}` } : require('../../../Images/storeImage.jpg')}
                        // source={{ uri: `${IMG_URL}${item?.image}` }}
                        style={styles.mainImage}
                        borderRadius={15}
                    />
                    <StoreAddressCard address={item?.store_address ? item?.store_address : storeDetails?.store_address} />
                    <Text style={styles.description}>{item?.seo_description}</Text>
                </View>

                <View style={{ backgroundColor: '#76867314', paddingBottom: 10, }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ flexDirection: 'row', marginTop: 15 }}
                    >
                        {storeDetails?.category_id?.map((cat, index) =>
                            (<TypeCard item={cat} key={index} storeId={item?._id} />)
                        )}
                    </ScrollView>
                </View>


                <CommonTexts label={'Available Products'} my={15} ml={10} fontSize={13} />
                <View style={styles.itemContainer}>
                    {storeDetails?.products?.map((item) => (
                        <CommonItemCard
                            item={item}
                            key={item?._id}
                            width={width / 2.2}
                            height={250}
                            addToCart={addToCart}
                        />
                    ))}
                </View>

            </ScrollView>
        </>
    )
}

export default StoreScreen

const styles = StyleSheet.create({
    mainImage: {
        width: '100%',
        height: 200,
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 15
    },
    description: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 13,
        marginTop: 10
    },

    hotelView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: '3%'
    },
    recommPdtBox: {
        marginTop: 15,
        marginBottom: 60,
        backgroundColor: '#76867314',
        paddingVertical: 5
    },
    restaurantView: {
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: '#F7F7F7',
        paddingVertical: 10
    },
    foodName: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5
    },
    itemContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: '3%'
    },


})