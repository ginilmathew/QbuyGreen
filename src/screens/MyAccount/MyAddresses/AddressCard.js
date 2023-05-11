import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useContext, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CommonTexts from '../../../Components/CommonTexts'
import PandaContext from '../../../contexts/Panda'
import AuthContext from '../../../contexts/Auth'
import { navigate } from '../../../Navigations/RootNavigation'

const AddressCard = memo(({ setSelected, selected, item }) => {

    const contextPanda = useContext(PandaContext)
    const userContext = useContext(AuthContext)
    let active = contextPanda.active

    const onClick = useCallback(() => {
      navigate("LocationScreen", { editAddress: item })

    }, [])

    return (
        <TouchableOpacity
            // disabled={selected}
            onPress={onClick}
            style={styles.container}
        >
            <View style={{ marginHorizontal: 5 }}>
                <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} size={20} />
            </View>
            <View style={{ flex: 0.9 }}>
                <View style={styles.rowStyle}><CommonTexts label={item?.address_type} fontSize={13} textTransform={'uppercase'} />{!selected ? <Pressable style={styles.borderStyle}><Text style={styles.textStyle}>Set Default</Text></Pressable> : ''}</View>
                <Text
                    style={styles.addressText}
                >{item?.area?.address}</Text>
            </View>

            <Text
                style={{
                    fontFamily: 'Poppins-Bold',
                    color: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#31AF48',
                    fontSize: 11,
                    marginTop: 5,
                    position: 'absolute',
                    right: 10
                }}
            >{item?.default ? 'DEFAULT' : null}</Text>
        </TouchableOpacity>
    )
})

export default AddressCard

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 15,
        borderWidth: 1,
        flexDirection: 'row',
        borderColor: '#E9E9E9',
        paddingVertical: 8,
    },
    addressText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
        marginTop: 5
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    borderStyle: {

    },
    textStyle: {
        fontSize: 12,
        margin: 1,
        color: 'black',
        fontWeight: '600',
        marginRight: -15, color: '#8ED053'
    }

})