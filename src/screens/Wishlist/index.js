import { StyleSheet, Text, View, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
import HeaderWithTitle from '../../Components/HeaderWithTitle'
import CommonItemMenuList from '../../Components/CommonItemMenuList'
import CommonItemCard from '../../Components/CommonItemCard'
import LoaderContext from '../../contexts/Loader'
import reactotron from '../../ReactotronConfig'
import customAxios from '../../CustomeAxios'
import PandaContext from '../../contexts/Panda'
import Toast from 'react-native-toast-message';

const Wishlist = ({navigation}) => {

    const loadingContex = useContext(LoaderContext)
    let loadingg = loadingContex?.loading

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const { width } = useWindowDimensions()

  
    const [wishlist, setWishlist] = useState([])

    reactotron.log({wishlist})


    useEffect(() => {
        getWishlist()
    }, [])

    const getWishlist = async() => {
        loadingContex.setLoading(true)
        let data = {
            type:'fashion'
        }
        await customAxios.post(`customer/wishlist/list`, data)
      
        .then(async response => {
            setWishlist(response?.data?.data?.product_details)
            loadingContex.setLoading(false)
        })
        .catch(async error => {
            Toast.show({
                type: 'error',
                text1: error
            });
            loadingContex.setLoading(false)
        })
    }


    return (
        <>
            <HeaderWithTitle title={'Wishlist'}  />
            <ScrollView
                style={{ flex: 1,  backgroundColor:  active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff' , paddingTop:10}}
            >
                <View style={styles.container}>
                    {loadingg ? <ActivityIndicator style={{width:width}}/> : wishlist?.map((item) => (
                        <CommonItemCard
                            item={item}
                            key={item?._id}
                            width={width/2.2}
                            height={250}
                            wishlistIcon

                        />
                    ))}
                </View>
            </ScrollView>
        </>


    )
}

export default Wishlist

const styles = StyleSheet.create({
    container : {
        flexDirection:'row', 
        flexWrap:'wrap', 
        gap:10, 
        paddingHorizontal:'3%',
    }
})