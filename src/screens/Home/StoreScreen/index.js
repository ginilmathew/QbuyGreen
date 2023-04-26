import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import FastImage from 'react-native-fast-image'
import PandaContext from '../../../contexts/Panda'
import CommonItemSelect from '../../../Components/CommonItemSelect'
import CommonItemCard from '../../../Components/CommonItemCard'
import TypeCard from '../Grocery/TypeCard'
import { IMG_URL, env, location } from '../../../config/constants'
import reactotron from '../../../ReactotronConfig'
import LoaderContext from '../../../contexts/Loader'
import customAxios from '../../../CustomeAxios'
import HotelCard from '../Category/HotelCard'
import StoreAddressCard from '../Category/StoreAddressCard'
import Toast from 'react-native-simple-toast';
import AuthContext from '../../../contexts/Auth'
import CartContext from '../../../contexts/Cart'
import AsyncStorage from '@react-native-async-storage/async-storage'


const StoreScreen = ({ route, navigation }) => {

    const { width } = useWindowDimensions()


    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const loadingContex = useContext(LoaderContext)
    const userContext = useContext(AuthContext)
    const cartContext = useContext(CartContext)
    let loadingg = loadingContex?.loading

    const name = route?.params?.name
    const mode = route?.params?.mode
    const item = route?.params?.item

    //reactotron.log({ item })

    const [storeDetails, setStoreDetails] = useState([])
    const [categories, setCategories] = useState([])

    const [selected, setSelected] = useState(false)

    useEffect(() => {
        getStoreDetails()
    }, [])

    const getStoreDetails = async () => {
        loadingContex.setLoading(true)

        let data = {
            vendor_id: item?._id,
            coordinates: env === "dev" ? location : userContext?.location
        }

        await customAxios.post(`customer/store`, data)
            .then(async response => {
                setStoreDetails(response?.data?.data)
                loadingContex.setLoading(false)
            })
            .catch(async error => {
                Toast.showWithGravity(error, Toast.SHORT, Toast.BOTTOM);
                loadingContex.setLoading(false)
            })
    }


    shops = [
        {
            _id: '1',
            name: 'Fresh Vegetables'
        },
        {
            _id: '2',
            name: 'Trivandrum Farmers'
        },
        {
            _id: '3',
            name: 'Fertilizers'
        },
    ]

    groceryType = [
        {
            _id: '1',
            name: 'Vegetables'
        },
        {
            _id: '2',
            name: 'Fruits'
        },
        {
            _id: '3',
            name: 'Seeds'
        },
        {
            _id: '4',
            name: 'Plants'
        },
        {
            _id: '5',
            name: 'Fertilizers'
        },
    ]

    fooodItems = [
        {
            _id: '1',
            name: 'Omelette'
        },
        {
            _id: '2',
            name: 'Rice'
        },
        {
            _id: '3',
            name: 'Steak'
        },
        {
            _id: '4',
            name: 'Biriyani'
        },
        {
            _id: '5',
            name: 'fried Rice'
        },
        {
            _id: '6',
            name: 'Momos'
        },
    ]



    recomment = [
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

    stores = [
        {
            _id: '1',
            hotel: 'AJ Lemons',
            image: require('../../../Images/store1.jpeg')
        },
        {
            _id: '2',
            hotel: 'Fresh Fruits',
            image: require('../../../Images/store2.jpeg')
        },
        {
            _id: '3',
            hotel: 'Green N Fresh',
            image: require('../../../Images/store2.jpeg')
        },
        {
            _id: '4',
            hotel: 'Fresh Veggies',
            image: require('../../../Images/store1.jpeg')
        },
    ]


    foodItems = [
        {
            _id: '1',
            name: 'Carrot (500gm)',
            rate: 250,
            hotel: 'Fresh Vegetables',
            image: require('../../../Images/carrot.jpeg')
        },
        {
            _id: '2',
            name: 'Spinach',
            rate: 90,
            hotel: 'Fresh Vegetables',
            image: require('../../../Images/tomato.jpeg')
        },
        {
            _id: '3',
            name: 'Lemon',
            rate: 150,
            hotel: 'Fresh Vegetables',
            image: require('../../../Images/carrot.jpeg')
        },
        {
            _id: '4',
            name: 'Potato (1kg)',
            rate: 180,
            hotel: 'Fresh Vegetables',
            image: require('../../../Images/tomato.jpeg')
        },
        {
            _id: '5',
            name: 'Tomato (500gm)',
            rate: 130,
            hotel: 'Fresh Vegetables',
            image: require('../../../Images/tomato.jpeg')
        },
    ]

    const addToCart = async (item) => {
        
        let cartItems;
        let url;

        if(item?.variants?.length === 0){
            loadingContex.setLoading(true)
            if(cartContext?.cart){
                url = "customer/cart/update";
                let existing = cartContext?.cart?.product_details?.findIndex(prod => prod.product_id === item?._id)
                if(existing >= 0){
                    let cartProducts = cartContext?.cart?.product_details;
                    cartProducts[existing].quantity = cartProducts[existing].quantity + 1;
                    cartItems = {
                        cart_id: cartContext?.cart?._id,
                        product_details: cartProducts,
                        user_id: userContext?.userData?._id
                    }
                }
                else{
                    let productDetails = {
                        product_id: item?._id,
                        name: item?.name,
                        image: item?.product_image,
                        type: 'single',
                        variants: null,
                        quantity: 1
                    };

                    cartItems = {
                        cart_id: cartContext?.cart?._id,
                        product_details: [...cartContext?.cart?.product_details, productDetails],
                        user_id: userContext?.userData?._id
                    }
                }
            }
            else{
                url = "customer/cart/add";
                let productDetails = {
                    product_id: item?._id,
                    name: item?.name,
                    image: item?.product_image,
                    type: "single",
                    variants:  null,
                    quantity: 1
                };

                cartItems = {
                    product_details: [productDetails],
                    user_id: userContext?.userData?._id
                }
            }

            await customAxios.post(url, cartItems)
            .then(async response => {
                cartContext.setCart(response?.data?.data)
                await AsyncStorage.setItem("cartId", response?.data?.data?._id)
                loadingContex.setLoading(false)
            })
            .catch(async error => {
                loadingContex.setLoading(false)
            })
        }
        else{
            navigation.navigate('SingleItemScreen', { item: item })
        }
        


       

    }


    return (
        <>
            <HeaderWithTitle title={mode === 'store' ? item?.store_name : name} />
            <ScrollView
                style={{ flex: 1, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingHorizontal: 10 }}>
                    <FastImage
                        source={item?.store_logo ? { uri: `${IMG_URL}${item?.store_logo}` } : require('../../../Images/jeans.jpg')}
                        // source={{ uri: `${IMG_URL}${item?.image}` }}
                        style={styles.mainImage}
                        borderRadius={15}
                    />
                    <StoreAddressCard address={item?.store_address} />
                    <Text style={styles.description}>{item?.seo_description}</Text>
                </View>

                <View style={{ backgroundColor: '#76867314', paddingBottom: 10, }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ flexDirection: 'row', marginTop: 15 }}
                    >
                        {storeDetails?.category_id?.map((cat, index) =>
                            (<TypeCard item={cat} key={index} storeId={item?._id} />)
                        )}
                    </ScrollView>
                </View>


                <CommonTexts label={'Available Products'} my={15} ml={10} fontSize={13} />
                <View style={styles.itemContainer}>
                    {storeDetails?.products?.map((item) => (
                        <CommonItemCard
                            item={item}
                            key={item?._id}
                            width={width / 2.2}
                            height={250}
                            addToCart={addToCart}
                        />
                    ))}
                </View>

            </ScrollView>
        </>
    )
}

export default StoreScreen

const styles = StyleSheet.create({
    mainImage: {
        width: '100%',
        height: 200,
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 15
    },
    description: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 13,
        marginTop: 10
    },

    hotelView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: '3%'
    },
    recommPdtBox: {
        marginTop: 15,
        marginBottom: 60,
        backgroundColor: '#76867314',
        paddingVertical: 5
    },
    restaurantView: {
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: '#F7F7F7',
        paddingVertical: 10
    },
    foodName: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5
    },
    itemContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: '3%'
    },


})