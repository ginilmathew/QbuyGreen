import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch, Platform, useWindowDimensions } from 'react-native'
import React, { memo, useCallback, useContext, useRef, useState } from 'react'

import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native'
import { IMG_URL } from '../../../config/constants'
import PandaContext from '../../../contexts/Panda'
import reactotron from 'reactotron-react-native'


const TypeCard = memo(({ item, mode, onCategoryPress, storeId }) => {


    const contextPanda = useContext(PandaContext)

    const { width, fontScale, height } = useWindowDimensions()

    let imageWidth = width / 6

    const styles = makeStyles(fontScale, height);
    const navigation = useNavigation()

    const onClick = useCallback(() => {
        navigation.navigate('Category', { name: item?.name, mode: contextPanda.active, item: item, storeId })
    }, [item])

    return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 5, padding: 5 }}>
            <TouchableOpacity
                onPress={onClick}
                key={item?._id}
                style={{ alignItems: 'center', width: imageWidth, height: imageWidth }}
            >
                <FastImage
                    style={{ borderRadius: imageWidth / 2, width: '100%', height: '100%' }}
                    source={{ uri: `${IMG_URL}${item?.image}` }}
                    borderRadius={30}
                />

            </TouchableOpacity>
            <Text
                numberOfLines={2}
                style={styles.shopName}
            >{item?.name}</Text>
        </View>
    )
})

export default TypeCard

const makeStyles = (fontScale, width) => StyleSheet.create({
    shopName: {
        fontFamily: 'Poppins-SemiBold',
        color: '#23233C',
        fontSize: 0.013 * width,
        textAlign: 'center',
        marginTop: 5,
        paddingHorizontal: 5,
        fontWeight: 'bold'
    },
})