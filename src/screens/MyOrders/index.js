import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState, useEffect} from 'react'
import CommonTexts from '../../Components/CommonTexts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomButton from '../../Components/CustomButton'
import OrderCard from './OrderCard'
import HeaderWithTitle from '../../Components/HeaderWithTitle'
import PandaContext from '../../contexts/Panda'
import LoaderContext from '../../contexts/Loader'
import AuthContext from '../../contexts/Auth'
import customAxios from '../../CustomeAxios'
import reactotron from '../../ReactotronConfig'


const MyOrders = () => {
    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active
    
    const loadingg = useContext(LoaderContext)
    const user = useContext(AuthContext)
    let loader = loadingg?.loading

    const [orderList,setOrderList] = useState([])

    reactotron.log({orderList})


    useEffect(() => {
        getOrderList()
    }, [])

    const getOrderList = async () => {
        loadingg.setLoading(true)
        await customAxios.get(`customer/order/list`)
            .then(async response => {
                setOrderList(response?.data?.data)
                loadingg.setLoading(false)
            })
            .catch(async error => {
                console.log(error)
                // ToastAndroid.showWithGravity(
                //     error,
                //     ToastAndroid.SHORT,
                //     ToastAndroid.CENTER,
                // )
                loadingg.setLoading(false)
            })
    }








    OrderedItems = [
        {
            _id: '#10765',
            name: 'Chicken Biriyani',
            shop: 'Jeff biriyani shop',
            paymentStatus: 'success',
            date : '22/05/2022',
            status : 'pending',
            myOrder : [
                {
                    _id: '1',
                    name: 'Chicken Biriyani',
                    hotel: 'Jeff biriyani shop',
                    quandity:1,
                    rate: 250
                },
                {
                    _id: '2',
                    name: 'Chicken Dum Biriyani',
                    hotel: 'Zam Zam',
                    quandity:2,
                    rate: 260
                },
            ]
        },
        {
            _id: '#78541',
            name: 'Chicken Dum Biriyani',
            shop: 'Zam Zam',
            paymentStatus: 'pending',
            status:'pending',
            date : '15/02/2023',
            myOrder : [
                {
                    _id: '1',
                    name: 'Chicken Biriyani',
                    hotel: 'Jeff biriyani shop',
                    quandity:1,
                    rate: 250
                },
                {
                    _id: '2',
                    name: 'Chicken Dum Biriyani',
                    hotel: 'Zam Zam',
                    quandity:2,
                    rate: 260
                },
            ]
        },
        {
            _id: '#87451',
            name: 'Arabian Kuzhi Manthi',
            shop: 'Le Arabia',
            paymentStatus: 'success',
            status : 'completed',

            date : '15/03/2023',
            myOrder : [
                {
                    _id: '1',
                    name: 'Arabian Kuzhi Manthi',
                    hotel: 'Le Arabia',
                    quandity:1,
                    rate: 380
                },
                {
                    _id: '2',
                    name: 'Kuzhi Manthi',
                    hotel: 'Baith-Al',
                    quandity:2,
                    rate: 360
                },
            ]
        },
    ]

    return (
        <>
            <HeaderWithTitle title={'My Orders'} noBack/>
            <View 
                style={{flex:1, paddingBottom:60, backgroundColor: active === 'green' ? '#F4FFE9' :  active === 'fashion' ? '#FFF5F7' : '#fff'}}
            >
            <ScrollView 
                style={{  paddingHorizontal: 10 , paddingTop:10}}
            >
                {orderList.map((ord, index)=><OrderCard key={index} item = {ord} />)}
            </ScrollView>
            </View>
        </>
    )
}

export default MyOrders

const styles = StyleSheet.create({
    
})