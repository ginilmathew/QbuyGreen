import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch, Platform, useWindowDimensions, ToastAndroid, Image, ActivityIndicator, SafeAreaView, RefreshControl } from 'react-native'
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AuthContext from '../../../contexts/Auth';
import SearchBox from '../../../Components/SearchBox';
import Toast from 'react-native-toast-message'
import CartContext from '../../../contexts/Cart';
import { IMG_URL, env, location } from '../../../config/constants';
import CategoryCard from '../QBuyGreen/CategoryCard';
import AvailableStores from '../QBuyGreen/AvailableStores';
import RecentlyViewed from '../QBuyGreen/RecentlyViewed';
import AvailableProducts from '../QBuyGreen/AvailableProducts';
import PandaSuggestions from '../QBuyGreen/PandaSuggestions';
import Carousel from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image';
import reactotron from '../../../ReactotronConfig';


const QBuyFashion = () => {

    const { width, height } = useWindowDimensions()

    const navigation = useNavigation()


    const auth = useContext(AuthContext)
    const cartContext = useContext(CartContext)

    let coord = auth.location

    const loadingg = useContext(LoaderContext)
    let loader = loadingg?.loading

    const [homeData, setHomeData] = useState(null)

    const [availablePdt, setavailablePdt] = useState(null)
    const [slider, setSlider] = useState(null)




    
    useEffect(() => {
        let availPdt = homeData?.find((item, index) => item?.type === 'available_products')
        setavailablePdt(availPdt?.data)
       
        let slider = homeData?.find((item, index) => item?.type === 'sliders')
        setSlider(slider?.data)
    }, [homeData])


    const schema = yup.object({
        name: yup.string().required('Name is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

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

    // useEffect(() => {
    //     getHomedata(coord)
    // }, [])

    useFocusEffect(
        React.useCallback(() => {
            getHomedata(coord)
        }, [])
      );

    
    const getHomedata = async (coord) => {
        reactotron.log('API CALLEDD')
        loadingg.setLoading(true)
        let datas = {
            type: "fashion",
            coordinates: env === "dev" ? location : auth.location
        }
        await customAxios.post(`customer/home`, datas)
            .then(async response => {
                //fashionHome?.setFashionHomeData(response?.data?.data)
                reactotron.log('API CALLEDD')
                setHomeData(response?.data?.data)
                loadingg.setLoading(false)
            })
            .catch(async error => {
                // console.log(error)
                Toast.show({
                    type: 'error',
                    text1: error
                });
                loadingg.setLoading(false)
            })
    }

    const onSearch = useCallback(() => {
        navigation.navigate('ProductSearchScreen')
    }, [])


    const renderItems = (item) => {
        if (item?.type === 'categories') {
            return (
                <>
                    <CategoryCard data={item?.data} />
                    {slider?.length > 0 && 
                    <View style={{ flex: 1 }}>
                        <Carousel
                            loop
                            width={width}
                            height={width / 2}
                            autoPlay={true}
                            data={slider}
                            scrollAnimationDuration={1000}
                            renderItem={CarouselCardItem}
                        />
                    </View>}
                </>
            )
        }
        if (item?.type === 'stores') {
            return (
                <>
                    <AvailableStores data={item?.data} />
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

                </>
            )
        }
        if (item?.type === 'offer_array') {
            return (
                <>
                    {item?.data?.length > 0 && <View style={styles.offerView}>
                        <Text style={styles.discountText}>{'50% off Upto Rs 125!'}</Text>
                        <Offer onPress={goToShop} shopName={offer?.hotel} />
                        {/* <CountDownComponent /> */}
                        <Text style={styles.offerValText}>{'Offer valid till period!'}</Text>
                    </View>}
                </>
            )
        }
        if (item?.type === 'recently_viewed') {
            return (
                <>
                    <RecentlyViewed data={item?.data} />
                </>
            )
        }
        if (item?.type === 'suggested_products') {
            return (
                <>
                    <PandaSuggestions data={item?.data} />
                </>
            )
        }
        // if (item?.type === 'available_products') {
        //     return (
        //         <>
        //             <AvailableProducts data={item?.data}  />
        //         </>
        //     )
        // }

    }
    const renderProducts = ({ item }) => {
        return (
            <CommonItemCard
                item={item}
                key={item?._id}
                width={width / 2.25}
                height={220}
                // wishlistIcon
                mr={8}
                ml={8}
                mb={15}
            />
        )
    }

    const CarouselCardItem = ({ item, index }) => {
        return (
            <View style={{ alignItems: 'center',marginTop:20 }} >
                <FastImage
                    source={{ uri: `${IMG_URL}${item?.image}` }}
                    style={{height:height/5, width: width-35,  borderRadius:20}}
                // resizeMode='contain'
                >
                </FastImage>
            </View>
        )
    }


    return (
        <>

              <View flex={1} justifyContent={'center'} alignItems={'center'}>
                    <Text style={{fontSize:20}}>Coming Soon!!!</Text>
              </View>

            {/* <Header onPress={onClickDrawer} />
            <View style={styles.container}>

                <ScrollView
                    removeClippedSubviews
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={loader} onRefresh={getHomedata} />
                    }
                >
                    <NameText userName={auth?.userData?.name ? auth?.userData?.name : auth?.userData?.mobile} mt={8} />
                    <SearchBox onPress={onSearch} />
                    {homeData?.map(home => renderItems(home))}
                    {availablePdt?.length > 0 && <CommonTexts label={'Available Products'} fontSize={13} ml={15} mb={10} mt={10} />}
                    <FlatList
                        data={availablePdt}
                        keyExtractor={(item, index) => index}
                        renderItem={renderProducts}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={6}
                        removeClippedSubviews={true}
                        windowSize={10}
                        maxToRenderPerBatch={5}
                        // refreshing={loader}
                        // onRefresh={getHomedata}
                        numColumns={2}
                        style={{ marginLeft: 5 }}
                    />
                </ScrollView> */}
                {/* <SearchBox onPress={onSearch}/>
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
                        ))}
                    </View>
                </>}     */}

            {/* </View>

            <CommonSquareButton
                onPress={gotoChat}
                position='absolute'
                bottom={10}
                right={10}
            />
 */}

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
        paddingHorizontal: '2%'
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