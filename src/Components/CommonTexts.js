import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CommonTexts = ({label, mt, textAlign, color, fontSize, my, ml, mb}) => {
    return (
        <Text
            style={{
                fontFamily: 'Poppins-SemiBold',
                color: color ? color : '#23233C',
                fontSize: fontSize ? fontSize : 11,
                marginTop: mt,
                textAlign: textAlign,
                marginVertical: my,
                marginLeft:ml,
                marginBottom:mb,
            }}
        >{label}</Text>
    )
}

export default CommonTexts

const styles = StyleSheet.create({})