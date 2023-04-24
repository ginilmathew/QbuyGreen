import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { memo, useCallback, useContext, useState } from 'react'
import PandaContext from '../contexts/Panda'


const CommonItemSelect = memo(({item, setSelected, selected}) => {

    const contextPanda = useContext(PandaContext)
    let grocery = contextPanda.greenPanda
    let fashion = contextPanda.pinkPanda


    const onClick = useCallback(() => {
        setSelected(item?.name)
    },[])
    
    return (
        
        <TouchableOpacity
            key={item?._id}
            onPress={onClick}
            style={{ width: 80, backgroundColor: selected === item?.name ? grocery ? '#8ED053' : fashion ?  '#FF7190' : '#58D36E' : '#fff', borderRadius: 10, elevation: 10, alignItems: 'center', justifyContent: "center", marginLeft: 10, marginVertical: 10, shadowOpacity: 0.1, shadowRadius: 1, }}
        >
            <Text 
                numberOfLines={1}
                style={{
                    fontFamily: 'Poppins-Regular',
                    color: selected === item?.name ? '#fff' : '#23233C',
                    fontSize: 11,
                    paddingVertical: 8,
                    paddingHorizontal:5
                }}
            >{item?.name}</Text>

        </TouchableOpacity>
           
    )
})

export default CommonItemSelect

const styles = StyleSheet.create({
    foodTypeText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 14,
        paddingVertical: 8
    },
    foodTypeView: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        marginTop: 5
    },
})