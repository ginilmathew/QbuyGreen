import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, {useContext} from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CommonAuthHeading from '../screens/auth/CommonAuthHeading'

const CommonTitle = ({ mt, goBack}) => {

    const { width, height } = useWindowDimensions()

    return (
        <View  style={{width:'100%', marginTop:mt, flexDirection:'row', alignItems:'center'}}>
            {goBack&&<TouchableOpacity
                onPress={goBack}
                style={{flex:0.51}}
            > 
                <AntDesign name='arrowleft' size={35} color='#6DB87A' />
            </TouchableOpacity>}
            <CommonAuthHeading label={'OTP'} />
        </View>
    )
}

export default CommonTitle

const styles = StyleSheet.create({})