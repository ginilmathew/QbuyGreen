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
import Toast from 'react-native-toast-message';
import { isEmpty } from 'lodash'

const fashions = require('../../../Images/jeans.jpg')
const fashion1 = require('../../../Images/jeans2.jpg')
const fashion2 = require('../../../Images/jeans3.jpg')
const thumbnailFashion = require('../../../Images/jeans4.jpg')
const fashion3 = require('../../../Images/jeans1.jpg')
const fashionVideo = require('../../../Videos/jeansVideo.mp4')



const SingleItemScreen = ({ route, navigation }) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const loadingg = useContext(LoaderContext)

    const [attributes, setAttributes] = useState([])
    const [price, setPrice] = useState('')
    const [selectedVariant, setSelectedVariant] = useState(null)


    // reactotron.log({attributes})


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


    useEffect(() => {
        singleProduct?.image?.splice(0, 0, singleProduct?.product_image)
        // reactotron.log({newArray: singleProduct?.image})
    }, [singleProduct?.product_image, singleProduct?.image])
    
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
                Toast.show({
                    type: 'error',
                    text1: error
                });
            })
    }

    const addViewCount = async () => {
        let datas = {
            type: mode,
            product_id: item?._id,
            customer_id: userData?._id
        }
        await customAxios.post(`customer/product/viewcount`, datas)
            .then(async response => {

            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
            })
    }


    

   

    

   

   
   

    const gotoHotel = useCallback(() => {
        navigation.navigate('SingleHotel', { storeName: singleProduct?.store?.name, item: singleProduct })
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
        
        let cartItems;
        let productDetails;
        let minimumQty = singleProduct?.minimum_qty ? parseFloat(singleProduct?.minimum_qty) : 1

        reactotron.log({minimumQty});
        //return false

        if (singleProduct?.variants?.length > 0 && cart?.cart) {

            //Check products have no stock
            if (singleProduct?.stock) {
                if (parseFloat(selectedVariant?.stock_value) === 0) {
                    Toast.show({
                        type: 'error',
                        text1: "Required Stock not available"
                    });
                    return false;
                }
            }
            url = "customer/cart/update";
            let existing = cart?.cart?.product_details?.findIndex(prod => prod.product_id === singleProduct?._id && prod?.variants?.[0]?.variant_id === selectedVariant?._id)

            if (existing >= 0) {
                let cartProducts = cart?.cart?.product_details;
                let quantity = cartProducts[existing].quantity + 1;
                if(parseFloat(selectedVariant?.stock_value) >= quantity){
                    cartProducts[existing].quantity = cartProducts[existing].quantity + 1;
                    cartItems = {
                        cart_id: cart?.cart?._id,
                        product_details: cartProducts,
                        user_id: userData?._id
                    }
                }
                else{
                    Toast.show({
                        type: 'info',
                        text1: 'Required quantity not available'
                    })
                    return false;
                }

            }
            else {
                if(singleProduct?.stock){
                    if(parseFloat(selectedVariant?.stock_value) >= minimumQty){
                        productDetails = {
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
                            quantity: minimumQty
                        };
                        cartItems = {
                            cart_id: cart?.cart?._id,
                            product_details: [...cart?.cart?.product_details, productDetails],
                            user_id: userData?._id
                        }
                    }
                    else{
                        Toast.show({
                            type: 'info',
                            text1: 'Required quantity not available'
                        })
                        return false;
                    }
                }
                else{
                    productDetails = {
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
                        quantity: minimumQty
                    };
                    cartItems = {
                        cart_id: cart?.cart?._id,
                        product_details: [...cart?.cart?.product_details, productDetails],
                        user_id: userData?._id
                    }
                }
                

            }
        }
        else if (cart?.cart) {
            if (singleProduct?.stock) {
                if (parseFloat(singleProduct?.stock_value) === 0) {
                    Toast.show({
                        type: 'info',
                        text1: "Required quantity not available"
                    });
                    return false;
                }
            }
            url = "customer/cart/update";
            let existing = cart?.cart?.product_details?.findIndex(prod => prod.product_id === singleProduct?._id)
            if (existing >= 0) {
                let cartProducts = cart?.cart?.product_details;
                let quantity = cartProducts[existing].quantity + 1;
                if(singleProduct?.stock_value >= quantity){
                    cartProducts[existing].quantity = cartProducts[existing].quantity + 1;

                    cartItems = {
                        cart_id: cart?.cart?._id,
                        product_details: cartProducts,
                        user_id: userData?._id
                    }
                }
                else{
                    Toast.show({
                        type: 'info',
                        text1: "Required quantity not available"
                    });
                    return false;
                }
            }
            else {

                if(singleProduct?.stock){
                    if(parseFloat(singleProduct?.stock_value) >= minimumQty){
                        productDetails = {
                            product_id: singleProduct?._id,
                            name: singleProduct?.name,
                            image: singleProduct?.product_image,
                            type: 'single',
                            variants: null,
                            quantity: minimumQty
                        };
                        cartItems = {
                            cart_id: cart?.cart?._id,
                            product_details: [...cart?.cart?.product_details, productDetails],
                            user_id: userData?._id
                        }
                    }
                    else{
                        Toast.show({
                            type: 'info',
                            text1: "Required quantity not available"
                        });
                        return false;
                    }
                }

                

                
            }
        }
        else {
            url = "customer/cart/add";
            if (singleProduct?.variants?.length > 0 && singleProduct?.stock) {
                if (parseFloat(selectedVariant?.stock_value) === 0) {
                    Toast.show({
                        type: 'info',
                        text1: "Required quantity not available"
                    });
                    return false;
                }
                else if(parseFloat(selectedVariant?.stock_value) >= minimumQty){
                    productDetails = {
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
                        quantity: minimumQty
                    };
                    cartItems = {
                        cart_id: cart?.cart?._id,
                        product_details: cart?.cart?.product_details ?  [...cart?.cart?.product_details, productDetails] : [productDetails],
                        user_id: userData?._id
                    }
                }
                else{
                    Toast.show({
                        type: 'info',
                        text1: 'Required quantity not available'
                    })
                    return false;
                }
            }
            else if (singleProduct?.stock) {
                if (parseFloat(singleProduct?.stock_value) === 0) {
                    Toast.show({
                        type: 'info',
                        text1: "Required quantity not available"
                    });
                    return false;
                }
                else if(parseFloat(singleProduct?.stock_value) >= minimumQty){
                    productDetails = {
                        product_id: singleProduct?._id,
                        name: singleProduct?.name,
                        image: singleProduct?.product_image,
                        type: 'single',
                        variants: null,
                        quantity: minimumQty
                    };
                    cartItems = {
                        cart_id: cart?.cart?._id,
                        product_details: cart?.cart?.product_details ?  [...cart?.cart?.product_details, productDetails] : [productDetails],
                        user_id: userData?._id
                    }
                }
                else{
                    Toast.show({
                        type: 'info',
                        text1: "Required quantity not available"
                    });
                    return false;
                }
            }

        }

        loadingg.setLoading(true)
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
                Toast.show({
                    type: 'error',
                    text1: error
                });
                loadingg.setLoading(false)
            })

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
                    if (singleProduct?.variants?.[0]?.regular_price > 0) {
                        setPrice(singleProduct?.variants?.[0]?.regular_price)
                    }
                    else {
                        let commission = (parseFloat(singleProduct?.variants?.[0]?.seller_price) / 100) * parseFloat(singleProduct?.variants?.[0]?.commission)
                        let price = parseFloat(singleProduct?.variants?.[0]?.seller_price) + commission
                        setPrice(price)
                    }
                    //return singleProduct?.variants?.[0]?.regular_price;
                }
            }
            else {
                if (singleProduct?.variants?.[0]?.regular_price > 0) {
                    setPrice(singleProduct?.variants?.[0]?.regular_price)
                }
                else {
                    let commission = (parseFloat(singleProduct?.variants?.[0]?.seller_price) / 100) * parseFloat(singleProduct?.variants?.[0]?.commission)
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
                    if (singleProduct?.regular_price > 0) {
                        setPrice(singleProduct?.regular_price)
                    }
                    else {
                        let commission = (parseFloat(singleProduct?.seller_price) / 100) * parseFloat(singleProduct?.commission)
                        let price = parseFloat(singleProduct?.seller_price) + commission
                        setPrice(price)
                    }
                }
            }
            else {
                if (singleProduct?.regular_price > 0) {
                    setPrice(singleProduct?.regular_price)
                }
                else {
                    let commission = (parseFloat(singleProduct?.seller_price) / 100) * parseFloat(singleProduct?.commission)
                    let price = parseFloat(singleProduct?.seller_price) + commission
                    setPrice(price)
                }
            }
        }
    }, [])


    const selectAttributes = (value) => {
        //reactotron.log({value, attributes})
        let attri = [];
        let attr = attributes?.map(att => {
            if (att?.optArray.includes(value)) {
                if(att?.variant){
                    attri.push(value)
                }
               
                return {
                    ...att,
                    selected: value
                }
            }
            else {
                if(att?.variant){
                    attri.push(att.selected)
                }
                return att
            }
        })

        //reactotron.log({attri})
        //let filtered = 

        singleProduct?.variants?.map(sin => {
            let attributes = []
            sin?.attributs?.map(att => {
                attributes.push(att)
            })
            //reactotron.log({attributes})
            const containsAll = attri.every(elem => attributes.includes(elem));
            


            if (containsAll) {
                //reactotron.log({containsAll})
                setSelectedVariant(sin)
                if (sin?.offer_price) {
                    if (moment(sin?.offer_date_from) <= moment() && moment(sin?.offer_date_to) >= moment()) {
                        setPrice(sin?.offer_price)
                        //return singleProduct?.offer_price;
                    }
                    else if(sin?.regular_price){
                        setPrice(sin?.regular_price)
                        //return singleProduct?.regular_price;
                    }
                    else{
                        let commission = (parseFloat(sin?.seller_price)/100) * parseFloat(sin?.commission)
                        let amount = (parseFloat(sin?.seller_price) + parseFloat(commission));
                        setPrice(amount)
                    }
                }
                else if(sin?.regular_price){
                    setPrice(sin?.regular_price)
                    //return singleProduct?.regular_price;
                }
                else{
                    let commission = (parseFloat(sin?.seller_price)/100) * parseFloat(sin?.commission)
                    let amount = (parseFloat(sin?.seller_price) + parseFloat(commission));
                    setPrice(amount)
                }
                return false;
            }
        })

        // reactotron.log({ attr })

        setAttributes([...attr])
    }


    const renderInStock = () => {
        if(singleProduct?.stock){
            if(singleProduct?.variant){
                if(parseFloat(selectedVariant?.stock_value) > 0){
                    return(
                        <View
                            style={{ position: 'absolute', left: 20, top: 15, backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 8 }}
                        >
                            <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'In Stock'}</Text>
                        </View>
                    )
                }
            }
            else{
                if(parseFloat(singleProduct?.stock_value) > 0){
                    return(
                        <View
                            style={{ position: 'absolute', left: 20, top: 15, backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 8 }}
                        >
                            <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'In Stock'}</Text>
                        </View>
                    )
                }
            }
        }
        else{
            return(
                <View
                    style={{ position: 'absolute', left: 20, top: 15, backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 8 }}
                >
                    <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'In Stock'}</Text>
                </View>
            )
        }
    }



    return (
        <>
            <HeaderWithTitle title={item?.name} />
            <ScrollView style={{ flex: 1, backgroundColor: contextPanda?.active === "green" ? '#F4FFE9' : contextPanda?.active === "fashion" ? '#FFF5F7' : '#fff', }} showsVerticalScrollIndicator={false}>

                <View style={{ height: 200 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, width: width, }}>

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
                    {renderInStock()}

                    

                </View>
                {singleProduct?.image?.length > 1 && <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {singleProduct?.image?.map((item, index) =>
                        <ImageVideoBox
                            key={index}
                            setSelectedImage={setSelectedImage}
                            selectedImage={selectedImage}
                            item={item}
                            index={index}
                        />
                    )}
                </ScrollView>}

                <ItemDetails
                    // onPress={gotoHotel}
                    itemName={singleProduct?.name}
                    hotelName={singleProduct?.store?.name}
                    views={singleProduct?.viewCount ? singleProduct?.viewCount : 0}
                    sold={singleProduct?.order_count}
                    minQty={singleProduct?.minimum_qty}
                    price={price}
                />  
               {singleProduct?.weight !== ('' || null)  && 
                <View style={{paddingLeft:10,display:'flex',flexDirection:'row',alignItems:'center',gap:2}}>
                    <Text style={{
                        fontFamily: 'Poppins',
                        letterSpacing:1,
                        fontSize:  10,
                    
                    }}>weight :</Text>
                    <Text style={{
                        fontFamily: 'Poppins',
                        letterSpacing:1,
                        fontSize:  10,
                    
                    }}>{singleProduct?.weight}</Text>

                </View>}
                <View style={{ paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap' }}>
                        {(attributes?.map((attr, index) =>
                            <CommonSelectDropdown
                                key={index}
                                placeholder={attr?.name}
                                data={attr.options}
                                value={attr.selected ? attr.selected : ''}
                                setValue={selectAttributes}
                                height={35}
                                width={'48%'}
                            />
                        ))}
                    </View>

                    {/* {contextPanda?.active === "panda" && <CommonSelectDropdown
                        mb={20}
                        placeholder='Portion Size'
                        data={data}
                        value={value}
                        setValue={setValue}
                    />} */}
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
