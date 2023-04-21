import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import FastImage from 'react-native-fast-image'
import PandaContext from '../../../contexts/Panda'
import CommonItemSelect from '../../../Components/CommonItemSelect'
import CommonItemCard from '../../../Components/CommonItemCard'
import TypeCard from '../Grocery/TypeCard'
import { IMG_URL } from '../../../config/constants'
import reactotron from '../../../ReactotronConfig'
import LoaderContext from '../../../contexts/Loader'
import customAxios from '../../../CustomeAxios'
import AuthContext from '../../../contexts/Auth'
import Toast from 'react-native-simple-toast';


const CategoryScreen = ({ route }) => {

    const { width } = useWindowDimensions()


    const contextPanda = useContext(PandaContext)
    const auth = useContext(AuthContext)


    const loadingContex = useContext(LoaderContext)
    let loadingg = loadingContex?.loading

    const { name, mode, item } = route?.params

    reactotron.log({item})

    const [availablePdts, setAvailabelPdts] = useState([])
    const [categories, setCategories] = useState([])
    reactotron.log({mode})

    const [selected, setSelected] = useState(false)

    useEffect(() => {
        getProductBasedCat(auth.location);
    }, [])


    

    const getProductBasedCat = async(coords) => {
        loadingContex.setLoading(true)
        let datas = {
            category_id: item?._id ? item?._id : item?.id,
            coordinates :  coords
        }
        await customAxios.post(`customer/product/category-based`, datas)
        .then(async response => {
            setAvailabelPdts(response?.data?.data)
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



    return (
        <>
            <HeaderWithTitle mode={mode} title={name} />
            <ScrollView 
                style={{ flex: 1, backgroundColor: contextPanda.active === "green" ? '#F4FFE9' : contextPanda.active === "fashion" ? '#FFF5F7' : '#fff', }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingHorizontal: 10 }}>
                    <FastImage
                        source={item?.image  ?  { uri: `${IMG_URL}${item?.image}`} : require('../../../Images/jeans.jpg')} 
                        style={styles.mainImage}
                        borderRadius={15}
                    />
                    <Text style={styles.description}>{item?.seo_description ? item?.seo_description : ''}</Text>
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


                    {loadingg ? <ActivityIndicator/> : availablePdts?.length > 0 && <>                    
                        <CommonTexts label={'Available Products'} mt={15} ml={10} fontSize={13} mb={5} />
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