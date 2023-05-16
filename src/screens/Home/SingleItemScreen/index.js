import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity, Moda, RefreshControl, Modal } from 'react-native'
import React, { useState, useEffect, useContext, useCallback, useRef } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import CommonTexts from '../../../Components/CommonTexts'
import ItemDetails from './ItemDetails'
import CustomButton from '../../../Components/CustomButton'
import OrderWhatsapp from './OrderWhatsapp'
import VideoPlayer from 'react-native-video-player'
import FastImage from 'react-native-fast-image'
import { Animated } from 'react-native'
import ScheduleDeliveryModal from './ScheduleDeliveryModal'
import CommonSelectDropdown from '../../../Components/CommonSelectDropdown'
import PandaContext from '../../../contexts/Panda'
import CommonItemCard from '../../../Components/CommonItemCard'
import ImageVideoBox from './ImageVideoBox'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CommonRating from '../../../Components/CommonRating'
import customAxios from '../../../CustomeAxios'
import { IMG_URL, mode } from '../../../config/constants'
import AuthContext from '../../../contexts/Auth'
import CartContext from '../../../contexts/Cart'
import LoaderContext from '../../../contexts/Loader'
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message';
import reactotron from 'reactotron-react-native'
import Carousel from 'react-native-reanimated-carousel';
import ImageViewer from 'react-native-image-zoom-viewer';



let link = '../../../Videos/farming.mp4'


const SingleItemScreen = ({ route, navigation }) => {
    const refRBSheet = useRef();
    const contextPanda = useContext(PandaContext)
    const cartContext = useContext(CartContext)
    const [showSingleImg, setShowSingleImg] = useState(false)
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

        cartContext.addToCart(item, selectedVariant)
        
       
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
                if (att?.variant) {
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
        if (item?.stock) {
            if (item?.variant) {
                if (parseFloat(item?.stock_value) > 0) {
                    return (
                        <View
                            style={{ position: 'absolute', left: 20, top: 15, backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 8 }}
                        >
                            <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'In Stock'}</Text>
                        </View>
                    )
                }
            }
            else {
                if (parseFloat(singleProduct?.stock_value) > 0) {
                    return (
                        <View
                            style={{ position: 'absolute', left: 20, top: 15, backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 8 }}
                        >
                            <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'In Stock'}</Text>
                        </View>
                    )
                }
            }
        }
        else {
            return (
                <View
                    style={{ position: 'absolute', left: 20, top: 15, backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', borderRadius: 8 }}
                >
                    <Text style={{ fontFamily: 'Poppins-Regular', color: '#fff', fontSize: 12, padding: 5 }}>{'In Stock'}</Text>
                </View>
            )
        }
    }
 
    const openSingleImg = useCallback(() => {
        setShowSingleImg(true)
    },[])

    const closeSingleImg = useCallback(() => {
        setShowSingleImg(false)
    },[])

    let image = [item?.product_image, ...item?.image];

    let imageArray = image?.filter((data, index)=> index !== selectedImage)
    imageArray?.unshift(item?.image[selectedImage])

    let imagesss = imageArray?.map((items, index) => {
        return {url : `${IMG_URL}${items}`}
    })


    const PreOrderMOdal = useCallback(() => {
        refRBSheet.current.open()
    }, [])


    return (
        <>
            <HeaderWithTitle title={item?.name} />
            <ScrollView
                style={{ flex: 1, backgroundColor: contextPanda?.active === "green" ? '#F4FFE9' : contextPanda?.active === "fashion" ? '#FFF5F7' : '#fff', }}
                showsVerticalScrollIndicator={false}
            >

                <View style={{ height: 200 }}>
                    <TouchableOpacity 
                        onPress={openSingleImg}
                        style={{ alignItems: 'center', justifyContent: 'center', padding: 10, width: width, }}
                    >

                        {images && images?.length > 0 ?
                        <Carousel
                        // autoPlay={true}
                        width={width}
                        data={images}
                        renderItem={({ index }) => (
                            <FastImage
                                // source={singleProduct?.image[selectedImage]?.name} 
                                source={{ uri: `${IMG_URL}${images[selectedImage]}` }}
                                style={{ width: width - 30, height: 180, borderRadius: 15, }}
                                resizeMode='contain'
                            >
                            </FastImage> 
                            )}
                            onSnapToItem={(index) => setSelectedImage(index)}
                            scrollAnimationDuration={10}
                        />: <FastImage
                                // source={singleProduct?.image[selectedImage]?.name} 
                                source={{ uri: `${IMG_URL}${images[0]}` }}
                                style={{ width: width - 30, height: 180, borderRadius: 15, }}
                                resizeMode='contain'
                            >
                            </FastImage>
                        }


                    </TouchableOpacity>
                    {renderInStock()} 
                    {/* <VideoPlayer
                        video={ require('../../../Videos/farming.mp4') }
                        videoWidth={1600}
                        videoHeight={900}
                        // thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
                    /> */}



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
                    price={item?.variant ? selectedVariant?.price : item?.price}
                    available={item?.available}
                />
                {item?.weight !== ('' || null) &&
                    <View style={{ paddingLeft: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                        <Text style={{
                            fontFamily: 'Poppins',
                            letterSpacing: 1,
                            fontSize: 10,

                        }}>weight :</Text>
                        <Text style={{
                            fontFamily: 'Poppins',
                            letterSpacing: 1,
                            fontSize: 10,

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

                <View style={{ flexDirection: 'row', width: width, justifyContent: contextPanda?.active === "panda" ? 'space-between' : 'center', marginTop: 10, paddingHorizontal: 10, gap: 5 }}>
                    {contextPanda?.active === "panda" && <CustomButton
                        label={'Pre-Order'} bg='#D3D358' width={width / 2.2} onPress={showModals}
                    />}
                    {item?.available && <CustomButton
                        onPress={addToCart}
                        label={'Add to Cart'} bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'} width={width / 2.2}
                        loading={loader}
                    />}



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

                <Modal
                    // animationType="slide"
                    transparent={true}
                    visible={showSingleImg}
                >
                    <View
                        style={{  alignSelf: 'center', marginTop: 90, shadowOpacity: 0.1, shadowOffset: { x: 5, y: 5 }, paddingHorizontal: 20, paddingVertical: 10, elevation: 5, }}
                    >
                        {imagesss && <Modal visible={showSingleImg} >
                            <View style={{ flex: 1 }}>
                                <ImageViewer
                                    imageUrls={imagesss}
                                    renderHeader={() => 
                                        <TouchableOpacity 
                                            onPress={closeSingleImg} 
                                            style={{alignSelf:'flex-end', position:'absolute', zIndex:100, top:40, right:20}}
                                        >
                                            <AntDesign name='close' color='#fff' size={25} alignSelf={'flex-end'} /> 
                                        </TouchableOpacity>
                                    }
                                />
                            </View>

                        </Modal>}
                        {images &&
                      
                        <FastImage
                            source={{ uri: `${IMG_URL}${images[selectedImage]}` }}
                            style={{ width: width-15, height: 400, borderRadius:10, padding:10 }}
                            resizeMode='cover'
                        >
                            <TouchableOpacity onPress={closeSingleImg} style={{alignSelf:'flex-end', backgroundColor:'#000', borderRadius:10, width:20, height:20, alignItems:'center', justifyContent:'center'}}>
                                <AntDesign name='close' color='#fff' size={15} marginLeft={1} />
                            </TouchableOpacity>
                        </FastImage>
                        }
                    </View>
                </Modal>


            </ScrollView>
        </>
    )
}

export default SingleItemScreen

const styles = StyleSheet.create({})
