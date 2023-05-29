import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import FastImage from 'react-native-fast-image'
import { IMG_URL, env, location } from '../../../config/constants';
import LoaderContext from '../../../contexts/Loader'
import AuthContext from '../../../contexts/Auth'
import customAxios from '../../../CustomeAxios'
import reactotron from '../../../ReactotronConfig'
import PandaContext from '../../../contexts/Panda'


const ViewAllStore = ({ route, navigation }) => {

    const { width, height } = useWindowDimensions()

    const loadingg = useContext(LoaderContext)
    const userContext = useContext(AuthContext)
    const contextPanda = useContext(PandaContext)
    const [storeList, setStoreList] = useState([])




    const getStore = useCallback(async () => {
        loadingg.setLoading(true)
        let datas = {
            type: contextPanda.active,
            coordinates: env === "dev" ? location : userContext?.location
        }
        await customAxios.post('customer/store-list', datas).then((res) => {
            setStoreList(res?.data?.data)
            loadingg.setLoading(false)
        }).catch((err) => {
            loadingg.setLoading(false)
        })
    }, [loadingg?.loading])


    useEffect(() => {
        getStore()
    }, [])

    // const renderItems = ({ item }) => {


    //     return (
    //         <View>
    //             <TouchableOpacity
    //                 key={item?._id}
    //                 onPress={null}
    //                 style={{ width: width / 4, height: 90, alignItems: 'center', marginTop: 10 }}
    //             >
    //                 <FastImage
    //                     style={{ width: 75, height: 70, borderRadius: 10 }}
    //                     source={ item?.store_logo ? {uri: `${IMG_URL}${item?.store_logo}` }  : require('../../../Images/vegies.png')}
    //                     borderRadius={10}
    //                 />
    //                 <Text
    //                     numberOfLines={1}
    //                     style={styles.itemText}
    //                 >{item?.store_name}</Text>
    //             </TouchableOpacity>
    //         </View>
    //     )
    // }


    const NavigationToHome = useCallback(() => {
        navigation.navigate('Home')
    }, [])

    const onClick = useCallback((item) => {
        navigation.navigate('store', { name: item?.name, mode: 'store', item: item })
    }, [])

    return (
        <View>
            <HeaderWithTitle title={'Stores'} onPressBack={NavigationToHome} />
            <FlatList
                refreshing={loadingg.loading}
                onRefresh={getStore}
                numColumns={4}
                data={storeList}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{height:height}}
                renderItem={({ item, index }) => {
                    return (
                        <View>
                            <TouchableOpacity
                                key={item?._id}
                                onPress={() => onClick(item)}
                                style={{ width: width / 4, height: 90, alignItems: 'center', marginTop: 10 }}
                            >
                                <FastImage
                                    style={{ width: 75, height: 70, borderRadius: 10 }}
                                    source={item?.store_logo ? { uri: `${IMG_URL}${item?.store_logo}` } : require('../../../Images/vegies.png')}
                                    borderRadius={10}
                                />
                                <Text
                                    numberOfLines={1}
                                    style={styles.itemText}
                                >{item?.store_name}</Text>
                            </TouchableOpacity>
                        </View>
                    )

                }}
            />
        </View>
    )
}

export default ViewAllStore

const styles = StyleSheet.create({

    itemText: {
        textAlign: 'center',
        fontSize: 11,
        marginTop: 5,
        fontFamily: 'Poppins-SemiBold',
        color: '#23233C',
        fontWeight: 'bold'
    }
})