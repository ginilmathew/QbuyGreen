import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'

const ItemsCard = memo(({item}) => {

    const navigation = useNavigation()

    const goToShop = useCallback(() => {
        navigation.navigate('SingleHotel',{item : item, mode:'orderItem'})
    }, [])

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.5 }}>
                <Text style={styles.text1}>{item?.name}</Text>
                <TouchableOpacity onPress={goToShop}>
                    <Text style={styles.text2}>{item?.hotel}</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.text1}>{item?.quandity}</Text>
            <Text style={styles.text1}>₹ {item?.rate}</Text>
        </View>
    )
})

export default ItemsCard

const styles = StyleSheet.create({
    container : { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F3F3F3', 
        justifyContent: 'space-between', 
        paddingVertical: 10, 
        borderBottomWidth: 1, 
        borderColor: '#00000029', 
        paddingHorizontal: 7 
    },
    text1 : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    text2 : {
        fontFamily: 'Poppins-BoldItalic',
        color: '#1185E0',
        fontSize: 9,
        marginTop: 5
    }
})