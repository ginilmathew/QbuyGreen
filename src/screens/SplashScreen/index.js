import { Image, ImageBackground, NativeModules, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'
import CommonAuthBg from '../auth/CommonAuthBg'


const SplashScreen = ({ navigation }) => {

    const { width, height } = useWindowDimensions()

    return (
       <Image
            source={require('../../Images/splash.png')}
            style={{ width: width, height: height }}
            resizeMode='cover'
        />

    )
}

export default SplashScreen

const styles = StyleSheet.create({

})