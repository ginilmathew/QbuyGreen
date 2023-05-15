import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, useWindowDimensions, ScrollView } from 'react-native'
import React, { useRef, useState, useEffect, useContext, startTransition, useCallback, memo, useMemo } from 'react'
import FastImage from 'react-native-fast-image'
import CommonAddButton from './CommonAddButton'
import RBSheet from "react-native-raw-bottom-sheet";
import CommonTexts from './CommonTexts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Toast from 'react-native-toast-message'
import Fontisto from 'react-native-vector-icons/Fontisto'
import FoodSuggestionCard from './FoodSuggestionCard'
import { BlurView } from "@react-native-community/blur";
import { useNavigation } from '@react-navigation/native'
import ItemAddedFromSuggtnCard from './ItemAddedFromSuggtnCard'
import PandaContext from '../contexts/Panda'
import CommonRating from './CommonRating';
import reactotron from '../ReactotronConfig';
import { IMG_URL } from '../config/constants';
import moment from 'moment';
import { min, max } from 'lodash'
import customAxios from '../CustomeAxios';
import CartContext from '../contexts/Cart';
import AuthContext from '../contexts/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderContext from '../contexts/Loader';
import LinearGradient from 'react-native-linear-gradient';
import { has } from 'lodash'
import { getProduct } from '../helper/productHelper';

const CommonItemCard = memo(({ height, width, item, marginHorizontal, wishlistIcon, addToCart, mr, ml, mb }) => {

    const [data, setData] = useState([])

    useEffect(() => {
        if (item) {
            setData(getProduct(item))
        }
    }, [item])



    reactotron.log({ data })

    const contextPanda = useContext(PandaContext)
    const cartContext = useContext(CartContext)
    const userContext = useContext(AuthContext)
    let active = contextPanda.active

    const loadingg = useContext(LoaderContext)


    const refRBSheet = useRef();
    const navigation = useNavigation()
    const [total, setTotal] = useState('')
    const [heart, setHeart] = useState(wishlistIcon ? wishlistIcon : item?.is_wishlist)



    const handleClick = useCallback(() => {

        startTransition(() => {
            // if(item?.stock === true){
            //     navigation.navigate('SingleItemScreen', { item: item })
            // }else{
            //     Toast.show({
            //         type: 'error',
            //         text1: 'Item is out of stock'
            //     })
            // }
            navigation.navigate('SingleItemScreen', { item: data })
        })
        })

    const openBottomSheet = () => {
        addToCart(item)
        //refRBSheet.current.open()
        //navigation.navigate('SingleItemScreen', { item: item })
    }



    const closeRbSheet = useCallback(() => {
        refRBSheet.current.close()
    }, [])




    const RemoveAction = useCallback(async () => {

        let datas = {
            type: active,
            product_id: item?._id
        }

        await customAxios.post(`customer/wishlist/delete`, datas)
            .then(async response => {
                setHeart(!heart)
                // if(has(response?.data, 'data')){

                // }
                // else if(has(response?.data, 'message')){
                //     Toast.show({
                //         type: 'info',
                //         text1: response?.data?.message
                //     })
                // }
                // reactotron.log({response})
                // setAvailabelPdts(response?.data?.data)
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
            })

    }, [heart])

    const AddAction = useCallback(async () => {
        //setHeart(!heart)

        let datas = {
            type: active,
            product_id: item?._id
        }

        await customAxios.post(`customer/wishlist/create`, datas)
            .then(async response => {
                setHeart(!heart)
                // if(has(response?.data, 'data')){
                //     setHeart(!heart)
                // }
                // else if(has(response?.data, 'message')){
                //     Toast.show({
                //         type: 'info',
                //         text1: response?.data?.message
                //     })
                // }
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
            })

    }, [heart])


    return (
        <>
            <TouchableOpacity
                onPress={handleClick}
                style={{ marginHorizontal: marginHorizontal, marginRight: mr, marginLeft: ml, marginBottom: mb }}
            >
                <FastImage
                    // source={{ uri: `${IMG_URL}${item?.product_image}` }}
                    source={data?.product_image === null ? require('../Images/jeans.jpg') : { uri: `${IMG_URL}${data?.product_image}` }}
                    style={{ height: height ? height : 110, width: width, justifyContent: 'flex-end', borderRadius: 16 }}
                >
                    <LinearGradient colors={data?.available ? ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)'] : ['rgba(255, 255, 255, 0.2)', 'rgba(0, 0, 0, 0.4)']} style={{ height: '100%', justifyContent: 'flex-end', padding: 10 }}>
                        <Text style={styles.textSemi}>{data?.name}</Text>
                        <Text style={!data?.available ? styles.textSemiError : styles.textSemi}>{data?.available ? `₹ ${data?.price}` : 'Out off stock'}</Text>
                        <Text style={styles.lightText}>{data?.store?.name}</Text>
                    </LinearGradient>

                    {data?.available && <View style={styles.addContainer}>
                        <CommonAddButton
                            onPress={openBottomSheet}
                        />
                    </View>}

                    {/* {!fashion && item?.openCloseTag && <View
                        style={{ position: 'absolute', right: 7, top: 7, backgroundColor: item?.openCloseTag === 'Closes Soon' ? '#FF0000' : '#58D36E', borderRadius: 8 }}
                    >
                        <Text style={styles.tagText}>{item?.openCloseTag}</Text>
                    </View>} */}

                    {active === 'fashion' || active === 'green' && <TouchableOpacity
                        onPress={data?.is_wishlist ? RemoveAction : AddAction}
                        style={styles.hearIcon}
                    >
                        <Fontisto name={"heart"} color={data?.is_wishlist ? "#FF6464" : '#EDEDED'} size={12} />
                    </TouchableOpacity>}

                </FastImage>

            </TouchableOpacity>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={false}
                closeOnPressMask={true}
                height={450}
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent",
                    },
                    draggableIcon: {
                        backgroundColor: "#000"
                    },
                    container: {
                        backgroundColor: 'transparent',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    },
                }}
            >
                <BlurView
                    blurType="light"
                    blurAmount={25}
                    style={{ flex: 1 }}
                >
                    <View style={{ paddingHorizontal: 15, flex: 1 }}>
                        <View style={styles.RBsheetHeader}>
                            <CommonTexts label={active === 'fashion' || active === 'green' ? "Similar Products" : 'More items you may like...'} />
                            <TouchableOpacity
                                onPress={closeRbSheet}
                            >
                                <Ionicons name='close-circle' color='#000' size={25} />
                            </TouchableOpacity>
                        </View>
                        {/* {addedList?.map((item, index) => <ItemAddedFromSuggtnCard item={item} key={index} />)} */}
                        {/* <ScrollView >
                            {suggestions?.map((item) =>
                                <FoodSuggestionCard
                                    onPress={() => setAddedList(oldArray => [...oldArray, item])}
                                    item={item}
                                    key={item?._id}
                                />
                            )}
                        </ScrollView> */}
                    </View>
                </BlurView>
                <View
                    style={{
                        backgroundColor: active === 'fashion' ? '#FF7190' : active === 'green' ? '#8ED053' : '#58D36E',
                        height: 60,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 40,
                        width: '100%',
                    }}
                >

                    <View style={styles.totalCount}>
                        {/* <Text style={styles.bottomCountText}>{addedList.length} item</Text> */}
                        <Text style={styles.bottomRateText}>₹ {total}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.viewCartBox}
                    // onPress={viewCart}
                    >
                        <CommonTexts label={'View Cart'} color='#fff' fontSize={23} />
                    </TouchableOpacity>

                </View>
            </RBSheet>
        </>
    )
})

export default CommonItemCard

const styles = StyleSheet.create({


    bottomCountText: {
        fontFamily: 'Poppins-medium',
        color: '#fff',
        fontSize: 11,
    },
    bottomRateText: {
        fontFamily: 'Poppins-ExtraBold',
        color: '#fff',
        fontSize: 18,
    },
    textSemi: {
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        fontSize: 10,
        paddingBottom: 2
    },
    textSemiError: {
        fontFamily: 'Poppins-SemiBold',
        color: 'red',
        fontSize: 10,
        paddingBottom: 2
    },
    lightText: {
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        fontSize: 7,
        marginBottom: 3
    },
    addContainer: {
        position: 'absolute',
        right: 5,
        bottom: 10
    },
    tagText: {
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        fontSize: 12,
        padding: 5
    },
    hearIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'

    },
    RBsheetHeader: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 10
    },
    totalCount: {
        borderRightWidth: 3,
        borderColor: '#fff',
        flex: 0.4
    },
    outofstock: {
        borderRightWidth: 3,
        borderColor: '#fff',
        flex: 0.4
    },
    viewCartBox: {
        alignItems: 'flex-end',
        flex: 0.5
    }
})