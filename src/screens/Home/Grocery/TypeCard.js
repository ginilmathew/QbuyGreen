import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch, Platform, useWindowDimensions } from 'react-native'
import React, { memo, useCallback, useContext, useRef, useState } from 'react'

import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native'
import { IMG_URL } from '../../../config/constants'
import PandaContext from '../../../contexts/Panda'
import reactotron from 'reactotron-react-native'


const TypeCard = memo(({item, mode, onCategoryPress, storeId}) => {

    //reactotron.log({selected, id: item})

    const contextPanda = useContext(PandaContext)

    const { width } = useWindowDimensions()
    const navigation = useNavigation()

    const onClick = useCallback(() => {
        navigation.navigate('Category', {name : item?.name, mode: contextPanda.active, item : item, storeId })
    }, [])

    return (
      
        <TouchableOpacity 
            onPress={onClick} 
            key={item?._id} 
            style={{ alignItems: 'center', width: width / 4 }}
        >
            <FastImage
                style={{ width: 60, height: 60, borderRadius: 30,  }}
                source={item?.image ? { uri: `${IMG_URL}${item?.image}` } : require('../../../Images/jeans.jpg')}
                borderRadius={30}
            />
            <Text
                numberOfLines={1}
                style={styles.shopName}
            >{item?.name}</Text>
        </TouchableOpacity>
          
    )
})

export default TypeCard

const styles = StyleSheet.create({
    shopName: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 5,
        paddingHorizontal: 5,
    },
})