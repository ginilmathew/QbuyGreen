import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch, Platform, useWindowDimensions, SafeAreaView } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import ImageSlider from '../../../Components/ImageSlider';
import CustomSearch from '../../../Components/CustomSearch';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import OfferText from '../OfferText';
import PickDropAndReferCard from '../PickDropAndReferCard';
import Header from '../../../Components/Header';
import CommonSquareButton from '../../../Components/CommonSquareButton';
import CommonTexts from '../../../Components/CommonTexts';
import TypeCard from '../Grocery/TypeCard';
import CommonItemCard from '../../../Components/CommonItemCard';
import NameText from '../NameText';
import ShopCard from '../Grocery/ShopCard';
import CountDownComponent from '../../../Components/CountDown';
import Offer from './Offer';
import LoaderContext from '../../../contexts/Loader';
import customAxios from '../../../CustomeAxios';
import SearchBox from '../../../Components/SearchBox';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import AuthContext from '../../../contexts/Auth';
import reactotron from 'reactotron-react-native';


const QBuyGreen = ({ navigation }) => {

    const { width } = useWindowDimensions()

    const loadingg = useContext(LoaderContext)
    const userContext = useContext(AuthContext)

    reactotron.log({userContext: userContext.userData})

    let loader = loadingg?.loading

    const [homeData, setHomeData] = useState(null)

    const categories = homeData?.category_list
    const storeList = homeData?.store_list
    const recentViewList = homeData?.recently_viewed
    const availablePdts = homeData?.available_products

    const schema = yup.object({
        name: yup.string().required('Name is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

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

    

   


    


    

    const groceImg = [
        {
            id: "1",
            img: require('../../../Images/groceryAdds.jpeg')
        },
        {
            id: "2",
            img: require('../../../Images/image1.jpeg')
        },
        {
            id: "3",
            img: require('../../../Images/image2.jpeg')
        },
        {
            id: "4",
            img: require('../../../Images/image3.jpeg')
        }
    ]

    const ourFarm = useCallback(() => {
        navigation.navigate('OurFarms')
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

    let offer = {
        hotel: 'Farm N Fresh'
    }

    const goToShop = useCallback(() => {
        navigation.navigate('SingleHotel', { item: offer, mode: 'offers' })
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            getHomedata()
        }, [])
    );

    const getHomedata = async () => {

        loadingg.setLoading(true)

        let datas = {
            type: "green",
            coordinates : userContext?.location
        }
        await customAxios.post(`customer/home`, datas)
            .then(async response => {
                setHomeData(response?.data?.data)
                loadingg.setLoading(false)
            })
            .catch(async error => {
                console.log(error)
                Toast.showWithGravity(error, Toast.SHORT, Toast.BOTTOM);
                loadingg.setLoading(false)
            })
    }
    const onSearch = useCallback(() => {
        navigation.navigate('ProductSearchScreen', {mode :'fashion'})
    }, [])

    return (
        <>
            <Header onPress={onClickDrawer} />
            <ScrollView style={styles.container} >
                <NameText userName={userContext?.userData?.name ? userContext?.userData?.name : userContext?.userData?.mobile} mt={8} />
                <SearchBox onPress={onSearch}/>
                {categories?.length > 0 && <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', marginTop: 15 }}
                >
                    {categories?.map((item, index) =>
                        (<TypeCard item={item} key={index} />)
                    )}
                </ScrollView>}

                <ImageSlider datas={groceImg} mt={20} />
                {storeList?.length > 0 && <>
                    <CommonTexts label={'Available Stores'} ml={15} fontSize={13} mt={20} />
                    <View style={styles.grossCatView}>
                        {storeList?.map((item, index) => (
                            <ShopCard key={index} item={item} />
                        ))}
                    </View>
                </>}

                <View style={styles.pickupReferContainer}>
                    <PickDropAndReferCard
                        onPress={ourFarm}
                        lotties={require('../../../Lottie/farmer.json')}
                        label={'Our Farms'}
                        lottieFlex={1}
                    />
                    <PickDropAndReferCard
                        onPress={referRestClick}
                        lotties={require('../../../Lottie/farm.json')}
                        label={"Let's Farm Together"}
                        lottieFlex={0.4}
                    />
                </View>

                <View style={styles.offerView}>
                    <Text style={styles.discountText}>{'50% off Upto Rs 125!'}</Text>
                    <Offer onPress={goToShop} shopName={offer?.hotel} />
                    {/* <CountDownComponent/> */}
                    <Text style={styles.offerValText}>{'Offer valid till period!'}</Text>
                </View>

                {recentViewList?.length > 0 && <>
                    <CommonTexts label={'Recently Viewed'} fontSize={13} mt={5} ml={15} mb={5} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ flexDirection: 'row', paddingLeft: 7, }}
                    >
                        {recentViewList.map((item) =>
                            <CommonItemCard
                                key={item?._id}
                                item={item}
                                width={width / 2.5}
                                marginHorizontal={5}
                            />
                        )}
                    </ScrollView>
                </>}

                {/* <CommonTexts label={'Trending Sales'} fontSize={13} ml={15} mb={5} mt={15} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', paddingLeft: 7, }}
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

                {/* <CommonItemMenuList
                    list={grozz}
                    label={'Available Products'}
                    mb={80}
                /> */}

                {availablePdts?.length > 0 && <>
                    <CommonTexts label={'Available Products'} fontSize={13} ml={15} mb={5} mt={15} />
                    <View style={styles.productContainer}>
                        {availablePdts?.map((item) => (
                            <CommonItemCard
                                item={item}
                                key={item?._id}
                                width={width / 2.25}
                                height={250}
                                wishlistIcon
                            />
                        ))}
                    </View>
                </>}

            </ScrollView>

            <CommonSquareButton
                onPress={gotoChat}
                position='absolute'
                bottom={10}
                right={10}
            />
        </>
    )
}

export default QBuyGreen

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F4FFE9'
    },
    grossCatView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        paddingHorizontal: '1%'
    },
    pickupReferContainer: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        marginTop: 20,
        justifyContent: 'space-evenly'
    },
    offerView: {
        alignItems: 'center',
        backgroundColor: '#DDFFCB',
        marginBottom: 20,
        paddingVertical: 15
    },
    discountText: {
        fontFamily: 'Poppins-Bold',
        color: '#464CFF',
        fontSize: 18,
    },
    offerValText: {
        fontFamily: 'Poppins-LightItalic',
        color: '#23233C',
        fontSize: 10,
        marginTop: 5
    },
    productContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 17,
        paddingHorizontal: '3%'
    }

})