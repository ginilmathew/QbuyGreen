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
import { IMG_URL } from '../../../config/constants'
import reactotron from '../../../ReactotronConfig'
import LoaderContext from '../../../contexts/Loader'
import customAxios from '../../../CustomeAxios'


const Category = ({ route }) => {

    const { width } = useWindowDimensions()


    const contextPanda = useContext(PandaContext)
    let grocery = contextPanda.greenPanda
    let fashion = contextPanda.pinkPanda

    const loadingContex = useContext(LoaderContext)
    let loadingg = loadingContex?.loading

    const { name, mode, item } = route?.params;

    const [availablePdts, setAvailabelPdts] = useState([])
    const [categories, setCategories] = useState([])
    reactotron.log({categories})

    const [selected, setSelected] = useState(false)

    useEffect(() => {
        getProductBasedCat()
    }, [])

    const getProductBasedCat = async() => {
        loadingContex.setLoading(true)

        let datas = {
            category_id:  item?._id,
            coordinates :  [
                [8.670514, 76.770417],
                [8.770963, 77.179658],
                [8.464103, 77.333466],
                [8.347269, 77.185151],
                [8.31194, 77.064301],
                [8.670514, 76.770417]
            ]
        }
    
        await customAxios.post(`customer/product/category-based`, datas)
        .then(async response => {
            setAvailabelPdts(response?.data?.data)
            loadingContex.setLoading(false)
        })
        .catch(async error => {
            // toast.show({
            //     title: 'Error',
            //     description : error,
            //     backgroundColor:'red.500'
            // })
            loadingContex.setLoading(false)
        })
    }

    useEffect(() => {
        getCategories()
    }, [])

    const getCategories = async() => {
        loadingContex.setLoading(true)

        let datas = {
            type: "fashion"
        }
    
        await customAxios.post(`customer/categories`, datas)
        .then(async response => {
            setCategories(response?.data?.data)
            loadingContex.setLoading(false)
        })
        .catch(async error => {
            // toast.show({
            //     title: 'Error',
            //     description : error,
            //     backgroundColor:'red.500'
            // })
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

    let hotels = [
        {
            _id: '1',
            hotel: 'Halais',
        },
        {
            _id: '2',
            hotel: 'Test Hotel 1'
        },
        {
            _id: '3',
            hotel: 'Test Hotel 2'
        },
        {
            _id: '4',
            hotel: 'Test Hotel 3'
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

    let grozerry = [
        {
            _id: '1',
            name: 'Carrot'
        },
        {
            _id: '2',
            name: 'Tomato'
        },
        {
            _id: '3',
            name: 'Cabbage'
        },
        {
            _id: '4',
            name: 'Lemon'
        },
        {
            _id: '5',
            name: 'Spinach'
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

    let fashionType = [
        {
            _id: '1',
            name: 'T-Shirts',
            image: require('../../../Images/tshirt.jpg')
        },
        {
            _id: '2',
            name: 'Pants',
            image: require('../../../Images/jeans.jpg')

        },
        {
            _id: '3',
            name: 'Shoes',
            image: require('../../../Images/shoes.jpg')

        },
        {
            _id: '4',
            name: 'Caps',
            image: require('../../../Images/cap.jpg')

        },
        {
            _id: '5',
            name: 'Sarees',
            image: require('../../../Images/saree.jpg')

        },

    ]

    let recentView = [
        {
            _id: '1',
            name: 'Jeans',
            rate: 250,
            hotel: 'RK Mall',
            image: require('../../../Images/jeans.jpg')
        },
        {
            _id: '2',
            name: 'Shirt',
            rate: 90,
            hotel: 'Shifa Textiles',
            image: require('../../../Images/shirt.jpg')
        },
        {
            _id: '3',
            name: 'Saree',
            rate: 150,
            hotel: 'Wedland',
            image: require('../../../Images/saree.jpg')
        },
        {
            _id: '4',
            name: 'Cap',
            rate: 180,
            hotel: 'Fb',
            image: require('../../../Images/cap.jpg')

        },

    ]

    return (
        <>
            <HeaderWithTitle title={name} />
            <ScrollView 
                style={{ flex: 1, backgroundColor: grocery ? '#F4FFE9' : fashion ? '#FFF5F7' : '#fff', }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingHorizontal: 10 }}>
                    <FastImage
                        source={item?.image  ?  { uri: `${IMG_URL}${item?.image}`} : require('../../../Images/jeans.jpg')} 
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
                                <FastImage
                                    style={{ width: 60, height: 60, borderRadius: 30 }}
                                    source={require('../../../Images/biriyani.jpeg')}
                                    borderRadius={30}
                                />
                                <Text style={styles.foodName}>{item?.name}</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>}

                {mode !== 'store' && mode !== 'grocery' &&
                    <CommonTexts label={'Available Shops'} mt={15} mb={5} ml={10} fontSize={13} />}
                {mode !== 'store' && mode !== 'grocery' && name != 'Restaurant' &&
                    <View style={{ paddingBottom: 10, marginTop: 5 }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ flexDirection: 'row', marginTop: 5 }}
                        >
                            {groceryType?.map((item, index) =>
                                (<TypeCard item={item} key={index} />)
                            )}
                        </ScrollView>
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

                {mode !== 'store' && mode !== 'grocery' && <View style={{ marginTop: 20, backgroundColor: '#F7F7F7', paddingVertical: 10, marginBottom: 100, paddingLeft: 5 }}>
                    <CommonTexts label={'Recommented Products'} fontSize={13} ml={10} mb={5} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {recomment.map((item) =>
                            <CommonItemCard
                                key={item?._id}
                                item={item}
                                width={width / 2.5}
                                marginHorizontal={5}
                            />
                        )}
                    </ScrollView>
                </View>}

                {mode === 'store' && <CommonTexts label={'Available Stores'} my={15} ml={10} fontSize={13} />}

                {mode === 'store' && <View style={styles.hotelView}>
                    {stores?.map((item) => (
                        <HotelCard
                            item={item}
                            key={item?._id}
                        />
                    ))}
                </View>}

{/* fashion categories */}

                {mode === 'grocery' &&
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
                    </ScrollView>}

                    
{/* fashion available products */}
                {mode === 'grocery' &&
                <>
                    {loadingg ? <ActivityIndicator/> : availablePdts && <>                    
                        <CommonTexts label={'Avalable Products'} mt={15} ml={10} fontSize={13} mb={5} />
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
                    </>}

                </>
                }



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
    }

})