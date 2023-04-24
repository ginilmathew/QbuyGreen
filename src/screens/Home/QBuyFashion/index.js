import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch, Platform, useWindowDimensions, ToastAndroid, Image, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import ImageSlider from '../../../Components/ImageSlider';
import CustomSearch from '../../../Components/CustomSearch';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CommonSquareButton from '../../../Components/CommonSquareButton';
import CommonItemMenuList from '../../../Components/CommonItemMenuList';
import CommonItemCard from '../../../Components/CommonItemCard';
import CommonTexts from '../../../Components/CommonTexts';
import NameText from '../NameText';
import PickDropAndReferCard from '../PickDropAndReferCard';
import Header from '../../../Components/Header';
import ShopCard from '../Grocery/ShopCard';
import TypeCard from '../Grocery/TypeCard';
import Offer from './Offer';
import CountDownComponent from '../../../Components/CountDown';
import LoaderContext from '../../../contexts/Loader';
import customAxios from '../../../CustomeAxios';
import reactotron from '../../../ReactotronConfig';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../../contexts/Auth';
import SearchBox from '../../../Components/SearchBox';
import Toast from 'react-native-simple-toast';


const QBuyFashion = () => {

    const auth = useContext(AuthContext)

    let coord = auth.location

    reactotron.log({auth: auth?.userData})


    const loadingg = useContext(LoaderContext)

    let loading = loadingg?.loading

    //const homeData = fashionHome?.fashionHomeData
    const [homeData, setHomeData] = useState(null)
    const [location, setLocation] = useState(null)

    const { width } = useWindowDimensions()

    const navigation = useNavigation()
    
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

    reactotron.log({homeData})

    let fashionStores = [
        {
            _id: '1',
            name: 'Asifa Artworks',
            type: 'grocery',
            image: require('../../../Images/fashionAd.jpeg')
        },
        {
            _id: '2',
            name: 'CJ Designers',
            type: 'grocery',
            image: require('../../../Images/jeans.jpg')
        },
        {
            _id: '3',
            name: 'Raymond Store',
            type: 'grocery',
            image: require('../../../Images/fashionAd.jpeg')
        },
        {
            _id: '4',
            name: 'Pattom Silks',
            type: 'grocery',
            image: require('../../../Images/saree.jpg')
        },
        {
            _id: '5',
            name: 'Raymond Store',
            type: 'grocery',
            image: require('../../../Images/shirt.jpg')
        },
        {
            _id: '6',
            name: 'CJ Designers',
            type: 'grocery',
            image: require('../../../Images/cap.jpg')
        },
        {
            _id: '7',
            name: 'Asifa Artworks',
            type: 'grocery',
            image: require('../../../Images/shirt.jpg')
        },
        {
            _id: '8',
            name: 'Raymond Store',
            type: 'grocery',
            image: require('../../../Images/fashionAd.jpeg')
        },
    ]

    const fashionImg = [
        {
            id: "1",
            img: require('../../../Images/fashionAd.jpeg')
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

    const pickupDropClick = useCallback(() => {
        navigation.navigate('PickupAndDropoff')
    }, [])


    const clickSellItem = useCallback(() => {
        navigation.navigate('RefferRestaurant')
    }, [])

    const gotoChat = useCallback(() => {
        navigation.navigate('Chat')
    }, [])

    const onClickDrawer = useCallback(() => {
        navigation.openDrawer()
    }, [])

    let offer = {
        hotel: 'Pattom Silks'
    }

    const goToShop = useCallback(() => {
        navigation.navigate('SingleHotel', { item: offer, mode: 'offers' })
    }, [])

    useEffect(() => {
        getHomedata(auth.location)
    }, [])

    const getHomedata = async (coords) => {
        loadingg.setLoading(true)
        let datas = {
            type: "fashion",
            coordinates: auth.location
        }
        await customAxios.post(`customer/home`, datas)
            .then(async response => {
                //fashionHome?.setFashionHomeData(response?.data?.data)
                setHomeData(response?.data?.data)
                loadingg.setLoading(false)
            })
            .catch(async error => {
                // console.log(error)
                Toast.showWithGravity(error, Toast.SHORT, Toast.BOTTOM);
                loadingg.setLoading(false)
            })
    }

    // reactotron.log({category: homeData?.category_list})

    const onSearch = useCallback(() => {
        navigation.navigate('ProductSearchScreen', {mode :'fashion'})
    }, [])

    return (
        <>
            <Header onPress={onClickDrawer} />
            <ScrollView style={styles.container}>

                <NameText userName={auth?.userData?.name ? auth?.userData?.name : auth?.userData?.mobile} mt={8} />
                <SearchBox onPress={onSearch}/>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', marginTop: 15 }}
                >
                    {categories?.map((item, index) =>
                        (<TypeCard item={item} key={index} mode="fashion" />)
                    )}
                </ScrollView>

                <ImageSlider datas={fashionImg} mt={20} />
                {storeList?.length > 0 &&<>            
                    <CommonTexts label={'Available Stores'} ml={15} fontSize={13} mt={20} />
                    <View style={styles.grossCatView}>
                        {storeList?.map((item) => (
                            <ShopCard key={item?._id} item={item} />
                        ))}
                    </View>
                </>}        
                <View style={styles.pickupReferContainer}>
                    <PickDropAndReferCard
                        onPress={pickupDropClick}
                        lotties={require('../../../Lottie/farmer.json')}
                        label={'Test'}
                        lottieFlex={0.7}
                    />
                    <PickDropAndReferCard
                        onPress={clickSellItem}
                        lotties={require('../../../Lottie/dresses.json')}
                        label={'Sell Your Items'}
                        lottieFlex={0.5}
                        ml={8}
                    />
                </View>

                <View style={styles.offerView}>
                    <Text style={styles.discountText}>{'50% off Upto Rs 125!'}</Text>
                    <Offer onPress={goToShop} shopName={offer?.hotel} />
                    <Text style={styles.offerValText}>{'Offer valid till period!'}</Text>
                </View>

                {recentViewList?.length > 0 && <>
                    <CommonTexts label={'Recently Viewed'} fontSize={13} mt={5} ml={15} mb={5} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ flexDirection: 'row', paddingLeft: 7 }}
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
                    style={{ flexDirection: 'row', paddingLeft: 7 }}
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
                {loading ? <ActivityIndicator/> : availablePdts?.length > 0 &&<>
                    <CommonTexts label={'Available Products'} fontSize={13} ml={15} mb={5} mt={15} />
                    <View style={styles.productContainer}>
                        {availablePdts?.map((item, index) => (
                            <CommonItemCard
                                key={index}
                                item={item}
                                width={width / 2.25}
                                height={250}
                            />
                            // <View key={index} style={{backgroundColor:'red', width:50, height:50}}></View>
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

export default QBuyFashion

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFF5F7'
    },

    grossCatView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        paddingHorizontal:'2%'
    },
    pickupReferContainer: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        marginTop: 20,
        justifyContent: 'space-evenly'
    },
    offerView: {
        alignItems: 'center',
        backgroundColor: '#FFDBE3',
        marginBottom: 20,
        paddingVertical: 15
    },
    discountText: {
        fontFamily: 'Poppins-Bold',
        color: '#FF4646',
        fontSize: 18,
    },
    offerValText: {
        fontFamily: 'Poppins-LightItalic',
        color: '#23233C',
        fontSize: 9,
        marginTop: 5,
    },
    productContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 17,
        paddingHorizontal: '3%'
    }

})