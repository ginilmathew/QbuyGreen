import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity, Moda,RefreshControl } from 'react-native'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import ItemDetails from './ItemDetails'
import CustomButton from '../../../Components/CustomButton'
import OrderWhatsapp from './OrderWhatsapp'
import FastImage from 'react-native-fast-image'
import { Animated } from 'react-native'
import ScheduleDeliveryModal from './ScheduleDeliveryModal'
import CommonSelectDropdown from '../../../Components/CommonSelectDropdown'
import PandaContext from '../../../contexts/Panda'
import ImageVideoBox from './ImageVideoBox'
import customAxios from '../../../CustomeAxios'
import { IMG_URL, mode } from '../../../config/constants'
import AuthContext from '../../../contexts/Auth'
import CartContext from '../../../contexts/Cart'
import LoaderContext from '../../../contexts/Loader'
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message';
import reactotron from 'reactotron-react-native'



const SingleItemScreen = ({ route, navigation }) => {


    const contextPanda = useContext(PandaContext)
    const cartContext = useContext(CartContext)
    let active = contextPanda.active

    const item = route?.params?.item

    const [images, setImages] = useState( item?.image ? [item?.product_image, ...item?.image] : [item?.product_image])

    const loadingg = useContext(LoaderContext)

    const [attributes, setAttributes] = useState([])
    const [price, setPrice] = useState('')
    const [selectedVariant, setSelectedVariant] = useState(null)

    const position = new Animated.ValueXY({x:0,y:0})


    let loader = loadingg?.loading

    const user = useContext(AuthContext)
    const cart = useContext(CartContext)

    let userData = user?.userData
    

    reactotron.log({item})

    useEffect(() => {
        if(item){
            if(item?.variant){
                let selectedVariant = item?.variants?.find(vari => vari?.available === true)
                setSelectedVariant(selectedVariant)

                let names = selectedVariant?.title.split(" ")
                let attributes = item?.attributes?.map(att => {
                    let selected;
                    att?.options?.map(opt => {
                        let values = opt.split(" ");
                        if(values && names){
                            const containsAll = values?.every(elem => names.includes(elem));
                            if(containsAll){
                                selected = opt
                            }
                        }
                        
                    })
                    return {
                        ...att,
                        selected
                    }
                })

                setAttributes(attributes)
            }
        }
    }, [item])
    

    const [singleProduct, setSingleProduct] = useState([])
    const [selectedImage, setSelectedImage] = useState(0)
    const [showModal, setShowModal] = useState(false);
    const [date, setDate] = useState(new Date())

    const [value, setValue] = useState(null);

    const [valueColor, setValueColor] = useState(null);
    const [valueSize, setValueSize] = useState(null);


    const { width, height } = useWindowDimensions()


    // useEffect(() => {
    //     item?.image?.splice(0, 0, item?.product_image)
    // }, [item?.product_image, item?.image])
    
    


    useEffect(() => {
        //getSingleProduct()
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

  
 
    const gotoStore = useCallback(() => {
        navigation.navigate('store', {name : item?.store?.name, mode : 'singleItem', storeId: item?.store?._id })
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
        
        
        let cartItems, url;
        let productDetails;
        let minimumQty = item?.minQty ? item?.minQty : 1

        if(cart?.cart){
            reactotron.log({cart: cart?.cart})
            url = "customer/cart/update";
            let cartProducts = cart?.cart?.product_details;
            let existing = cart?.cart?.product_details?.find(prod => prod.product_id === item?._id && prod?.variants?.[0]?.variant_id === selectedVariant?.id)
            if(existing){
                existing.quantity = existing.quantity + 1;
                cartItems = {
                    cart_id: cart?.cart?._id,
                    product_details: cartProducts,
                    user_id: userData?._id
                }
            }
            else{
                productDetails = {
                    product_id: item?._id,
                    name: item?.name,
                    image: item?.product_image,
                    type: item?.variant ? 'variant' : 'single',
                    variants: [
                        {
                            variant_id: selectedVariant?.id,
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
        else{
            reactotron.log("in")
            url = "customer/cart/add";
            productDetails = {
                product_id: item?._id,
                name: item?.name,
                image: item?.product_image,
                type: item?.variant ? 'variant' : 'single',
                variants: [
                    {
                        variant_id: selectedVariant?.id,
                        attributs: selectedVariant?.attributs
                    }
                ],
                quantity: minimumQty
            };
            //reactotron.log({productDetails})
            cartItems = {
                product_details: [productDetails],
                user_id: userData?._id
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


        // //return false

        // if (cart?.cart) {

        //     //Check products have no stock
        //     if (item?.stock) {
        //         if (parseFloat(item?.stockValue) === 0) {
        //             Toast.show({
        //                 type: 'error',
        //                 text1: "Required Stock not available"
        //             });
        //             return false;
        //         }
        //     }
        //     url = "customer/cart/update";
        //     let existing = cart?.cart?.product_details?.findIndex(prod => prod.product_id === item?._id && prod?.variants?.[0]?.variant_id === item?._id)

        //     if (existing >= 0) {
        //         let cartProducts = cart?.cart?.product_details;
        //         let quantity = cartProducts[existing].quantity + 1;
        //         if(singleProduct?.stock){
        //             if(parseFloat(selectedVariant?.stock_value) >= quantity){
        //                 cartProducts[existing].quantity = cartProducts[existing].quantity + 1;
        //                 cartItems = {
        //                     cart_id: cart?.cart?._id,
        //                     product_details: cartProducts,
        //                     user_id: userData?._id
        //                 }
        //             }
        //             else{
        //                 Toast.show({
        //                     type: 'info',
        //                     text1: 'Required quantity not available'
        //                 })
        //                 return false;
        //             }
        //         }
        //         else{
        //             cartProducts[existing].quantity = cartProducts[existing].quantity + 1;
        //             cartItems = {
        //                 cart_id: cart?.cart?._id,
        //                 product_details: cartProducts,
        //                 user_id: userData?._id
        //             }
        //         }

        //     }
        //     else {
        //         if(item?.stock){
        //             if(parseFloat(item?.stockValue) >= minimumQty){
        //                 productDetails = {
        //                     product_id: item?._id,
        //                     name: item?.name,
        //                     image: item?.product_image,
        //                     type: 'variant',
        //                     variants: [
        //                         {
        //                             variant_id: item?._id,
        //                             attributs: item?.attributes
        //                         }
        //                     ],
        //                     quantity: minimumQty
        //                 };
        //                 cartItems = {
        //                     cart_id: cart?.cart?._id,
        //                     product_details: [...cart?.cart?.product_details, productDetails],
        //                     user_id: userData?._id
        //                 }
        //             }
        //             else{
        //                 Toast.show({
        //                     type: 'info',
        //                     text1: 'Required quantity not available'
        //                 })
        //                 return false;
        //             }
        //         }
        //         else{
        //             productDetails = {
        //                 product_id: item?._id,
        //                 name: item?.name,
        //                 image: item?.product_image,
        //                 type: 'variant',
        //                 variants: [
        //                     {
        //                         variant_id: item?._id,
        //                         attributs: item?.attributs
        //                     }
        //                 ],
        //                 quantity: minimumQty
        //             };
        //             cartItems = {
        //                 cart_id: cart?.cart?._id,
        //                 product_details: [...cart?.cart?.product_details, productDetails],
        //                 user_id: userData?._id
        //             }
        //         }
                

        //     }
        // }
        // else if (cart?.cart) {
        //     if (item?.stock) {
        //         if (parseFloat(item?.stockValue) === 0) {
        //             Toast.show({
        //                 type: 'info',
        //                 text1: "Required quantity not available"
        //             });
        //             return false;
        //         }
        //     }
            
        //     let existing = cart?.cart?.product_details?.findIndex(prod => prod.product_id === item?._id)
        //     if (existing >= 0) {
        //         url = "customer/cart/update";
        //         let cartProducts = cart?.cart?.product_details;
        //         let quantity = cartProducts[existing].quantity + 1;
        //         if(item?.stock){
        //             if(item?.stockValue >= quantity){
        //                 cartProducts[existing].quantity = cartProducts[existing].quantity + 1;
    
        //                 cartItems = {
        //                     cart_id: cart?.cart?._id,
        //                     product_details: cartProducts,
        //                     user_id: userData?._id
        //                 }
        //             }
        //             else{
        //                 Toast.show({
        //                     type: 'info',
        //                     text1: "Required quantity not available"
        //                 });
        //                 return false;
        //             }
        //         }
        //         else{
        //             cartProducts[existing].quantity = cartProducts[existing].quantity + 1;
    
        //             cartItems = {
        //                 cart_id: cart?.cart?._id,
        //                 product_details: cartProducts,
        //                 user_id: userData?._id
        //             }
        //         }
        //     }
        //     else {
        //         url = "customer/cart/add";
        //         if(item?.stock){
        //             if(parseFloat(item?.stockValue) >= minimumQty){
        //                 productDetails = {
        //                     product_id: item?._id,
        //                     name: item?.name,
        //                     image: item?.product_image,
        //                     type: 'single',
        //                     variants: null,
        //                     quantity: minimumQty
        //                 };
        //                 cartItems = {
        //                     cart_id: cart?.cart?._id,
        //                     product_details: [...cart?.cart?.product_details, productDetails],
        //                     user_id: userData?._id
        //                 }
        //             }
        //             else{
        //                 Toast.show({
        //                     type: 'info',
        //                     text1: "Required quantity not available"
        //                 });
        //                 return false;
        //             }
        //         }
        //         else{
        //             if(item?.stock){
        //                 if(parseFloat(item?.stockValue) >= minimumQty){
        //                     productDetails = {
        //                         product_id: item?._id,
        //                         name: item?.name,
        //                         image: item?.product_image,
        //                         type: 'single',
        //                         variants: null,
        //                         quantity: minimumQty
        //                     };
        //                     cartItems = {
        //                         cart_id: cart?.cart?._id,
        //                         product_details: [...cart?.cart?.product_details, productDetails],
        //                         user_id: userData?._id
        //                     }
        //                 }
        //                 else{
        //                     Toast.show({
        //                         type: 'info',
        //                         text1: "Required quantity not available"
        //                     });
        //                     return false;
        //                 }
        //             }
        //             else{
        //                 productDetails = {
        //                     product_id: item?._id,
        //                     name: item?.name,
        //                     image: item?.product_image,
        //                     type: 'single',
        //                     variants: null,
        //                     quantity: minimumQty
        //                 };
        //                 cartItems = {
        //                     cart_id: cart?.cart?._id,
        //                     product_details: [...cart?.cart?.product_details, productDetails],
        //                     user_id: userData?._id
        //                 }
        //             }
                    
        //         }
                

                
        //     }
        // }
        // else {
        //     url = "customer/cart/add";
        //     if (singleProduct?.variants?.length > 0) {
        //         if(singleProduct?.stock){
        //             if (parseFloat(selectedVariant?.stock_value) === 0) {
        //                 Toast.show({
        //                     type: 'info',
        //                     text1: "Required quantity not available"
        //                 });
        //                 return false;
        //             }
        //             else if(parseFloat(selectedVariant?.stock_value) >= minimumQty){
        //                 productDetails = {
        //                     product_id: singleProduct?._id,
        //                     name: singleProduct?.name,
        //                     image: singleProduct?.product_image,
        //                     type: 'variant',
        //                     variants: [
        //                         {
        //                             variant_id: selectedVariant?._id,
        //                             attributs: selectedVariant?.attributs
        //                         }
        //                     ],
        //                     quantity: minimumQty
        //                 };
        //                 cartItems = {
        //                     cart_id: cart?.cart?._id,
        //                     product_details: cart?.cart?.product_details ?  [...cart?.cart?.product_details, productDetails] : [productDetails],
        //                     user_id: userData?._id
        //                 }
        //             }
        //             else{
        //                 Toast.show({
        //                     type: 'info',
        //                     text1: 'Required quantity not available'
        //                 })
        //                 return false;
        //             }
        //         }
        //         else{
        //             productDetails = {
        //                 product_id: singleProduct?._id,
        //                 name: singleProduct?.name,
        //                 image: singleProduct?.product_image,
        //                 type: 'variant',
        //                 variants: [
        //                     {
        //                         variant_id: selectedVariant?._id,
        //                         attributs: selectedVariant?.attributs
        //                     }
        //                 ],
        //                 quantity: minimumQty
        //             };
        //             cartItems = {
        //                 cart_id: cart?.cart?._id,
        //                 product_details: cart?.cart?.product_details ?  [...cart?.cart?.product_details, productDetails] : [productDetails],
        //                 user_id: userData?._id
        //             }
        //         }
        //     }
        //     else if (singleProduct?.stock) {
        //         if (parseFloat(singleProduct?.stock_value) === 0) {
        //             Toast.show({
        //                 type: 'info',
        //                 text1: "Required quantity not available"
        //             });
        //             return false;
        //         }
        //         else if(parseFloat(singleProduct?.stock_value) >= minimumQty){
        //             productDetails = {
        //                 product_id: singleProduct?._id,
        //                 name: singleProduct?.name,
        //                 image: singleProduct?.product_image,
        //                 type: 'single',
        //                 variants: null,
        //                 quantity: minimumQty
        //             };
        //             cartItems = {
        //                 cart_id: cart?.cart?._id,
        //                 product_details: cart?.cart?.product_details ?  [...cart?.cart?.product_details, productDetails] : [productDetails],
        //                 user_id: userData?._id
        //             }
        //         }
        //         else{
        //             Toast.show({
        //                 type: 'info',
        //                 text1: "Required quantity not available"
        //             });
        //             return false;
        //         }
        //     }
        //     else{
        //         productDetails = {
        //             product_id: singleProduct?._id,
        //             name: singleProduct?.name,
        //             image: singleProduct?.product_image,
        //             type: 'single',
        //             variants: null,
        //             quantity: minimumQty
        //         };
        //         cartItems = {
        //             cart_id: cart?.cart?._id,
        //             product_details: cart?.cart?.product_details ?  [...cart?.cart?.product_details, productDetails] : [productDetails],
        //             user_id: userData?._id
        //         }
        //     }

        // }

        // loadingg.setLoading(true)
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
        //         Toast.show({
        //             type: 'error',
        //             text1: error
        //         });
        //         loadingg.setLoading(false)
        //     })

    }, [selectedVariant, cart?.cart])


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
                        let comm = singleProduct?.variants?.[0]?.commission ? singleProduct?.variants?.[0]?.commission : 0
                        let commission = (parseFloat(singleProduct?.variants?.[0]?.seller_price) / 100) * parseFloat(comm)
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
                    let comm = singleProduct?.variants?.[0]?.commission ? singleProduct?.variants?.[0]?.commission : 0
                    let commission = (parseFloat(singleProduct?.variants?.[0]?.seller_price) / 100) * parseFloat(comm)
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
                        let comm = singleProduct?.commission ? singleProduct?.commission : 0
                        let commission = (parseFloat(singleProduct?.seller_price) / 100) * parseFloat(comm)
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
                    let comm = singleProduct?.commission ? singleProduct?.commission : 0
                    let commission = (parseFloat(singleProduct?.seller_price) / 100) * parseFloat(comm)
                    let price = parseFloat(singleProduct?.seller_price) + commission
                    setPrice(price)
                }
            }
        }
    }, [])


    const selectAttributes = (value) => {
        let attri = [];


        let attr = attributes?.map(att => {
            if (att?.options.includes(value)) {
                if(att?.variant){
                    let values = value.split(' ')
                    values.map(va => {
                        attri.push(va)
                    })
                }
               
                return {
                    ...att,
                    selected: value
                }
            }
            else {
                if(att?.variant){
                    let values = att.selected.split(' ')
                    values.map(va => {
                        attri.push(va)
                    })
                }
                return att
            }
        })


        item?.variants?.map(sin => {
            let attributes = []
            sin?.attributs?.map(att => {
                attributes.push(att)
            })
            const containsAll = attri.every(elem => attributes.includes(elem));

            if (containsAll) {
                
                setSelectedVariant(sin)
                setPrice(sin?.price)
                return false;
            }
        })


        setAttributes([...attr])
    }


    const renderInStock = () => {
        if(item?.stock){
            if(item?.available){
                return(
                <View
                    style={{ position: 'absolute', left: 20, top: 15, backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 8 }}
                >
                    <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'In Stock'}</Text>
                </View>)
            }
        }
        else{
            return(
                <View
                    style={{ position: 'absolute', left: 20, top: 15, backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 8 }}
                >
                    <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'In Stock'}</Text>
                </View>)
        }
    }



    return (
        <>
            <HeaderWithTitle title={item?.name} />
            <ScrollView 
                style={{ flex: 1, backgroundColor: contextPanda?.active === "green" ? '#F4FFE9' : contextPanda?.active === "fashion" ? '#FFF5F7' : '#fff', }} 
                showsVerticalScrollIndicator={false} 
            >

                <View style={{ height: 200 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10, width: width, }}>

                        {images && images?.length > 0 ?
                            <FastImage
                                // source={singleProduct?.image[selectedImage]?.name} 
                                source={{ uri: `${IMG_URL}${images[selectedImage]}` }}
                                style={{ width: width - 30, height: 180, borderRadius: 15, }}
                                resizeMode='contain'
                            >
                            </FastImage> : <FastImage
                                // source={singleProduct?.image[selectedImage]?.name} 
                                source={{ uri: `${IMG_URL}${images[0]}` }}
                                style={{ width: width - 30, height: 180, borderRadius: 15, }}
                                resizeMode='contain'
                            >
                            </FastImage>
                        }


                    </View>
                    {renderInStock()}

                    

                </View>
                {images.length > 0 && <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {images?.map((item, index) =>
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
                    onPress={gotoStore}
                    itemName={item?.name}
                    hotelName={item?.store?.name}
                    views={item?.viewCount ? item?.viewCount : 0}
                    sold={item?.order_count}
                    minQty={item?.minQty}
                    price={ item?.variant ? selectedVariant?.price :  item?.price}
                    available={item?.available}
                />  
               {item?.weight   && 
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
                    
                    }}>{item?.weight}</Text>

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
                    {item?.available ? <CustomButton
                        onPress={addToCart}
                        label={'Add to Cart'} bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} width={width / 2.2}
                        loading={loader}
                    /> : <Text style={{
                        fontFamily: 'Poppins',
                        letterSpacing:1,
                        fontSize:  10,
                        color: 'red',
                        fontWeight: 'bold'
                    }}>Out of stock</Text>}

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

{/* 
               <Animated.View style={cartContext?.animation.getLayout()}>
                    <Text>cary</Text>
                </Animated.View>  */}


            </ScrollView>
        </>
    )
}

export default SingleItemScreen

const styles = StyleSheet.create({})
