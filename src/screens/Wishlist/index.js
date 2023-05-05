import { StyleSheet, Text, View, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
import HeaderWithTitle from '../../Components/HeaderWithTitle'
import CommonItemMenuList from '../../Components/CommonItemMenuList'
import CommonItemCard from '../../Components/CommonItemCard'
import LoaderContext from '../../contexts/Loader'
import reactotron from '../../ReactotronConfig'
import customAxios from '../../CustomeAxios'
import PandaContext from '../../contexts/Panda'
import CartContext from '../../contexts/Cart'
import AuthContext from '../../contexts/Auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Wishlist = ({navigation}) => {

    const loadingContex = useContext(LoaderContext)
    const cartContext = useContext(CartContext)
    const userContext = useContext(AuthContext)

    let loadingg = loadingContex?.loading

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const { width } = useWindowDimensions()

  
    const [wishlist, setWishlist] = useState([])

    reactotron.log({wishlist})


    useEffect(() => {
        getWishlist()
    }, [])

    const getWishlist = async() => {
        loadingContex.setLoading(true)
        let data = {
            type:'fashion'
        }
        await customAxios.post(`customer/wishlist/list`, data)
      
        .then(async response => {
            setWishlist(response?.data?.data?.product_details)
            loadingContex.setLoading(false)
        })
        .catch(async error => {
            // toast.show({
            //     title: 'Error',
            //     description : error,
            //     backgroundColor:'red.500'
            // })
            loadingContex.setLoading(false)
        })
    }

    const addToCart = async (item) => {
        
        let cartItems;
        let url;

        if(item?.variants?.length === 0){
            // loadingContex.setLoading(true)
            if(cartContext?.cart){
                url = "customer/cart/update";
                let existing = cartContext?.cart?.product_details?.findIndex(prod => prod.product_id === item?._id)
                if(existing >= 0){
                    let cartProducts = cartContext?.cart?.product_details;
                    cartProducts[existing].quantity = cartProducts[existing].quantity + 1;
                    cartItems = {
                        cart_id: cartContext?.cart?._id,
                        product_details: cartProducts,
                        user_id: userContext?.userData?._id
                    }
                }
                else{
                    let productDetails = {
                        product_id: item?._id,
                        name: item?.name,
                        image: item?.product_image,
                        type: 'single',
                        variants: null,
                        quantity: 1
                    };

                    cartItems = {
                        cart_id: cartContext?.cart?._id,
                        product_details: [...cartContext?.cart?.product_details, productDetails],
                        user_id: userContext?.userData?._id
                    }
                }
            }
            else{
                url = "customer/cart/add";
                let productDetails = {
                    product_id: item?._id,
                    name: item?.name,
                    image: item?.product_image,
                    type: "single",
                    variants:  null,
                    quantity: 1
                };

                cartItems = {
                    product_details: [productDetails],
                    user_id: userContext?.userData?._id
                }
            }

            await customAxios.post(url, cartItems)
            .then(async response => {
                cartContext.setCart(response?.data?.data)
                await AsyncStorage.setItem("cartId", response?.data?.data?._id)
                loadingContex.setLoading(false)
            })
            .catch(async error => {
                loadingContex.setLoading(false)
            })
        }
        else{
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
                    {loadingg ? <ActivityIndicator style={{width:width}}/> : wishlist?.map((item) => (
                        <CommonItemCard
                            item={item}
                            key={item?._id}
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