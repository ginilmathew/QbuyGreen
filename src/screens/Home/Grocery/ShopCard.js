import React,{useState, useEffect, memo, useCallback} from 'react'
import { View, ImageBackground, StyleSheet,TouchableOpacity,useWindowDimensions, Text } from "react-native";
import { useNavigation } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import { IMG_URL } from '../../../config/constants';



const ShopCard = memo(({item}) => {

    const {width} = useWindowDimensions()
    const navigation = useNavigation();

    const onClick = useCallback(() => {
        navigation.navigate('store', {name : item?.name, mode : 'store', item:item})
    }, [])

    return (
        <TouchableOpacity 
            key={item?._id}  
            onPress={onClick} 
            style={{width: width/4.5,height:80,alignItems:'center', marginTop:10}}
        >
            <FastImage
                style={{ width: 60, height: 60, borderRadius: 10 }}
                source={ item?.store_logo ? {  uri: `${IMG_URL}${item?.store_logo}` }  : require('../../../Images/vegies.png')}
                borderRadius={10}
            />
            <Text 
                numberOfLines={1}
                style={styles.itemText}
            >{item?.store_name}</Text>
        </TouchableOpacity>
    )
})

export default ShopCard

const styles = StyleSheet.create({

    itemText : { 
        textAlign:'center', 
        fontSize:11, 
        marginTop:5, 
        fontFamily:'Poppins-Medium', 
        color:'#23233C' 
    }
})