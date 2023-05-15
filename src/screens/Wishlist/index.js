import { StyleSheet, Text, View, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
import HeaderWithTitle from '../../Components/HeaderWithTitle'
import CommonItemMenuList from '../../Components/CommonItemMenuList'
import CommonItemCard from '../../Components/CommonItemCard'
import LoaderContext from '../../contexts/Loader'
import customAxios from '../../CustomeAxios'
import PandaContext from '../../contexts/Panda'
import Toast from 'react-native-toast-message';
import CartContext from '../../contexts/Cart'
import AuthContext from '../../contexts/Auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { isEmpty, isArray } from 'lodash'

const Wishlist = ({navigation}) => {

    const { width } = useWindowDimensions()

    const loadingContex = useContext(LoaderContext)
    const cartContext = useContext(CartContext)
    const userContext = useContext(AuthContext)
    const contextPanda = useContext(PandaContext)


    let loadingg = loadingContex?.loading
    let active = contextPanda.active
  
    const [wishlist, setWishlist] = useState([])


    useEffect(() => {
        getWishlist()
    }, [])

    const getWishlist = async() => {
        loadingContex.setLoading(true)
        let data = {
            type: active
        }
        await customAxios.post(`customer/wishlist/list`, data)
      
        .then(async response => {
            let datas = response?.data?.data?.product_details;
            //setWishlist(datas)
            if(isArray(datas)){
                setWishlist(datas)
            }
            else{
                Toast.show({
                    type: 'info',
                    text1: "Something went wrong!"
                })
            }
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



    return (
        <>
            <HeaderWithTitle title={'Wishlist'}  />
            <ScrollView
                style={{ flex: 1,  backgroundColor:  active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff' , paddingTop:10}}
            >
                <View style={styles.container}>
                    {loadingg ? <ActivityIndicator style={{width:width}}/> : wishlist?.map((item, index) => (
                        <CommonItemCard
                            item={item}
                            key={index}
                            width={width/2.2}
                            height={250}
                            wishlistIcon
                            addToCart={addToCart}
                        />
                    ))}
                </View>
            </ScrollView>
        </>


    )
}

export default Wishlist

const styles = StyleSheet.create({
    container : {
        flexDirection:'row', 
        flexWrap:'wrap', 
        gap:10, 
        paddingHorizontal:'3%',
    }
})