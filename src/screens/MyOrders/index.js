import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import CommonTexts from '../../Components/CommonTexts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomButton from '../../Components/CustomButton'
import OrderCard from './OrderCard'
import HeaderWithTitle from '../../Components/HeaderWithTitle'
import PandaContext from '../../contexts/Panda'
import LoaderContext from '../../contexts/Loader'
import AuthContext from '../../contexts/Auth'
import customAxios from '../../CustomeAxios'
import Toast from 'react-native-toast-message';


const MyOrders = () => {
    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const loadingg = useContext(LoaderContext)
    const user = useContext(AuthContext)
    let loader = loadingg?.loading

    const [orderList, setOrderList] = useState([])


    useEffect(() => {
        getOrderList()
    }, [])

    const getOrderList = async () => {
        loadingg.setLoading(true)
        await customAxios.get(`customer/order/list/${contextPanda?.active}`)
            .then(async response => {
                setOrderList(response?.data?.data)
                loadingg.setLoading(false)
            })
            .catch(async error => {
                console.log(error)
                Toast.show({
                    type: 'error',
                    text1: error
                });
                loadingg.setLoading(false)
            })
    }





    return (
        <>
            <HeaderWithTitle title={'My Orders'} noBack />

            {!loadingg?.loading &&
                <View
                    style={{ flex: 1, paddingBottom: 60, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff' }}
                >
                    {orderList?.length > 0 ?
                        <ScrollView

                            refreshControl={
                                <RefreshControl refreshing={loadingg?.loading} onRefresh={getOrderList} />
                            }
                            style={{ paddingHorizontal: 10, paddingTop: 10, marginBottom: 20 }}
                        >
                            {orderList?.map((ord, index) => <OrderCard key={index} item={ord} refreshOrder={getOrderList} />)}
                        </ScrollView> : <Text style={styles.emptyMessageStyle}>No Order Found..!</Text>}
                </View>}
        </>
    )
}

export default MyOrders

const styles = StyleSheet.create({
    emptyMessageStyle: {
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',

        fontSize: 16,
        marginTop: '80%',
    }
})