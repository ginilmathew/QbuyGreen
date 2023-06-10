import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useState, useEffect, useContext, memo } from 'react'
import { IMG_URL } from '../../../config/constants'

import reactotron from '../../../ReactotronConfig'
import { getProduct } from '../../../helper/productHelper'
import { CommonActions, useNavigation } from '@react-navigation/native';
import PandaContext from '../../../contexts/Panda'
const SearchResultsCard = memo(({ item,setValue }) => {

    const pandaContext = useContext(PandaContext)

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
    }, [item])


    reactotron.log({ item })

    const navigation = useNavigation()

    const handleClick = useCallback((value) => {

        if (item?.type === 'fashion') {
            pandaContext.setActive('fashion')
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'fashion' }
                    ]
                }))
                setValue('name','')
        } else {
            setValue('name','')
            navigation.navigate('SingleItemScreen', { item: data })
        }



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
})

export default SearchResultsCard

const styles = StyleSheet.create({})