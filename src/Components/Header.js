import { StyleSheet, View, SafeAreaView, StatusBar, Image, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontisto from 'react-native-vector-icons/Fontisto'

import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native'
import PandaContext from '../contexts/Panda'
import reactotron from '../ReactotronConfig'
import CartContext from '../contexts/Cart'
import AuthContext from '../contexts/Auth'

const Header = ({  onPress, openAddress, goCart}) => {
    const contextPanda = useContext(PandaContext)
    const cartContext = useContext(CartContext)
    const userContext = useContext(AuthContext)
    let active = contextPanda.active

    const navigation = useNavigation()

    const changeAddress = useCallback(() => {
        navigation.navigate('account',{screen: 'MyAddresses', params: { mode: 'home' }})
    }, [])

    const onClickFashionCat = useCallback(() => {
        navigation.navigate('FashionCategory')
    }, [])

    const onClickWishlist = useCallback(() => {
        navigation.navigate('Wishlist')
    }, [])

    const onClickNotificatn = useCallback(() => {
        navigation.navigate('Notifications')
    }, [])


  return (
    <>
        {/* <StatusBar hidden={false} translucent={true} backgroundColor={'#000'} barStyle="dark-content" marginBottom={10} /> */}
        <SafeAreaView 
            style={{ 
                flexDirection:'row', 
                backgroundColor: active === "green" ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff' , 
                paddingTop:5, 
                alignItems:'center',
                justifyContent: 'center'
            }}
        >
            <TouchableOpacity onPress={onPress} style={{flex:0.13, marginLeft:13}} >
                <EvilIcons name={"navicon"} color="#23233C" size={36} /> 
            </TouchableOpacity>
        
            <TouchableOpacity 
                onPress={changeAddress}
                style={{flexDirection:'row', flex:0.84, justifyContent: 'center', alignItems: 'center'}}
            >
                <FastImage
					style={styles.logo}
					source={ active === 'green' ? require('../Images/locationGrocery.png') : active === 'fashion' ? require('../Images/fashionLocation.png') : require('../Images/location.png')}
				/>
                <View style={{marginLeft:5, flex:0.98,}}>
                <Text numberOfLines={2} style={styles.textStyle}>{userContext?.currentAddress}</Text>
                </View>
            </TouchableOpacity>
            {active === 'fashion' &&
            <>
                <TouchableOpacity onPress={onClickFashionCat}> 
                    <AntDesign name={"appstore1"} color="#FF7190" size={20} />
                </TouchableOpacity> 
                
            </>}
            <TouchableOpacity onPress={onClickWishlist}>
                    <Fontisto name={"heart"} color="#FF6464" size={20} marginHorizontal={8}/>
                </TouchableOpacity> 
            <TouchableOpacity onPress={onClickNotificatn} style={{marginRight:8}}>
                <Ionicons name={"notifications"} color="#23233C" size={25} />
            </TouchableOpacity> 
                              
        </SafeAreaView>
        
    </>
  )
}

export default Header



const styles = StyleSheet.create({
   
    logo: {
		width: 25,
		height: 25,
		resizeMode: 'contain',
	},
    textStyle : {
        fontFamily: 'Poppins-Medium',
        color: '#0D0D0D',
        fontSize: 9, 
    }
})