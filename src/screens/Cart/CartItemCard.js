import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { memo, useCallback, useContext, useEffect, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FastImage from 'react-native-fast-image'
import CommonCounter from '../../Components/CommonCounter'
import { useNavigation } from '@react-navigation/native'
import PandaContext from '../../contexts/Panda'
import CommonSelectDropdown from '../../Components/CommonSelectDropdown'
import { IMG_URL } from '../../config/constants'
import customAxios from '../../CustomeAxios'
import moment from 'moment'
import CartContext from '../../contexts/Cart'
import AuthContext from '../../contexts/Auth'
import reactotron from 'reactotron-react-native'
import Toast from 'react-native-toast-message';


const CartItemCard = ({item, index, refreshCart}) => {

    const contextPanda = useContext(PandaContext)
    const cartContext = useContext(CartContext)
    const userContext = useContext(AuthContext)
    const [data, setData] = useState(item)
    let fashion = contextPanda.pinkPanda

    useEffect(() => {
      setData(item)
    }, [item])
    

    const navigation = useNavigation()

    const {width} = useWindowDimensions()
    const [count, setCount] = useState(data?.quantity)


    const addItem = async () => {
        if(item?.type === "single" && item?.productdata?.stock){
            if(parseFloat(item?.productdata?.stock_value) < data?.quantity + 1){
                Toast.show({
                    type: 'error',
                    text1: 'Required quantity not available'
                });
                return false;
            }
        }
        else if(item?.variants?.stock_value < data?.quantity + 1){
            Toast.show({
                type: 'error',
                text1: 'Required quantity not available'
            });
            return false;
        }
        data.quantity = data?.quantity + 1
        reactotron.log(data)
        //setData(data)
        let allProducts = cartContext?.cart?.product_details;
        allProducts[index].quantity = allProducts[index].quantity + 1;
        //setCount(count + 1)

        let cartItems = {
            cart_id : cartContext?.cart?._id,
            product_details: allProducts,
            user_id: userContext?.userData?._id
        }


        await customAxios.post(`customer/cart/update`, cartItems)
            .then(async response => {
                cartContext.setCart(response?.data?.data)
                refreshCart()
                //data.quantity = data?.quantity + 1
                //navigation.navigate('CartNav',{screen: 'Cart'})
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                });
            })
    }

    const removeItem = async() => {
        if(data?.quantity > 1){
            data.quantity = data?.quantity - 1
            let allProducts = cartContext?.cart?.product_details;
            allProducts[index].quantity = allProducts[index].quantity - 1;
            //setCount(count + 1)
    
            let cartItems = {
                cart_id : cartContext?.cart?._id,
                product_details: allProducts,
                user_id: userContext?.userData?._id
            }
    
            await customAxios.post(`customer/cart/update`, cartItems)
                .then(async response => {
                    cartContext.setCart(response?.data?.data)
                    refreshCart()
                    //data.quantity = data?.quantity - 1
                    //navigation.navigate('CartNav',{screen: 'Cart'})
                })
                .catch(async error => {
                    Toast.show({
                        type: 'error',
                        text1: error
                    });
                    console.log(error)
                })
        }
        else{
            let allProducts = cartContext?.cart?.product_details?.filter((prod, i) => i !== index );
            let cartItems = {
                cart_id : cartContext?.cart?._id,
                product_details: allProducts,
                user_id: userContext?.userData?._id
            }

            await customAxios.post(`customer/cart/update`, cartItems)
                .then(async response => {
                    cartContext.setCart(response?.data?.data)
                    refreshCart()
                    //data.quantity = data?.quantity - 1
                    //navigation.navigate('CartNav',{screen: 'Cart'})
                })
                .catch(async error => {
                    console.log(error)
                    Toast.show({
                        type: 'error',
                        text1: error
                    });
                })
        }
        
    }

    const goToShop = useCallback(() => {
        navigation.navigate('SingleHotel',{item : data, mode:'cartItem'})
    }, [])

   


    const getPrice = useCallback(() => {
        if(data?.type === "single"){
            if(data?.productdata?.offer_price){
                if(moment(data?.productdata?.offer_date_from, "YYYY-MM-DD") < moment() && moment(data?.productdata?.offer_date_to, "YYYY-MM-DD") > moment()){
                    let finalPrice = parseFloat(data?.productdata?.offer_price) * parseFloat(data?.quantity);
                    return `₹${finalPrice.toFixed(2)}`
                }
                else{
                    if(data?.productdata?.regular_price){
                        let finalPrice = parseFloat(data?.productdata?.regular_price) * parseFloat(data?.quantity);
                        return `₹${finalPrice.toFixed(2)}`
                    }
                    else{
                        let commission = (parseFloat(data?.productdata?.seller_price)/100) * parseFloat(data?.productdata?.commission)
                        let amount = (parseFloat(data?.productdata?.seller_price) + parseFloat(commission)) * parseFloat(data?.quantity);
                        return `₹${amount.toFixed(2)}`
                    }
                }
            }
            else if(parseFloat(data?.productdata?.regular_price) > 0){
                let finalPrice = parseFloat(data?.productdata?.regular_price) * parseFloat(data?.quantity);
                return `₹${finalPrice.toFixed(2)}`
            }
            else{
                let commission = (parseFloat(data?.productdata?.seller_price)/100) * parseFloat(data?.productdata?.commission)
                let amount = (parseFloat(data?.productdata?.seller_price) + parseFloat(commission)) * parseFloat(data?.quantity);
                return `₹${amount.toFixed(2)}`
            }
        }
        else{
            if(data?.variants?.offer_price){
                if(moment(data?.variants?.offer_date_from, "YYYY-MM-DD") < moment() && moment(data?.variants?.offer_date_to, "YYYY-MM-DD") > moment()){
                    let finalPrice = parseFloat(data?.variants?.offer_price) * parseFloat(data?.quantity);
                    return `₹${finalPrice.toFixed(2)}`
                }
                else{
                    if(data?.variants?.regular_price){
                        let finalPrice = parseFloat(data?.variants?.regular_price) * parseFloat(data?.quantity);
                        return `₹${finalPrice.toFixed(2)}`
                    }
                    else{
                        let commission = (parseFloat(data?.variants?.seller_price)/100) * parseFloat(data?.productdata?.commission)
                        let amount = (parseFloat(data?.variants?.seller_price) + parseFloat(commission)) * parseFloat(data?.quantity);
                        return `₹${amount.toFixed(2)}`
                    }
                }
            }
            else if(data?.variants?.regular_price){
                let finalPrice = parseFloat(data?.variants?.regular_price) * parseFloat(data?.quantity);
                return `₹${finalPrice.toFixed(2)}`
            }
            else{
                let commission = (parseFloat(data?.variants?.seller_price)/100) * parseFloat(data?.productdata?.commission)
                let amount = (parseFloat(data?.variants?.seller_price) + parseFloat(commission)) * parseFloat(data?.quantity);
                return `₹${amount.toFixed(2)}`
            }
        }
    }, [item])

    
    return (
        <View style={{borderBottomWidth:0.2, borderColor:'#A9A9A9', padding:10, }} >

            <View style={styles.container}>
                <FastImage
                    style={{width:70, height:70, borderRadius:10}}
                    source={{ uri: `${IMG_URL}${item?.productdata?.product_image}` }}
                />
                <View style={{marginLeft:5, flex:0.95}}>
                    {item?.variants?.title ? <Text style={styles.nameText}>{`${item?.name}${'('}${item?.variants?.title}${')'} `}</Text> : <Text style={styles.nameText}>{item?.name}</Text>}
                    <TouchableOpacity onPress={goToShop}>
                        <Text style={styles.shopText}>{item?.productdata?.store?.name}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={styles.rateText}>{getPrice()}</Text>
                    <CommonCounter 
                        count={data.quantity}
                        addItem={addItem}
                        removeItem={removeItem}
                    />
                </View>
            </View>
        
            {/* {fashion&&<View style={{flexDirection:'row', justifyContent:'space-between',}}>
                <CommonSelectDropdown
                    placeholder='Color'
                    data={color}
                    value={valueColor}
                    setValue={setValueColor}
                    height={35}
                    width={'45%'}
                />
                <CommonSelectDropdown
                    placeholder='Size'
                    data={size}
                    value={valueSize}
                    setValue={setValueSize}
                    height={35}
                    width={'45%'}
                />
            </View>} */}
        </View>
      
    )
}

export default CartItemCard

const styles = StyleSheet.create({
    container : {
        flexDirection:'row', 
        alignItems:'center', 
        
        
    },
    nameText : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    shopText : {
        fontFamily: 'Poppins-BoldItalic',
        color: '#1185E0',
        fontSize: 9,
        marginTop:8
    },
    rateText : {
        fontFamily: 'Poppins-ExtraBold',
        color: '#089321',
        fontSize: 18,
    }
})