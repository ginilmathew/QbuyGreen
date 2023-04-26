import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'

const ItemsCard = memo(({item, date}) => {

    const navigation = useNavigation()

    const goToShop = useCallback(() => {
        navigation.navigate('SingleHotel',{item : item, mode:'orderItem'})
    }, [])

    const getPrice = () => {
        if(item?.variants){
            if(item?.variants?.offer_price && item?.variants?.offer_price >0 && moment(item?.variants?.offer_date_from, "YYYY-MM-DD") <= moment(date) && moment(item?.variants?.offer_date_to, "YYYY-MM-DD") <= moment(date)){
                return item?.variants?.offer_price;
            }
            else if(item?.variants?.regular_price && parseFloat(item?.variants?.regular_price) > 0){
                return item?.variants?.regular_price;
            }
            else{
                let commission = (parseFloat(item?.variants?.seller_price)/100) * parseFloat(item?.variants?.commission)
                let price = parseFloat(item?.variants?.seller_price) + commission
                return price
            }
        }
        else{
            if(item?.offer_price && item?.offer_price >0 && moment(item?.offer_date_from, "YYYY-MM-DD") <= moment(date) && moment(item?.offer_date_to, "YYYY-MM-DD") <= moment(date)){
                return item?.offer_price;
            }
            else if(item?.regular_price && parseFloat(item?.regular_price) > 0){
                return item?.regular_price;
            }
            else{
                let commission = (parseFloat(item?.seller_price)/100) * parseFloat(item?.commission)
                let price = parseFloat(item?.seller_price) + commission
                return price
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.5 }}>
                <Text style={styles.text1}>{`${item?.name}`}</Text>
                {/* <TouchableOpacity 
                //onPress={goToShop}
                >
                    <Text style={styles.text2}>{item?.hotel}</Text>
                </TouchableOpacity> */}
            </View>
            <Text style={styles.text1}>{item?.quantity}</Text>
            <Text style={styles.text1}>₹ {getPrice()}</Text>
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