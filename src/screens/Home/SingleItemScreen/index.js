import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import CommonTexts from '../../../Components/CommonTexts'
import ItemDetails from './ItemDetails'
import CustomButton from '../../../Components/CustomButton'
import OrderWhatsapp from './OrderWhatsapp'
import VideoPlayer from 'react-native-video-player'
import FastImage from 'react-native-fast-image'

import ScheduleDeliveryModal from './ScheduleDeliveryModal'
import CommonSelectDropdown from '../../../Components/CommonSelectDropdown'
import PandaContext from '../../../contexts/Panda'
import CommonItemCard from '../../../Components/CommonItemCard'
import ImageVideoBox from './ImageVideoBox'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CommonRating from '../../../Components/CommonRating'
import customAxios from '../../../CustomeAxios'
import reactotron from '../../../ReactotronConfig'
import { IMG_URL, mode } from '../../../config/constants'
import AuthContext from '../../../contexts/Auth'
import CartContext from '../../../contexts/Cart'
import LoaderContext from '../../../contexts/Loader'
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'

const fashions = require('../../../Images/jeans.jpg')
const fashion1 = require('../../../Images/jeans2.jpg')
const fashion2 = require('../../../Images/jeans3.jpg')
const thumbnailFashion = require('../../../Images/jeans4.jpg')
const fashion3 = require('../../../Images/jeans1.jpg')
const fashionVideo = require('../../../Videos/jeansVideo.mp4')
import Toast from 'react-native-simple-toast';


const SingleItemScreen = ({ route, navigation }) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const loadingg = useContext(LoaderContext)

    const [attributes, setAttributes] = useState([])
    const [price, setPrice] = useState('')
    const [selectedVariant, setSelectedVariant] = useState(null)


    let loader = loadingg?.loading

    const user = useContext(AuthContext)
    const cart = useContext(CartContext)

    let userData = user?.userData

    const item = route?.params?.item

    const [singleProduct, setSingleProduct] = useState([])
    const [selectedImage, setSelectedImage] = useState(0)
    const [showModal, setShowModal] = useState(false);
    const [date, setDate] = useState(new Date())

    const [value, setValue] = useState(null);

    const [valueColor, setValueColor] = useState(null);
    const [valueSize, setValueSize] = useState(null);


    reactotron.log({ singleProduct })

    const { width, height } = useWindowDimensions()

    let colors = singleProduct?.variants?.map((item, index) => {
        return (
            {
                label: item?.attributs?.[1],
                value: index
            }
        )
    })
    const uniqueColor = colors?.filter((obj, index) => colors?.findIndex((item) => item?.label === obj?.label) === index)

    let sizes = singleProduct?.variants?.map((item, index) => {
        return (
            {
                label: item?.attributs?.[0],
                value: index
            }
        )
    })


    const uniqueSize = sizes?.filter((obj, index) => sizes?.findIndex((item) => item?.label === obj?.label) === index)

    let varient = singleProduct?.variants?.map((item, index) => (item))
    selectedVarient = varient?.find((item) => (item?.attributs?.[0] === valueSize && item?.attributs?.[1] === valueColor))

    reactotron.log({ selectedVarient })


    useEffect(() => {
        getSingleProduct()
        addViewCount()
    }, [])

    const getSingleProduct = async () => {

        await customAxios.get(`customer/product/${item?._id}`)

            .then(async response => {
                setSingleProduct(response?.data?.data)
                getProductPrice(response?.data?.data)
                let attributes = response?.data?.data?.attributes.map(attr => {
                    let options = attr?.options?.map(op => {
                        return {
                            label: op,
                            value: op
                        }
                    })
                    return {
                        ...attr,
                        options,
                        selected: options?.[0]?.label,
                        optArray: attr?.options
                    }
                })
                setAttributes(attributes)
                // loadingg.setLoading(false)
            })
            .catch(async error => {
                Toast.showWithGravity(error, Toast.SHORT, Toast.BOTTOM);
            })
    }

    const addViewCount = async () => {
        let datas = {
            type : mode,
            product_id : item?._id,
            customer_id : userData?._id
        }
        await customAxios.post(`customer/product/viewcount`, datas)
            .then(async response => {
               
            })
            .catch(async error => {
                // Toast.showWithGravity(error, Toast.SHORT, Toast.BOTTOM);
            })
    }


    reactotron.log({ attributes })

    const data = [
        { label: 'Full', value: '1' },
        { label: 'Half', value: '2' },
        { label: 'Quarter', value: '3' },
    ];

    let fashionImg = [
        {
            _id: '1',
            name: fashions,
            file_type: 'image'
        },
        {
            _id: '2',
            name: fashion1,
            file_type: 'image'
        },
        {
            _id: '3',
            name: fashion2,
            file_type: 'image'
        },
        {
            _id: '4',
            name: thumbnailFashion,
            file_type: 'video',
            video: fashionVideo,
        },
        {
            _id: '5',
            name: fashion3,
            file_type: 'image'
        },
        {
            _id: '6',
            name: fashions,
            file_type: 'image'
        },
    ]

    more = [
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

    basket = [
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

    const gotoHotel = useCallback(() => {
        navigation.navigate('SingleHotel', { storeName: singleProduct?.store?.name, item : singleProduct})
    })

    const proceedCheckout = useCallback(() => {
        navigation.navigate('Checkout')
        setShowModal(false)
    })

    const closeModal = useCallback(() => {
        setShowModal(false)
    })

    const showModals = useCallback(() => {
        setShowModal(true)
    })

    const addToCart = useCallback(async () => {
        loadingg.setLoading(true)
        let cartItems;

        if(singleProduct?.variants?.length > 0 && cart?.cart){
            if(selectedVariant?.stock){
                if(parseFloat(selectedVariant?.stock_value) === 0){
                    Toast.show("Out of Stock", 2000)
                    return false;
                }
            }
            url = "customer/cart/update";
            let existing = cart?.cart?.product_details?.findIndex(prod => prod.product_id === singleProduct?._id && prod?.variants?.[0]?.variant_id === selectedVariant?._id)

            if(existing >= 0){
                let cartProducts = cart?.cart?.product_details;
                cartProducts[existing].quantity = cartProducts[existing].quantity + 1;
                cartItems = {
                    cart_id: cart?.cart?._id,
                    product_details: cartProducts,
                    user_id: userData?._id
                }

               
            }
            else{
                let productDetails = {
                    product_id: singleProduct?._id,
                    name: singleProduct?.name,
                    image: singleProduct?.product_image,
                    type: 'variant',
                    variants: [
                        {
                            variant_id: selectedVariant?._id,
                            attributs: selectedVariant?.attributs
                        }
                    ],
                    quantity: 1
                };

                cartItems = {
                    cart_id: cart?.cart?._id,
                    product_details: [...cart?.cart?.product_details, productDetails],
                    user_id: userData?._id
                }

            }
        }
        else if(cart?.cart){
            if(singleProduct?.stock){
                if(parseFloat(singleProduct?.stock_value) === 0){
                    Toast.show("Out of Stock", 2000)
                    return false;
                }
            }
            url = "customer/cart/update";
            let existing = cart?.cart?.product_details?.findIndex(prod => prod.product_id === singleProduct?._id)
            if(existing >= 0){
                let cartProducts = cart?.cart?.product_details;
                cartProducts[existing].quantity = cartProducts[existing].quantity + 1;
                cartItems = {
                    cart_id: cart?.cart?._id,
                    product_details: cartProducts,
                    user_id: userData?._id
                }
            }
            else{
                let productDetails = {
                    product_id: singleProduct?._id,
                    name: singleProduct?.name,
                    image: singleProduct?.product_image,
                    type: 'single',
                    variants: null,
                    quantity: 1
                };

                cartItems = {
                    cart_id: cart?.cart?._id,
                    product_details: [...cart?.cart?.product_details, productDetails],
                    user_id: userData?._id
                }
            }
        }
        else{
            url = "customer/cart/add";
            if(singleProduct?.variants?.length > 0 && selectedVariant?.stock){
                if(parseFloat(selectedVariant?.stock_value) === 0){
                    Toast.show("Out of Stock", 2000)
                    return false;
                }
            }
            else if(singleProduct?.stock){
                if(parseFloat(singleProduct?.stock_value) === 0){
                    Toast.show("Out of Stock", 2000)
                    return false;
                }
            }
            let productDetails = {
                product_id: singleProduct?._id,
                name: singleProduct?.name,
                image: singleProduct?.product_image,
                type: singleProduct?.variants?.length > 0 ? 'variant' : "single",
                variants: singleProduct?.variants?.length > 0 ?  [
                    {
                        variant_id: selectedVariant?._id,
                        attributs: selectedVariant?.attributs
                    }
                ] : null,
                quantity: 1
            };

            cartItems = {
                product_details: [productDetails],
                user_id: userData?._id
            }

        }


        await customAxios.post(url, cartItems)
            .then(async response => {
                cart.setCart(response?.data?.data)
                //user?.setCartId(response?.data?.data?._id)
                await AsyncStorage.setItem("cartId", response?.data?.data?._id)
                loadingg.setLoading(false)
                //navigation.navigate('cart')
            })
            .catch(async error => {
                console.log(error)
                // ToastAndroid.showWithGravity(
                //     error,
                //     ToastAndroid.SHORT,
                //     ToastAndroid.CENTER,
                // )
                loadingg.setLoading(false)
            })

        // // navigation.navigate('CartNav')
        // let productDetails = {
        //     product_id: singleProduct?._id,
        //     name: singleProduct?.name,
        //     image: singleProduct?.product_image,
        //     type: singleProduct?.variants?.length > 0 ? 'variant' : "single",
        //     variants: singleProduct?.variants?.length > 0 ?  [
        //         {
        //             variant_id: selectedVariant?._id,
        //             attributs: selectedVariant?.attributs
        //         }
        //     ] : null,
        //     quantity: 1
        // };
        // let url;
        // if (cart?.cart) {
        //     cartItems = {
        //         cart_id: cart?.cart?._id,
        //         product_details: [...cart?.cart?.product_details, productDetails],
        //         user_id: userData?._id
        //     }
        //     url = "customer/cart/update";
        // }
        // else {
        //     cartItems = {
        //         product_details: [productDetails],
        //         user_id: userData?._id
        //     }
        //     url = "customer/cart/add";
        // }

        // await customAxios.post(url, cartItems)
        //     .then(async response => {
        //         cart.setCart(response?.data?.data)
        //         //user?.setCartId(response?.data?.data?._id)
        //         await AsyncStorage.setItem("cartId", response?.data?.data?._id)
        //         loadingg.setLoading(false)
        //         //navigation.navigate('cart')
        //     })
        //     .catch(async error => {
        //         console.log(error)
        //         // ToastAndroid.showWithGravity(
        //         //     error,
        //         //     ToastAndroid.SHORT,
        //         //     ToastAndroid.CENTER,
        //         // )
        //         loadingg.setLoading(false)
        //     })

    }, [varient])


    const getProductPrice = useCallback((singleProduct) => {
        setSelectedVariant(singleProduct?.variants?.[0])
        if (singleProduct?.variants?.length > 0) {
            if (singleProduct?.variants?.[0]?.offer_price) {
                if (moment(singleProduct?.variants?.[0]?.offer_date_from) <= moment() && moment(singleProduct?.variants?.[0]?.offer_date_to) >= moment()) {
                    setPrice(singleProduct?.variants?.[0]?.offer_price)
                    //return singleProduct?.variants?.[0]?.offer_price;
                }
                else {
                    if(singleProduct?.variants?.[0]?.regular_price > 0){
                        setPrice(singleProduct?.variants?.[0]?.regular_price)
                    }
                    else{
                        let commission = (parseFloat(singleProduct?.variants?.[0]?.seller_price)/100) * parseFloat(singleProduct?.variants?.[0]?.commission)
                        let price = parseFloat(singleProduct?.variants?.[0]?.seller_price) + commission
                        setPrice(price)
                    }
                    //return singleProduct?.variants?.[0]?.regular_price;
                }
            }
            else {
                if(singleProduct?.variants?.[0]?.regular_price > 0){
                    setPrice(singleProduct?.variants?.[0]?.regular_price)
                }
                else{
                    let commission = (parseFloat(singleProduct?.variants?.[0]?.seller_price)/100) * parseFloat(singleProduct?.variants?.[0]?.commission)
                    let price = parseFloat(singleProduct?.variants?.[0]?.seller_price) + commission
                    setPrice(price)
                }
            }
        }
        else {
            if (singleProduct?.offer_price) {
                if (moment(singleProduct?.offer_date_from) <= moment() && moment(singleProduct?.offer_date_to) >= moment()) {
                    setPrice(singleProduct?.offer_price)
                    //return singleProduct?.offer_price;
                }
                else {
                    if(singleProduct?.regular_price > 0){
                        setPrice(singleProduct?.regular_price)
                    }
                    else{
                        let commission = (parseFloat(singleProduct?.seller_price)/100) * parseFloat(singleProduct?.commission)
                        let price = parseFloat(singleProduct?.seller_price) + commission
                        setPrice(price)
                    }
                    //setPrice(singleProduct?.regular_price)
                    //return singleProduct?.regular_price;
                }
            }
            else {
                if(singleProduct?.regular_price > 0){
                    setPrice(singleProduct?.regular_price)
                }
                else{
                    let commission = (parseFloat(singleProduct?.seller_price)/100) * parseFloat(singleProduct?.commission)
                    let price = parseFloat(singleProduct?.seller_price) + commission
                    setPrice(price)
                }
            }
        }
    }, [])


    const selectAttributes = (value) => {
        let attri = [];
        let attr = attributes?.map(att => {
            if (att?.optArray.includes(value)) {
                attri.push(value)
                return {
                    ...att,
                    selected: value
                }
            }
            else {
                attri.push(att.selected)
                return att
            }
        })

        singleProduct?.variants?.map(sin => {
            const containsAll = attri.every(element => {
                return sin?.attributs?.includes(element);
            });

            if (containsAll) {
                setSelectedVariant(sin)
                if (sin?.offer_price) {
                    if (moment(sin?.offer_date_from) <= moment() && moment(sin?.offer_date_to) >= moment()) {
                        setPrice(sin?.offer_price)
                        //return singleProduct?.offer_price;
                    }
                    else {
                        setPrice(sin?.regular_price)
                        //return singleProduct?.regular_price;
                    }
                }
                else {
                    setPrice(sin?.regular_price)
                    //return singleProduct?.regular_price;
                }
                return false;
            }
        })

        reactotron.log({ attr })

        setAttributes([...attr])
    }



    return (
        <>
            <HeaderWithTitle title={item?.name} />
            <ScrollView style={{ flex: 1, backgroundColor: contextPanda?.active === "green" ? '#F4FFE9' : contextPanda?.active === "fashion" ? '#FFF5F7' : '#fff', }} showsVerticalScrollIndicator={false}>

                <View style={{ height: 200 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, width: width, }}>
                        {/* { fashionImg[selectedImage]?.file_type?.includes('image') &&
                        <FastImage 
                            source={fashionImg[selectedImage]?.name} 
                            style={{width:width-30, height:180, borderRadius:15,}}
                        >
                        </FastImage>}

                        { fashionImg[selectedImage]?.file_type?.includes('video') && 
                        <View style={{backgroundColor:'#000', width:width-30, paddingVertical:10, borderRadius:15, height:180,}}>
                            <VideoPlayer
                                video={fashionImg[selectedImage]?.video} 
                                // showDuration={true}
                                controlsTimeout={2000}
                                pauseOnPress={true}
                                videoHeight={550}
                                resizeMode='contain'
                                thumbnail={fashionImg[selectedImage]?.name} 
                            />
                        </View> 
                        } */}

                        {singleProduct?.image && singleProduct?.image?.length > 0 ?
                        <FastImage
                            // source={singleProduct?.image[selectedImage]?.name} 
                            source={{ uri: `${IMG_URL}${singleProduct?.image[selectedImage]}` }}
                            style={{ width: width - 30, height: 180, borderRadius: 15, }}
                            resizeMode='cover'
                        >
                        </FastImage> : <FastImage
                            // source={singleProduct?.image[selectedImage]?.name} 
                            source={{ uri: `${IMG_URL}${singleProduct?.product_image}` }}
                            style={{ width: width - 30, height: 180, borderRadius: 15, }}
                            resizeMode='cover'
                        >
                        </FastImage>
                        }


                    </View>

                    {singleProduct?.stock && <View
                        style={{ position: 'absolute', left: 20, top: 15, backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 8 }}
                    >
                        <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'In Stock'}</Text>
                    </View>}

                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {singleProduct?.image?.map((item, index) =>
                        <ImageVideoBox
                            key={index}
                            setSelectedImage={setSelectedImage}
                            selectedImage={selectedImage}
                            item={item}
                            index={index}
                        />
                    )}
                </ScrollView>

                <ItemDetails
                    // onPress={gotoHotel}
                    itemName={singleProduct?.name}
                    hotelName={singleProduct?.store?.name}
                    views={singleProduct?.viewCount ? singleProduct?.viewCount : 0}
                    sold={5}
                    minQty={singleProduct?.minimum_qty}
                    price={price}
                />
                <View style={{ paddingHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap' }}>
                            {(attributes?.map((attr, index) =>
                                <CommonSelectDropdown
                                    key={index}
                                    placeholder={attr?.name}
                                    data={attr.options}
                                    value={attr.selected}
                                    setValue={selectAttributes}
                                    height={35}
                                    width={'48%'}
                                />
                            ))}
                        </View>

                    {contextPanda?.active === "panda" && <CommonSelectDropdown
                        mb={20}
                        placeholder='Portion Size'
                        data={data}
                        value={value}
                        setValue={setValue}
                    />}
                </View>

                <View style={{ flexDirection: 'row', width: width, justifyContent: contextPanda?.active === "panda" ? 'space-between' : 'center', marginTop: 10, paddingHorizontal: 10 }}>
                    {contextPanda?.active === "panda" && <CustomButton
                        label={'Pre-Order'} bg='#D3D358' width={width / 2.2} onPress={showModals}
                    />}
                    <CustomButton
                        onPress={addToCart}
                        label={'Add to Cart'} bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} width={width / 2.2}
                        loading={loader}
                    />

                </View>
                <View style={{ backgroundColor: '#0C256C0D', height: 1, marginVertical: 20 }} />

                {/* <CommonTexts label={'More With Us'} fontSize={13} ml={15} mb={5} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', paddingLeft: 7, }}
                >
                    {more.map((item) =>
                        <CommonItemCard
                            key={item?._id}
                            item={item}
                            width={width / 2.5}
                            marginHorizontal={5}
                        />
                    )}
                </ScrollView> */}

                {/* <CommonTexts label={'Panda Basket'} fontSize={13} ml={15} mb={5} mt={15} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', paddingLeft: 7, }}
                >
                    {basket.map((item) =>
                        <CommonItemCard
                            key={item?._id}
                            item={item}
                            width={width / 2.5}
                            marginHorizontal={5}
                        />
                    )}
                </ScrollView> */}

                <OrderWhatsapp />

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

                {/* {pandaSuggestion?.length > 0 && <>
                    <CommonTexts label={'Panda Suggestions'} fontSize={13} ml={15} mb={5} mt={15} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ flexDirection: 'row', paddingLeft: 7, paddingBottom: 50 }}
                    >
                        {pandaSuggestion?.map((item) =>
                            <CommonItemCard
                                key={item?._id}
                                item={item}
                                width={width / 2.5}
                                marginHorizontal={5}
                            />
                        )}
                    </ScrollView>
                </>} */}


                <ScheduleDeliveryModal
                    showModal={showModal}
                    setDate={setDate}
                    date={date}
                    onPress={closeModal}
                    checkout={proceedCheckout}
                />



            </ScrollView>
        </>
    )
}

export default SingleItemScreen

const styles = StyleSheet.create({})