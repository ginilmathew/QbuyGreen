import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
        navigate("LocationScreen", { address: item })
        setSelected(item?._id)

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
                <CommonTexts label={item?.address_type} fontSize={13} />
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
            >{item?.default === '1' ? 'DEFAULT' : null}</Text>
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
        paddingVertical: 8
    },
    addressText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
        marginTop: 5
    },

})