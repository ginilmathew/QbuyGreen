import { StyleSheet, Text, View, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
import HeaderWithTitle from '../../Components/HeaderWithTitle'
import CommonItemMenuList from '../../Components/CommonItemMenuList'
import CommonItemCard from '../../Components/CommonItemCard'
import LoaderContext from '../../contexts/Loader'
import reactotron from '../../ReactotronConfig'
import customAxios from '../../CustomeAxios'

const Wishlist = ({navigation}) => {

    const loadingContex = useContext(LoaderContext)
    let loadingg = loadingContex?.loading


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
            // toast.show({
            //     title: 'Error',
            //     description : error,
            //     backgroundColor:'red.500'
            // })
            loadingContex.setLoading(false)
        })
    }

    let wishlistss = [
        {
            _id: '1',
            name: 'Shirt',
            rate: 250,
            hotel : 'Raymond Store',
            wish : true,
            image : require('../../Images/shirt.jpg')
        },
        {
            _id: '2',
            name: 'Saree',
            rate: 90,
            hotel : 'Pattom Silks',
            wish : false,
            image : require('../../Images/saree.jpg')
        },
        {
            _id: '3',
            name: 'Jeans',
            rate: 150,
            hotel : 'CJ Designers',
            wish : false,
            image : require('../../Images/jeans.jpg')
        },
        {
            _id: '4',
            name: 'Shoes',
            rate: 180,
            hotel : 'Raymond Store',
            wish : true,
            image : require('../../Images/shoes.jpg')
        },
    ]


    return (
        <>
            <HeaderWithTitle title={'Wishlist'}  />
            <ScrollView
                style={{ flex: 1, backgroundColor: '#FFF5F7' , paddingTop:10}}
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