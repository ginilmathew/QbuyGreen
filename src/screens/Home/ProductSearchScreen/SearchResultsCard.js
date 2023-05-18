import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { IMG_URL } from '../../../config/constants'
import { useNavigation } from '@react-navigation/native'
import reactotron from '../../../ReactotronConfig'
import { getProduct } from '../../../helper/productHelper'

const SearchResultsCard = ({item}) => {

    

    const [data, setData] = useState([])

    useEffect(() => {
        if(item){
            let data = getProduct(item);
            reactotron.log({data})
            setData(data)
        }
        else{
            setData(null)
        }
    }, [item])
    

    reactotron.log({item})

    const navigation = useNavigation()

    const handleClick = useCallback(() => {
        navigation.navigate('SingleItemScreen', { item: data })
    }, [data])

    return (
        <TouchableOpacity
            onPress={handleClick}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Image
                style={{ width: 60, height: 60, borderRadius: 30 }}
                source={item?.product_image ? { uri: `${IMG_URL}${item?.product_image}` } : require('../../../Images/jeans.jpg')}
                borderRadius={30}
            />
            <View style={{ marginLeft: 10, flex: 0.95 }}>
                <Text style={{ fontSize: 12, color: '#000', fontFamily: 'Poppins-Medium' }}>{item?.name}</Text>
                <Text style={{ fontSize: 10, color: 'gray', fontFamily: 'Poppins-Regular' }}>{item?.store?.name}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default SearchResultsCard

const styles = StyleSheet.create({})