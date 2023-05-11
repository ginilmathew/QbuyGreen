import React, { useState, useEffect, useCallback } from "react";
import Context from "./index";
import Geolocation from 'react-native-geolocation-service';
import reactotron from "reactotron-react-native";

const AddressProvider = (props) => {
    
    const [location, setLocation] = useState(null)
    const [currentAddress, setCurrentAddress] = useState(null)


    const [cartId, setCartId] = useState('');
    return (
        <Context.Provider
            value={{
                ...props,
                location,
                setLocation,
                currentAddress,
                setCurrentAddress
            }}
        >
            {props.children}
        </Context.Provider>
    );
}

export default AddressProvider;
