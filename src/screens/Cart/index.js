import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import CustomButton from '../../Components/CustomButton';
import HeaderWithTitle from '../../Components/HeaderWithTitle';
import CartItemCard from './CartItemCard';
import CommonItemsList from '../../Components/CommonItemsList';
import PandaContext from '../../contexts/Panda';
import Lottie from 'lottie-react-native';
import CommonTexts from '../../Components/CommonTexts';
import CommonItemCard from '../../Components/CommonItemCard';
import reactotron from '../../ReactotronConfig';
import AuthContext from '../../contexts/Auth';
import customAxios from '../../CustomeAxios';
import CartContext from '../../contexts/Cart';
import { useFocusEffect } from '@react-navigation/native';


const Cart = ({ navigation }) => {


    const contextPanda = useContext(PandaContext)
    let grocery = contextPanda.greenPanda
    let fashion = contextPanda.pinkPanda

    const { height } = useWindowDimensions();

    let active = contextPanda.active

    //reactotron.log({active})

    const user = useContext(AuthContext)
    const cartContext = useContext(CartContext)


    //let cartId = user?.cartId

    // reactotron.log({ cartId })

    const [cartItemsList, setCartItemsList] = useState([])

    // reactotron.log({ cartItemsList })

    // useEffect(() => {
    //     getCartItems()
    //     //reactotron.log({active})
    // }, [])

    const getCartItems = async () => {
        if(cartContext?.cart?._id){
            await customAxios.get(`customer/cart/show/${cartContext?.cart?._id}`)
            .then(async response => {
                setCartItemsList([...response?.data?.data?.product_details])
                // reactotron.log({ response })
                // setSingleProduct(response?.data?.data)
                // loadingg.setLoading(false)
            })
            .catch(async error => {
                console.log(error)
                // ToastAndroid.showWithGravity(
                //     error,
                //     ToastAndroid.SHORT,
                //     ToastAndroid.CENTER,
                // )
                // loadingg.setLoading(false)
            })
        }
       
    }


    useFocusEffect(
        React.useCallback(() => {
            getCartItems()
        }, [])
      );


    const { width } = useWindowDimensions()


    cartItems = [
        {
            _id: '1',
            name: 'Chicken Biriyani',
            hotel: 'MRA',
            rate: 240,
            count: 1
        },
        {
            _id: '2',
            name: 'Jeff Biriyani',
            hotel: 'Zam Zam',
            rate: 280,
            count: 1
        },

    ]


    pandaSugg = [
        {
            _id: '1',
            name: 'Biriyani',
            rate: 250,
            hotel: 'MRA'
        },
        {
            _id: '2',
            name: 'Masal Dosha',
            rate: 90,
            hotel: 'Aryaas Veg'
        },
        {
            _id: '3',
            name: 'Veg Biriyani',
            rate: 150,
            hotel: 'Aryaas Center'
        },
        {
            _id: '4',
            name: 'Fried Rice',
            rate: 180,
            hotel: 'Zam Zam'


        },
        {
            _id: '5',
            name: 'Egg Biriyani',
            rate: 130,
            hotel: 'KH'
        },

    ]



    trend = [
        {
            _id: '1',
            name: 'Biriyani',
            rate: 250,
            hotel: 'MRA'
        },
        {
            _id: '2',
            name: 'Masal Dosha',
            rate: 90,
            hotel: 'Aryaas Veg'
        },
        {
            _id: '3',
            name: 'Veg Biriyani',
            rate: 150,
            hotel: 'Aryaas Center'
        },
        {
            _id: '4',
            name: 'Fried Rice',
            rate: 180,
            hotel: 'Zam Zam'


        },
        {
            _id: '5',
            name: 'Egg Biriyani',
            rate: 130,
            hotel: 'KH'
        },

    ]



    const gotoCheckout = useCallback(async() => {
        navigation.navigate('Checkout')
        
    }, [])

    const goHome = useCallback(() => {
        navigation.navigate('home')
    }, [])

    const refreshCart = useCallback(() => {
        getCartItems()
    },[])

    return (
        <View style={{ height: height-50, paddingBottom: 50, backgroundColor:  active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff' }} >
            <HeaderWithTitle title={'Cart'} noBack />

            <ScrollView style={{ flex: 1, backgroundColor:  active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff' }}>
                {cartItemsList?.length <= 0 ? <View
                    style={{ backgroundColor:  active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', borderBottomWidth: 2, borderColor: '#0C256C21', }}
                >
                    <View style={{ height: grocery ? 250 : 170 }}>
                        <Lottie
                            source={active === 'green' ? require('../../Lottie/emptyGrocery.json') : active === 'fashion' ? require('../../Lottie/shirtss.json') : require('../../Lottie/empty.json')}
                            autoPlay
                        />
                    </View>
                    <CommonTexts
                        label={'Oh! Your cart is currently empty!'}
                        color='#A9A9A9'
                        textAlign={'center'}
                        mt={grocery ? -70 : 10}
                    />
                    <CustomButton
                        onPress={goHome}
                        bg={active === 'green' ? '#FF9C0C' : '#5871D3'}
                        label='Add Products'
                        width={150}
                        alignSelf='center'
                        mt={20}
                        mb={20}
                    />
                </View> :
                    <>
                        {cartItemsList?.map((item, index) => <CartItemCard item={item} key={index} index={index} refreshCart={refreshCart} />)}
                    </>}


                {cartItemsList?.length > 0 && 
                <CustomButton
                onPress={gotoCheckout}
                label={'Proceed To Checkout'}
                bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                mt={20}
                mx={10}
            />}
                {/* <CommonTexts label={'Panda Suggestions'} fontSize={13} ml={15} mb={5} mt={15} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', paddingLeft: 7, }}
                >
                    {pandaSuggestion?.map((item) =>
                        <CommonItemCard
                            key={item?._id}
                            item={item}
                            width={width / 2.5}
                            marginHorizontal={5}
                        />
                    )}
                </ScrollView> */}
                {/* <CommonTexts label={'Trending Sales'} fontSize={13} ml={ 15} mb={5} mt={15}/>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexDirection: 'row', paddingLeft: 7,  }}
            >
                {trend.map((item) =>
                    <CommonItemCard
                        key={item?._id}
                        item={item}
                        width={ width/2.5 }
                        marginHorizontal={5}
                    />
                )}
            </ScrollView> */}
            </ScrollView>
        </View>
    )
}

export default Cart

const styles = StyleSheet.create({})