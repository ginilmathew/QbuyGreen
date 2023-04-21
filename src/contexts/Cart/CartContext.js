import React, { useState, useEffect, useCallback } from "react";
import Context from "./index";
import Geolocation from 'react-native-geolocation-service';
import reactotron from "reactotron-react-native";

const CartProvider = (props) => {

    const [cart, setCart] = useState(null);
    const [address, setAddress] = useState(null);
    const [defaultAddress, setDefaultAddress] = useState(null);

    useEffect(() => {
        getDefaultAddress()
    }, [address])
    

    const getDefaultAddress = useCallback(() => {
        if(address){
            let defau = address?.find(add =>  add.default === 1)

            if(defau){
                setDefaultAddress(defau)
            }
            else{
                setDefaultAddress(address[0])
            }
        }
        
    },[address])

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
                setDefaultAddress
            }}
        >
            {props.children}
        </Context.Provider>
    );
}

export default CartProvider;

