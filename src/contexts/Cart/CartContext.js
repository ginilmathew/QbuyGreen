import React, { useState, useEffect, useCallback, useContext } from "react";
import Context from "./index";
import { Animated } from 'react-native'
import customAxios from "../../CustomeAxios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import LoaderContext from "../Loader";
import AuthContext from "../Auth";

const CartProvider = (props) => {

    const [cart, setCart] = useState(null);
    const [address, setAddress] = useState(null);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [animation, setAnimation] = useState(new Animated.ValueXY({ x: 0, y: 0 }))
    const loadingContext = useContext(LoaderContext)
    const authCOntext = useContext(AuthContext)

    const userData = authCOntext.userData

    useEffect(() => {
        getDefaultAddress()
    }, [address])


    const addToCart = async(item, selectedVariant) => {
        let cartItems, url;
        let productDetails;
        let minimumQty = item?.minQty ? item?.minQty : 1

        if(cart){
            url = "customer/cart/update";
            let cartProducts = cart?.product_details;
            let existing;
            if(item?.variant){
                existing = cart?.product_details?.find(prod => prod.product_id === item?._id && prod?.variants?.[0]?.variant_id === selectedVariant?.id)
            }
            else{
                existing = cart?.product_details?.find(prod => prod.product_id === item?._id)
            }
            if(existing){
                existing.quantity = existing.quantity + 1;
                cartItems = {
                    cart_id: cart?._id,
                    product_details: cartProducts,
                    user_id: userData?._id
                }
            }
            else {
                productDetails = {
                    product_id: item?._id,
                    name: item?.name,
                    image: item?.product_image,
                    type: item?.variant ? 'variant' : 'single',
                    variants: item?.variant ? [
                        {
                            variant_id: selectedVariant?.id,
                            attributs: selectedVariant?.attributs
                        }
                    ] : null,
                    quantity: minimumQty
                };
                cartItems = {
                    cart_id: cart?._id,
                    product_details: [...cart?.product_details, productDetails],
                    user_id: userData?._id
                }
            }
        }
        else{
            url = "customer/cart/add";
            productDetails = {
                product_id: item?._id,
                name: item?.name,
                image: item?.product_image,
                type: item?.variant ? 'variant' : 'single',
                variants: item?.variant ? [
                    {
                        variant_id: selectedVariant?.id,
                        attributs: selectedVariant?.attributs
                    }
                ] : null,
                quantity: minimumQty
            };
            cartItems = {
                product_details: [productDetails],
                user_id: userData?._id
            }

            
        }

        loadingContext.setLoading(true)
        await customAxios.post(url, cartItems)
        .then(async response => {
            setCart(response?.data?.data)
            //user?.setCartId(response?.data?.data?._id)
            await AsyncStorage.setItem("cartId", response?.data?.data?._id)
            loadingContext.setLoading(false)
            Toast.show({
                type: 'success',
                text1: 'Product added to cart',
                position: 'top'
            })
            //navigation.navigate('cart')
        })
        .catch(async error => {
            console.log(error)
            Toast.show({
                type: 'error',
                text1: error
            });
            loadingContext.setLoading(false)
        })
    }


    const getDefaultAddress = useCallback(() => {
        if (address) {
            let defau = address?.find(add => add.default === true)

            if (defau) {
                setDefaultAddress(defau)
            }
            else {
                setDefaultAddress(address[0])
            }
        }

    }, [address])

    return (
        <Context.Provider
            value={{
                ...props,
                cart,
                address,
                defaultAddress,
                setCart,
                setAddress,
                getDefaultAddress,
                setDefaultAddress,
                setAnimation,
                animation,
                addToCart

            }}
        >
            {props.children}
        </Context.Provider>
    );
}

export default CartProvider;

