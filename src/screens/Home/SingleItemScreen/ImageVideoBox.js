import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useEffect, useContext, memo, useCallback } from 'react'
import FastImage from 'react-native-fast-image'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PandaContext from '../../../contexts/Panda'
import { IMG_URL } from '../../../config/constants'

const ImageVideoBox = memo(({selectedImage, setSelectedImage, onPress, item, index}) => {

    const { width, height } = useWindowDimensions()

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active


    const onClick = useCallback(() => {
        setSelectedImage(index)
    },[])

    return (
        <TouchableOpacity
            key={item?._id}
            onPress={onClick}
            style={{ width: width / 8, height: height / 17, marginHorizontal: 7 }}
        >
            <FastImage
                // source={item?.name}
                source={{ uri: `${IMG_URL}${item}` }}
                style={{ width: '100%', height: '100%', borderRadius: 12, borderWidth: 2, borderColor: selectedImage === index ? active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E' : "transparent", alignItems: 'center', justifyContent: 'center' }}
                borderRadius={10}
            >
                {item.file_type === 'video' && <View style={{ backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 20, alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }}><Ionicons name='ios-play' color='#fff' size={13} marginLeft={2.5} /></View>}
            </FastImage>

        </TouchableOpacity>
    )
})

export default ImageVideoBox

const styles = StyleSheet.create({})