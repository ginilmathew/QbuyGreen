import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, useWindowDimensions, ScrollView } from 'react-native'
import React, { useRef, useState, useEffect, useContext, useTransition, useCallback, memo } from 'react'
import FastImage from 'react-native-fast-image'
import CommonAddButton from './CommonAddButton'
import RBSheet from "react-native-raw-bottom-sheet";
import CommonTexts from './CommonTexts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

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

const CommonItemCard = memo(({ height, width, item, marginHorizontal, wishlistIcon }) => {

    reactotron.log({item})

    let rating = 4.1

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active
    


    const refRBSheet = useRef();
    const navigation = useNavigation()
    const [total, setTotal] = useState('')
    const [heart, setHeart] = useState('')

    const handleClick = useCallback(() => {
        navigation.navigate('SingleItemScreen', { item: item })
    }, [])

    const openBottomSheet = useCallback(() => {
        refRBSheet.current.open()
    }, [])

    const closeRbSheet = useCallback(() => {
        refRBSheet.current.close()
    }, [])



    const getPrice = () => {
        if(item?.variants?.length > 0){
            let variants = [];
            item?.variants?.map(vari => {
                if(vari?.offer_price && (moment(vari?.offer_date_from, "YYYY-MM-DD") <= moment()) && (moment(vari?.offer_date_to, "YYYY-MM-DD") >= moment())){
                    variants.push(vari?.offer_price);
                }
                else{
                    if(vari?.regular_price){
                        variants.push(vari?.regular_price);
                    }
                    else{
                        let commission = (parseFloat(vari?.seller_price)/100) * parseFloat(vari?.commission)
                        let price = parseFloat(vari?.seller_price) + commission;
                        variants.push(price)
                    }
                }
            })
            return `₹${min(variants)} - ₹${max(variants)}`
        }
        else{
            if(item?.offer_price){
                if(item?.offer_price && (moment(item?.offer_date_from, "YYYY-MM-DD") <= moment()) && (moment(item?.offer_date_to, "YYYY-MM-DD") >= moment())){
                    return `₹${item?.offer_price}`;
                }
                else{
                    if(vari?.regular_price){
                        variants.push(vari?.regular_price);
                    }
                    else{
                        let commission = (parseFloat(vari?.seller_price)/100) * parseFloat(vari?.commission)
                        let price = parseFloat(vari?.seller_price) + commission;
                        variants.push(price)
                    }
                }
            }
        }
    }

    const RemoveAction = useCallback(async () => {
        setHeart(!heart)
        let datas = {
            type: "fashion",
            product_id: item?._id
        }

        await customAxios.post(`customer/wishlist/delete`, datas)
            .then(async response => {
                // reactotron.log({response})
                // setAvailabelPdts(response?.data?.data)
            })
            .catch(async error => {
                // toast.show({
                //     title: 'Error',
                //     description : error,
                //     backgroundColor:'red.500'
                // })
            })

    })

    const AddAction = useCallback(async () => {
        setHeart(!heart)

        let datas = {
            type: "fashion",
            product_id: item?._id
        }

        await customAxios.post(`customer/wishlist/create`, datas)
            .then(async response => {
                // reactotron.log({response})
            })
            .catch(async error => {
                // toast.show({
                //     title: 'Error',
                //     description : error,
                //     backgroundColor:'red.500'
                // })
            })

    })


    return (
        <>
            <TouchableOpacity
                onPress={handleClick}
                style={{ marginHorizontal: marginHorizontal }}
            >
                <FastImage
                    // source={{ uri: `${IMG_URL}${item?.product_image}` }}
                    source={item?.product_image === null ? require('../Images/jeans.jpg') : { uri: `${IMG_URL}${item?.product_image}` }}
                    style={{ height: height ? height : 110, width: width, justifyContent: 'flex-end', borderRadius: 13 }}
                >
                    <View style={{ marginLeft: 7, marginBottom:3 }}>
                        <Text style={styles.textSemi}>{item?.name}</Text>
                         <Text style={styles.textSemi}>{getPrice()}</Text>
                        <Text style={styles.lightText}>{item?.store?.name}</Text> 
                        {/* <CommonRating rating={3.5} fontSize={9} alignSelf='flex-start'/> */}
                    </View>

                    <View style={styles.addContainer}>
                        <CommonAddButton
                        // onPress={openBottomSheet}
                        />
                    </View>

                    {/* {!fashion && item?.openCloseTag && <View
                        style={{ position: 'absolute', right: 7, top: 7, backgroundColor: item?.openCloseTag === 'Closes Soon' ? '#FF0000' : '#58D36E', borderRadius: 8 }}
                    >
                        <Text style={styles.tagText}>{item?.openCloseTag}</Text>
                    </View>} */}

                    {active === 'fashion' && <TouchableOpacity
                        onPress={heart ? RemoveAction : AddAction}
                        style={styles.hearIcon}
                    >
                        <Fontisto name={"heart"} color={heart ? "#FF6464" : '#EDEDED'} size={16} marginHorizontal={8} />
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
    },
    lightText: {
        fontFamily: 'Poppins-Light',
        color: '#fff',
        fontSize: 7,
        marginBottom: 3
    },
    addContainer: {
        position: 'absolute',
        right: 5,
        bottom: 5
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
        right: 3,
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
    viewCartBox: {
        alignItems: 'flex-end',
        flex: 0.5
    }
})