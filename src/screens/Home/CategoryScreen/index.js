import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import FastImage from 'react-native-fast-image'
import PandaContext from '../../../contexts/Panda'
import CommonItemSelect from '../../../Components/CommonItemSelect'
import CommonItemCard from '../../../Components/CommonItemCard'
import { IMG_URL, env, location } from '../../../config/constants'
import LoaderContext from '../../../contexts/Loader'
import customAxios from '../../../CustomeAxios'
import AuthContext from '../../../contexts/Auth'
import Toast from 'react-native-toast-message'
import CartContext from '../../../contexts/Cart'
import AsyncStorage from '@react-native-async-storage/async-storage'


const CategoryScreen = ({ route, navigation }) => {

    const { width } = useWindowDimensions()


    const contextPanda = useContext(PandaContext)
    const auth = useContext(AuthContext)


    const loadingContex = useContext(LoaderContext)
    const cartContext = useContext(CartContext)
    let loadingg = loadingContex?.loading

    const { name, mode, item, storeId } = route?.params

    const [availablePdts, setAvailabelPdts] = useState([])
    const [filterProducts, setFilterProduct] = useState([])
    const [categories, setCategories] = useState([])
    const [selected, setSelected] = useState(null);
    const [refreshing, setRefreshing] = useState(false);


    //code for filter by subCategory.......


    const filterbySubCategory = () => {
        let result = filterProducts?.filter((res) => res?.sub_category?._id === selected)
        setAvailabelPdts(result)
    }

    useEffect(() => {
        if (selected) {
            filterbySubCategory()
        }
    }, [selected])

   //****************************************/





    useEffect(() => {
        getProductBasedCat(auth.location);
    }, [])




    const getProductBasedCat = async (coords) => {
        loadingContex.setLoading(true)
        let datas = {
            category_id: item?._id ? item?._id : item?.id,
            coordinates: env === "dev" ? location : coords
        }
        await customAxios.post(`customer/product/category-based`, datas)
            .then(async response => {

                if (storeId) {

                    let products = response?.data?.data?.filter(prod => prod?.store?._id === storeId);
                    setAvailabelPdts(products)
                }
                else {
                    setSelected(null)
                    setAvailabelPdts(response?.data?.data)
                    setFilterProduct(response?.data?.data)
                }
                loadingContex.setLoading(false)
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
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

    let catType = [
        {
            _id: '1',
            name: 'test 1'
        },
        {
            _id: '2',
            name: 'test 2'
        },
        {
            _id: '3',
            name: 'test 3'
        },
        {
            _id: '4',
            name: 'test 4'
        },
        {
            _id: '5',
            name: 'test 5'
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

        if (item?.variants?.length === 0) {
            loadingContex.setLoading(true)
            if (cartContext?.cart) {
                url = "customer/cart/update";
                let existing = cartContext?.cart?.product_details?.findIndex(prod => prod.product_id === item?._id)
                if (existing >= 0) {
                    let cartProducts = cartContext?.cart?.product_details;
                    cartProducts[existing].quantity = cartProducts[existing].quantity + 1;
                    cartItems = {
                        cart_id: cartContext?.cart?._id,
                        product_details: cartProducts,
                        user_id: auth?.userData?._id
                    }
                }
                else {
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
                        user_id: auth?.userData?._id
                    }
                }
            }
            else {
                url = "customer/cart/add";
                let productDetails = {
                    product_id: item?._id,
                    name: item?.name,
                    image: item?.product_image,
                    type: "single",
                    variants: null,
                    quantity: 1
                };

                cartItems = {
                    product_details: [productDetails],
                    user_id: auth?.userData?._id
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
        else {
            navigation.navigate('SingleItemScreen', { item: item })
        }

    }



    return (
        <>
            <HeaderWithTitle mode={mode} title={name} />
            <ScrollView
                style={{ flex: 1, backgroundColor: contextPanda.active === "green" ? '#F4FFE9' : contextPanda.active === "fashion" ? '#FFF5F7' : '#fff', }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loadingContex?.loading} onRefresh={getProductBasedCat} />
                }

            >
                <View style={{ paddingHorizontal: 10 }}>
                    <FastImage
                        source={item?.image ? { uri: `${IMG_URL}${item?.image}` } : require('../../../Images/jeans.jpg')}
                        style={styles.mainImage}
                        borderRadius={15}
                    />
                    <Text style={styles.description}>{item?.seo_description === null  ? '' : item?.seo_description}</Text>
                </View>


                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ backgroundColor: '#76867314', marginTop: 5 }}
                >
                    {item?.subcategories?.map((item, index) =>
                    (<CommonItemSelect
                        item={item} key={index}
                        selected={selected}
                        setSelected={setSelected}
                    />)
                    )}
                </ScrollView>


                {availablePdts?.length > 0 && <>
                    <CommonTexts label={'Available Products'} mt={15} ml={10} fontSize={13} mb={5} />
                    <View style={styles.itemContainer}>
                        {availablePdts?.map((item) => (
                            <CommonItemCard
                                item={item}
                                key={item?._id}
                                width={width / 2.2}
                                height={250}
                                addToCart={addToCart}
                            // wishlistIcon={fashion ? true : false}
                            />
                        ))}
                    </View>
                </>}



                {/* <View style={styles.recommPdtBox}>
                    <CommonTexts label={'Recommanded Products'} fontSize={13} ml={15} mb={5} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ flexDirection: 'row', paddingLeft: 7 }}
                    >
                        {recentView?.map((item) =>
                            <CommonItemCard
                                key={item?._id}
                                item={item}
                                width={width / 2.5}
                                marginHorizontal={5}
                            />
                        )}
                    </ScrollView>
                </View> */}

            </ScrollView>
        </>
    )
}

export default CategoryScreen

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
    }

})