import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch, Platform, useWindowDimensions, ToastAndroid } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import ImageSlider from '../../Components/ImageSlider';
import CustomSearch from '../../Components/CustomSearch';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import NameText from './NameText';
import CategoriesCard from './CategoriesCard';
import OfferText from './OfferText';
import PickDropAndReferCard from './PickDropAndReferCard';
import Header from '../../Components/Header';
import PandaContext from '../../contexts/Panda';
import CommonSquareButton from '../../Components/CommonSquareButton';
import ShopCard from './Grocery/ShopCard';
import CommonItemSelect from '../../Components/CommonItemSelect';
import CommonTexts from '../../Components/CommonTexts';
import CommonItemMenuList from '../../Components/CommonItemMenuList';
import TypeCard from './Grocery/TypeCard';
import CommonItemCard from '../../Components/CommonItemCard';
import CommonFiltration from '../../Components/CommonFiltration';
import SearchBox from '../../Components/SearchBox';

const QbuyPanda = ({ navigation }) => {

    // const contextPanda = useContext(PandaContext)
    // let grocery = contextPanda.greenPanda
    // let fashion = contextPanda.pinkPanda

    const [selected, setSelected] = useState('')

    const { width } = useWindowDimensions()

    const schema = yup.object({
        name: yup.string().required('Name is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    let datas = [
        {
            _id: '1',
            name: 'Biriyani'
        },
        {
            _id: '2',
            name: 'Fresh Meat'
        },
        {
            _id: '3',
            name: 'Lunch Box'
        },
        {
            _id: '4',
            name: 'Veggies'
        },
        {
            _id: '5',
            name: 'Farm Pick'
        },

    ]

    let categories = [
        {
            _id: '1',
            name: 'Vegetables',
            lottie: require('../../Lottie/veg.json'),
            type: 'grocery'
        },
        {
            _id: '2',
            name: 'Fruits',
            lottie: require('../../Lottie/fruits.json'),
            type: 'grocery'
        },
        {
            _id: '3',
            name: 'Fish,Meat',
            lottie: require('../../Lottie/meat.json'),
            type: 'grocery'
        },
        {
            _id: '4',
            name: 'Home Chef',
            lottie: require('../../Lottie/chef.json'),
            type: 'grocery'
        },
        {
            _id: '5',
            name: 'Grocery',
            lottie: require('../../Lottie/grocery.json'),
            type: 'grocery'
        },
        {
            _id: '6',
            name: 'Restaurant',
            lottie: require('../../Lottie/rest.json'),
            type: 'restuarant'
        },
        {
            _id: '7',
            name: 'Snacks',
            lottie: require('../../Lottie/pop.json'),
            type: 'grocery'
        },
        {
            _id: '8',
            name: 'Pet foods',
            type: 'grocery',
            lottie: require('../../Lottie/petFood.json'),
        },
    ]

    let recentView = [
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

    let pandaSugg = [
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


    let trend = [
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



    let menus = [
        {
            _id: '1',
            name: 'Chicken Biriyani',
            rate: 260,
            openCloseTag: 'Closes Soon',
            hotel: 'MRA'
        },
        {
            _id: '2',
            name: 'Chicken Mandhi',
            rate: 380,
            hotel: 'Zam Zam'
        },
        {
            _id: '3',
            name: 'Chicken Fried Rice',
            rate: 200,
            hotel: 'Al-Saj'
        },
        {
            _id: '4',
            name: 'Mutton Biriyani',
            openCloseTag: 'Opens Soon',
            rate: 350,
            hotel: 'Le-Arabia'
        },


    ]



    const images = [
        {
            id: "1",
            img: require('../../Images/ads.png')
        },
        {
            id: "2",
            img: require('../../Images/image1.jpeg')
        },
        {
            id: "3",
            img: require('../../Images/image2.jpeg')
        },
        {
            id: "4",
            img: require('../../Images/image3.jpeg')
        }
    ]



    const pickupDropClick = useCallback(() => {
        navigation.navigate('PickupAndDropoff')
    }, [])

    const referRestClick = useCallback(() => {
        navigation.navigate('RefferRestaurant')
    }, [])

    const gotoChat = useCallback(() => {
        navigation.navigate('Chat')
    }, [])

    const onClickDrawer = useCallback(() => {
        navigation.openDrawer()
    }, [])

    const onSearch = useCallback(() => {
        navigation.navigate('ProductSearchScreen', { mode: 'fashion' })
    }, [])

    return (
        <>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:20}}>Comming Soon!!!</Text>
                </View>
          
            {/* <Header onPress={onClickDrawer} /> */}
            {/* <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} > */}
{/* 
                <ImageSlider datas={images} mt={5} /> */}
{/* 
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.foodTypeView}
                >
                    {datas.map((item, index) =>
                    (<CommonItemSelect
                        item={item} key={index}
                        selected={selected}
                        setSelected={setSelected}
                    />)
                    )}
                </ScrollView> */}

                {/* <SearchBox onPress={onSearch} /> */}


                {/* <NameText userName={'Shaan Johnson'} mb={20} /> */}
{/* 
                <View style={styles.categoryView}>
                    {categories?.map((item) => (
                        <CategoriesCard key={item?._id} item={item} />
                    ))}
                </View> */}

                {/* <View style={styles.pickupReferContainer}>
                    <PickDropAndReferCard
                        onPress={pickupDropClick}
                        lotties={require('../../Lottie/deliveryBike.json')}
                        label={'Pick Up & Drop Off'}
                        lottieFlex={0.5}
                    />
                    <PickDropAndReferCard
                        onPress={referRestClick}
                        lotties={require('../../Lottie/rating.json')}
                        label={'Refer A Restaurant'}
                        lottieFlex={0.5}
                    />
                </View> */}

                {/* <View style={styles.offerView}> */}
                    {/* <Text style={styles.discountText}>{'50% off Upto Rs 125!'}</Text> */}
                    {/* <OfferText /> */}
                    {/* <CountDownComponent/> */}
                    {/* <Text style={styles.offerValText}>{'Offer valid till period!'}</Text> */}
                {/* </View> */}

                {/* <View
                    style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginBottom: 5, justifyContent: 'space-between', marginRight: 5 }}
                >
                    <CommonTexts label={'Recently Viewed'} fontSize={13} />
                    <CommonFiltration />
                </View> */}

                {/* <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', paddingLeft: 7, }}
                >
                    {recentView.map((item) =>
                        <CommonItemCard
                            key={item?._id}
                            item={item}
                            width={width / 2.5}
                            marginHorizontal={5}
                        />
                    )}
                </ScrollView> */}

                {/* <CommonTexts label={'Panda Suggestions'} fontSize={13} ml={15} mb={5} mt={15} /> */}
                {/* <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', paddingLeft: 7, }}
                >
                    {pandaSugg.map((item) =>
                        <CommonItemCard
                            key={item?._id}
                            item={item}
                            width={width / 2.5}
                            marginHorizontal={5}
                        />
                    )}
                </ScrollView> */}

                {/* <CommonTexts label={'Lunch Menu'} fontSize={13} ml={15} mb={5} mt={15} />
                <View style={styles.menuContainer}>
                    {menus?.map((item) => (
                        <CommonItemCard
                            item={item}
                            key={item?._id}
                            width={width / 2.25}
                            height={250}
                        />
                    ))}
                </View> */}

                {/* <CommonTexts label={'Trending Sales'} fontSize={13} ml={15} mb={5} mt={15} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', paddingLeft: 7, marginBottom: 80 }}
                >
                    {trend.map((item) =>
                        <CommonItemCard
                            key={item?._id}
                            item={item}
                            width={width / 2.5}
                            marginHorizontal={5}
                        />
                    )}
                </ScrollView> */}
            {/* </ScrollView> */}
            {/* <CommonSquareButton
                onPress={gotoChat}
                position='absolute'
                bottom={10}
                right={10}
            /> */}
        </>
    )
}

export default QbuyPanda

const styles = StyleSheet.create({

    foodTypeView: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        marginTop: 10,
        paddingLeft: 8
    },
    foodTypeText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 14,
        paddingVertical: 8
    },
    categoryView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center'
    },
    grossCatView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
    },
    pickupReferContainer: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        marginTop: 20,
        justifyContent: 'space-evenly'
    },
    offerView: {
        alignItems: 'center',
        backgroundColor: '#329D9C36',
        marginBottom: 10
    },
    discountText: {
        fontFamily: 'Poppins-Bold',
        color: '#464CFF',
        fontSize: 18,
        marginTop: 10
    },
    offerValText: {
        fontFamily: 'Poppins-LightItalic',
        color: '#23233C',
        fontSize: 10,
        marginBottom: 5,
        marginTop: 3
    },
    shopName: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 5,
        paddingHorizontal: 10
    },
    menuContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 17,
        paddingHorizontal: '3%'
    }
})