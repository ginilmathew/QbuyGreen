import React, { useState, useEffect, useCallback } from "react";
import Context from "./index";
import { Animated } from 'react-native'

const CartProvider = (props) => {

    const [cart, setCart] = useState(null);
    const [address, setAddress] = useState(null);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [animation, setAnimation] = useState(new Animated.ValueXY({ x: 0, y: 0 }))

    useEffect(() => {
        getDefaultAddress()
    }, [address])


    const getDefaultAddress = useCallback(() => {
        if (address) {
            let defau = address?.find(add => add.default === 1)

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
                animation

            }}
        >
            {props.children}
        </Context.Provider>
    );
}

export default CartProvider;

