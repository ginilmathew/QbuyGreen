import { StyleSheet, Text, View } from 'react-native'
import React, { memo, useCallback, useContext, useState } from 'react'
import CommonCounter from '../../../Components/CommonCounter'
import moment from 'moment'
import CartContext from '../../../contexts/Cart'
import customAxios from '../../../CustomeAxios'
import AuthContext from '../../../contexts/Auth'
import reactotron from 'reactotron-react-native'

const CheckoutItemCard = memo(({item, index, refreshCart}) => {


    const cartContext = useContext(CartContext)
    const userContext = useContext(AuthContext)

    const [data, setData] = useState(item)

    const [count, setCount] = useState(item?.count)

    const addItem = useCallback(async () => {
        data.quantity = data?.quantity + 1
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
                console.log(error)
                // ToastAndroid.showWithGravity(
                //     error,
                //     ToastAndroid.SHORT,
                //     ToastAndroid.CENTER,
                // )
                // loadingg.setLoading(false)
            })
    }, [])

    const removeItem = useCallback(async() => {
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
                    console.log(error)
                    // ToastAndroid.showWithGravity(
                    //     error,
                    //     ToastAndroid.SHORT,
                    //     ToastAndroid.CENTER,
                    // )
                    // loadingg.setLoading(false)
                })
        }
    }, [])

    const getPrice = useCallback(() => {
        if(data?.type === "single"){
            if(data?.productdata?.offer_price){
                if(moment(data?.productdata?.offer_date_from, "YYYY-MM-DD") < moment() && moment(data?.productdata?.offer_date_to, "YYYY-MM-DD") > moment()){
                    let finalPrice = parseFloat(data?.productdata?.offer_price);
                    return finalPrice
                }
                else{
                    if(data?.productdata?.regular_price){
                        let finalPrice = parseFloat(data?.productdata?.regular_price);
                        return finalPrice
                    }
                    else{
                        let commission = (parseFloat(data?.productdata?.seller_price)/100) * parseFloat(commission)
                        let amount = (parseFloat(data?.productdata?.seller_price) + parseFloat(commission));
                        return amount
                    }
                }
            }
            else if(data?.productdata?.regular_price){
                let finalPrice = parseFloat(data?.productdata?.regular_price);
                return finalPrice
            }
            else{
                let commission = (parseFloat(data?.productdata?.seller_price)/100) * parseFloat(commission)
                let amount = (parseFloat(data?.productdata?.seller_price) + parseFloat(commission));
                return amount
            }
        }
        else{
            if(data?.variants?.offer_price){
                if(moment(data?.variants?.offer_date_from, "YYYY-MM-DD") < moment() && moment(data?.variants?.offer_date_to, "YYYY-MM-DD") > moment()){
                    let finalPrice = parseFloat(data?.variants?.offer_price);
                    return finalPrice
                }
                else{
                    if(data?.variants?.regular_price){
                        let finalPrice = parseFloat(data?.variants?.regular_price);
                        return finalPrice
                    }
                    else{
                        let commission = (parseFloat(data?.variants?.seller_price)/100) * parseFloat(commission)
                        let amount = (parseFloat(data?.variants?.seller_price) + parseFloat(commission));
                        return amount
                    }
                }
            }
            else if(data?.variants?.regular_price){
                let finalPrice = parseFloat(data?.variants?.regular_price);
                return finalPrice
            }
            else{
                let commission = (parseFloat(data?.variants?.seller_price)/100) * parseFloat(commission)
                let amount = (parseFloat(data?.variants?.seller_price) + parseFloat(commission));
                return amount
            }
        }
    }, [])

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.8 }}>
                <Text style={styles.text1}>{item?.name}</Text>
                <Text style={styles.text2}>{item?.productdata?.store?.name}</Text>
            </View>
            <Text style={styles.text1}>₹ {getPrice()}</Text>
            <CommonCounter 
                count={item?.quantity}
                addItem={addItem}
                removeItem={removeItem}
            />

            <Text style={styles.text1}>₹ {(getPrice() * parseFloat(item?.quantity)).toFixed(2)}</Text>
        </View>
    )
})

export default CheckoutItemCard

const styles = StyleSheet.create({
    container : { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        justifyContent: 'space-between', 
        paddingVertical: 10, 
        borderBottomWidth: 1, 
        borderColor: '#00000029', 
        paddingHorizontal: 7 
    },
    text1 : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    text2 : {
        fontFamily: 'Poppins-BoldItalic',
        color: '#1185E0',
        fontSize: 9,
        marginTop: 5
    }
})