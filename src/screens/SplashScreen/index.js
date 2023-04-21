import { Image, ImageBackground, NativeModules, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommonAuthBg from '../auth/CommonAuthBg'


const SplashScreen = ({ navigation }) => {

    return (
        <CommonAuthBg>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={require('../../Images/splash.png')}
                    style={{ width: 250, height: 300 }}
                    resizeMode='contain'
                />
            </View>
        </CommonAuthBg>

    )
}

export default SplashScreen

const styles = StyleSheet.create({

})