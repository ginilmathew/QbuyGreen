import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import HotelCard from './HotelCard'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import FastImage from 'react-native-fast-image'
import CommonItemsList from '../../../Components/CommonItemsList'
import PandaContext from '../../../contexts/Panda'
import CommonItemSelect from '../../../Components/CommonItemSelect'
import CommonItemCard from '../../../Components/CommonItemCard'
import CommonItemMenuList from '../../../Components/CommonItemMenuList'
import StoreAddressCard from './StoreAddressCard'
import HotelItemList from './HotelItemList'
import TypeCard from '../Grocery/TypeCard'
import CommonRating from '../../../Components/CommonRating'
import { IMG_URL, env, location } from '../../../config/constants'
import LoaderContext from '../../../contexts/Loader'
import customAxios from '../../../CustomeAxios'
import Toast from 'react-native-toast-message'
import CartContext from '../../../contexts/Cart'
import AuthContext from '../../../contexts/Auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import reactotron from 'reactotron-react-native'
import { useFocusEffect } from '@react-navigation/native'
import PandaShopCard from '../Grocery/PandaShopCard'


const Category = ({ route }) => {





    const { width } = useWindowDimensions()


    const contextPanda = useContext(PandaContext)
    const userContext = useContext(AuthContext)
    const cartContext = useContext(CartContext)
    let grocery = contextPanda.greenPanda
    let fashion = contextPanda.pinkPanda

    const loadingContex = useContext(LoaderContext)
    let loadingg = loadingContex?.loading
    let userData = userContext?.userData

    const { name, mode, item } = route?.params;

    const [availablePdts, setAvailabelPdts] = useState([])
    const [categories, setCategories] = useState([])
    const [stores, setStore] = useState([])
    const [relatedProduct, setRelatedProduct] = useState([])


    const [selected, setSelected] = useState(false)




    // useEffect(() => {
    //     getProductBasedCat()
    // }, [])

    useFocusEffect(
        React.useCallback(() => {

            getProductBasedCat()

        }, [])
    );

    const getProductBasedCat = async () => {
        loadingContex.setLoading(true)

        let datas = {
            category_id: item?._id,
            // coordinates :  env === "dev" ? location : userContext?.location
            coordinates: userContext?.location,
            type: contextPanda?.active
        }

        await customAxios.post(`customer/product/category-based`, datas)
            .then(async response => {

                let categories = response?.data?.data?.find(home => home?.type === "categories")
                setAvailabelPdts(categories?.data)
                let stores = response?.data?.data?.find(home => home?.type === "stores")
                setStore(stores?.data)
                let related_product = response?.data?.data?.find(home => home?.type === "related_product")
                setRelatedProduct(related_product?.data)
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

    useEffect(() => {
        getCategories()
    }, [])

    const getCategories = async () => {
        loadingContex.setLoading(true)

        let datas = {
            type: contextPanda?.active
        }

        await customAxios.post(`customer/categories`, datas)
            .then(async response => {
                setCategories(response?.data?.data)
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

    let lowercse = item.name.toLowerCase();
    reactotron.log({ lowercse })

    return (
        <>
            <HeaderWithTitle title={item?.name} />
            <ScrollView
                style={{ flex: 1, backgroundColor: grocery ? '#F4FFE9' : fashion ? '#FFF5F7' : '#fff', }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingHorizontal: 10 }}>
                    <FastImage
                        source={{ uri: `${IMG_URL}${item?.image}` }}
                        // source={{ uri: `${IMG_URL}${item?.image}` }}
                        style={styles.mainImage}
                        borderRadius={15}
                    />


                    {mode === 'store' && <StoreAddressCard />}
                    <Text style={styles.description}>{item?.seo_description}</Text>
                </View>

                {name === 'Restaurant' &&
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.restaurantView}
                    >
                        {fooodItems.map((item) =>
                            <TouchableOpacity key={item?._id} style={{ alignItems: 'center', width: width / 4.5 }}>
                                {/* <FastImage
                                    style={{ width: 60, height: 60, borderRadius: 30 }}
                                    source={require('../../../Images/biriyani.jpeg')}
                                    borderRadius={30}
                                /> */}
                                <Text style={styles.foodName}>{item?.name}</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>}

                {stores && stores?.length > 0 &&
                    <CommonTexts label={'Available Shops'} mt={15} mb={5} ml={10} fontSize={13} />}
                {stores && stores?.length > 0 &&
                    <View style={{ paddingBottom: 10, marginTop: 5 }}>
                        <View
                            style={[styles.categoryView, { gap: 5 }]}
                        >
                            {stores?.map((item, index) =>
                                <View style={{ width: lowercse === "restaurants" ? '32%' : "22%" }} key={index}>
                                    <PandaShopCard name={lowercse} item={item} key={index} />
                                </View>
                            )}
                        </View>
                    </View>}



                {name !== 'Restaurant' && mode !== 'grocery' && fashion &&
                    <View style={{ backgroundColor: '#76867314', paddingBottom: 10, marginTop: 5 }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ flexDirection: 'row', marginTop: 15 }}
                        >
                            {fashionType?.map((item, index) =>
                                (<TypeCard item={item} key={index} />)
                            )}
                        </ScrollView>
                    </View>
                }

                {name === 'Restaurant' && <View style={styles.hotelView}>
                    {hotels?.map((item) => (
                        <HotelCard
                            item={item}
                            key={item?._id}
                        />
                    ))}
                </View>}



                {/* {mode === 'store' && <CommonTexts label={'Available Stores'} my={15} ml={10} fontSize={13} />}

                {mode === 'store' && <View style={styles.hotelView}>
                    {stores?.map((item) => (
                        <HotelCard
                            item={item}
                            key={item?._id}
                        />
                    ))}
                </View>} */}

                {/* fashion categories */}

                {/* {mode === 'grocery' &&
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ backgroundColor: '#76867314', marginTop: 5 }}
                    >
                        {categories.map((item, index) =>
                        (<CommonItemSelect
                            item={item} key={index}
                            selected={selected}
                            setSelected={setSelected}
                        />)
                        )}
                    </ScrollView>} */}


                {/* fashion available products */}

                <>

                    {availablePdts?.length > 0 && <CommonTexts label={'Avalable Products'} mt={15} ml={10} fontSize={13} mb={5} />}
                    <View style={styles.itemContainer}>
                        {availablePdts?.map((item) => (
                            <CommonItemCard
                                item={item}
                                key={item?._id}
                                width={width / 2.2}
                                height={250}
                            // wishlistIcon={fashion ? true : false}
                            />
                        ))}
                    </View>


                </>
                {/*                 
                    {mode !== 'store' && mode !== 'grocery' && <View style={{ marginTop: 20, backgroundColor: '#F7F7F7', paddingVertical: 10, marginBottom: 100, paddingLeft: 5 }}>
                    <CommonTexts label={'Recommented Products'} fontSize={13} ml={10} mb={5} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    > */}
                {/* {recomment.map((item) =>
                            <CommonItemCard
                                key={item?._id}
                                item={item}
                                width={width / 2.5}
                                marginHorizontal={5}
                            />
                        )} */}
                {/* </ScrollView>
                </View>} */}


                {mode === 'grocery' &&
                    <View style={styles.recommPdtBox}>
                        <CommonTexts label={'Recommanded Products'} fontSize={13} ml={15} mb={5} />
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ flexDirection: 'row', paddingLeft: 7 }}
                        >
                            {recentView.map((item) =>
                                <CommonItemCard
                                    key={item?._id}
                                    item={item}
                                    width={width / 2.5}
                                    marginHorizontal={5}
                                />
                            )}
                        </ScrollView>
                    </View>}

            </ScrollView>
        </>
    )
}

export default Category

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
    categoryView: {
        // justifyContent:'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        // gap: 6,
        //justifyContent: 'center'
    },

})