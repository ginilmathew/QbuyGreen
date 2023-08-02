import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useState, useEffect, useContext, memo } from 'react'
import { IMG_URL } from '../../../config/constants'

import reactotron from '../../../ReactotronConfig'
import { getProduct } from '../../../helper/productHelper'
import { CommonActions, useNavigation } from '@react-navigation/native';
import PandaContext from '../../../contexts/Panda'
import AuthContext from '../../../contexts/Auth'
import CartContext from '../../../contexts/Cart'
import customAxios from '../../../CustomeAxios'

const SearchResultsCard = memo(({ item, setValue }) => {

    reactotron.log({item},'ITEM IN SEARCH')

    const pandaContext = useContext(PandaContext)

    const userContext = useContext(AuthContext)
    const cartContext = useContext(CartContext)
    const [data, setData] = useState([])


    useEffect(() => {
        if (item) {
            let data = getProduct(item);
            // reactotron.log({ data })
            setData(data)
        }
        else {
            setData(null)
        }
    }, [])




    const navigation = useNavigation()

    const handleswitch = async(type) => {
        let value = {
             type:type,
             user_id: userContext?.userData?._id
        }
        let result =  await customAxios.post('customer/cart/newshow-cart',value)

        reactotron.log({result},'RESULT RESULT')
        cartContext.setCart(result?.data?.data)

    }


    const handleClick = useCallback((value) => {
            pandaContext.setActive(item?.type)
            handleswitch(item?.type)
            navigation.navigate('SingleItemScreen', { item: data })
            setValue('name', '')



        // if (item?.type === 'fashion') {
        //     pandaContext.setActive('fashion')
        //     navigation.dispatch(
        //         CommonActions.reset({
        //             index: 0,
        //             routes: [
        //                 { name: 'fashion' }
        //             ]
        //         }))
        //     setValue('name', '')
        // } else {
        //     setValue('name', '')
        //     navigation.navigate('SingleItemScreen', { item: data })
        // }



        // if (item?.type === 'fashion') {
        //     pandaContext.setActive('fashion')
        //     navigation.dispatch(
        //         CommonActions.reset({
        //             index: 2,
        //             routes: [
        //                 { name: 'fashion' },
        //                 { name: 'fashion',params:{screen:'TabNavigator',params:{screen:'cart'}} },
        //                 { name: 'fashion' ,params:{screen:'TabNavigator',params: {screen:'home',params:{screen:'SingleItemScreen',params:{item:data}}}}},
        //                 // { name: 'SingleItemScreen', item: data }

        //             ],
        //         })
        //     );
        // } else {
        //     // navigation.navigate('SingleItemScreen', { item: data })
        //     pandaContext.setActive('green')
        //     navigation.dispatch(
        //         CommonActions.reset({
        //             index: 2,
        //             routes: [
        //                 { name: 'green' },
        //                 { name: 'green',params:{screen:'TabNavigator',params:{screen:'cart'}} },
        //                 { name: 'green' ,params:{screen:'TabNavigator',params: {screen:'home',params:{screen:'SingleItemScreen',params:{item:data}}}}},
        //             ],
        //         })
        //     );
        // }

    }, [data,pandaContext?.active])

    return (
        <TouchableOpacity
            onPress={handleClick}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Image
                style={{ width: 60, height: 60, borderRadius: 30 }}
                source={{ uri: `${IMG_URL}${item?.product_image}` }}
                borderRadius={30}
            />
            <View style={{ marginLeft: 10, flex: 0.95 }}>
                <Text style={{ fontSize: 12, color: '#000', fontFamily: 'Poppins-Medium' }}>{item?.name}</Text>
                <Text style={{ fontSize: 10, color: 'gray', fontFamily: 'Poppins-Regular' }}>{item?.store?.name}</Text>
            </View>
        </TouchableOpacity>
    )
})

export default SearchResultsCard

const styles = StyleSheet.create({})