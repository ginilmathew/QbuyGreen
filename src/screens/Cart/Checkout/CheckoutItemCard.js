import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { memo, useCallback, useContext, useState } from 'react'
import CommonCounter from '../../../Components/CommonCounter'
import moment from 'moment'
import CartContext from '../../../contexts/Cart'
import customAxios from '../../../CustomeAxios'
import AuthContext from '../../../contexts/Auth'
import reactotron from 'reactotron-react-native'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { useNavigation } from '@react-navigation/native'

const CheckoutItemCard = memo(({item, index, refreshCart, view}) => {

    const navigation = useNavigation()

    const cartContext = useContext(CartContext)
    const userContext = useContext(AuthContext)

    const [data, setData] = useState(item)

    const [count, setCount] = useState(item?.count)

    // const addItem = useCallback(async () => {
    //     data.quantity = data?.quantity + 1
    //     let allProducts = cartContext?.cart?.product_details;
    //     allProducts[index].quantity = allProducts[index].quantity + 1;
    //     //setCount(count + 1)

    //     let cartItems = {
    //         cart_id : cartContext?.cart?._id,
    //         product_details: allProducts,
    //         user_id: userContext?.userData?._id
    //     }


    //     await customAxios.post(`customer/cart/update`, cartItems)
    //         .then(async response => {
    //             cartContext.setCart(response?.data?.data)
    //             refreshCart()
    //             //data.quantity = data?.quantity + 1
    //             //navigation.navigate('CartNav',{screen: 'Cart'})
    //         })
    //         .catch(async error => {
    //             console.log(error)
    //             Toast.show({
    //                 type: 'error',
    //                 text1: error
    //             });
    //         })
    // }, [])
    const addItem = async () => {
        if(item?.type === "single"){
            if(item?.productdata?.stock){
                if(parseFloat(item?.productdata?.stock_value) < data?.quantity + 1){
                    Toast.show({
                        type: 'error',
                        text1: 'Required quantity not available'
                    });
                    return false;
                }
            }
            
        }
        else {
            if(item?.productdata?.stock){
                if(parseFloat(item?.variants?.stock_value) < data?.quantity + 1){
                    Toast.show({
                        type: 'error',
                        text1: 'Required quantity not available'
                    });
                    return false;
                }
            }
        }
        data.quantity = data?.quantity + 1
        //reactotron.log(data)
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

    // const removeItem = useCallback(async() => {
    //     if(data?.quantity > 1){
    //         data.quantity = data?.quantity - 1
    //         let allProducts = cartContext?.cart?.product_details;
    //         allProducts[index].quantity = allProducts[index].quantity - 1;
    //         //setCount(count + 1)
    
    //         let cartItems = {
    //             cart_id : cartContext?.cart?._id,
    //             product_details: allProducts,
    //             user_id: userContext?.userData?._id
    //         }
    
    //         await customAxios.post(`customer/cart/update`, cartItems)
    //             .then(async response => {
    //                 cartContext.setCart(response?.data?.data)
    //                 refreshCart()
    //                 //data.quantity = data?.quantity - 1
    //                 //navigation.navigate('CartNav',{screen: 'Cart'})
    //             })
    //             .catch(async error => {
    //                 console.log(error)
    //                 Toast.show({
    //                     type: 'error',
    //                     text1: error
    //                 });
    //             })
    //     }
    //     else{
    //         let allProducts = cartContext?.cart?.product_details?.filter((prod, i) => i !== index );
    //         let cartItems = {
    //             cart_id : cartContext?.cart?._id,
    //             product_details: allProducts,
    //             user_id: userContext?.userData?._id
    //         }

    //         await customAxios.post(`customer/cart/update`, cartItems)
    //             .then(async response => {
    //                 cartContext.setCart(response?.data?.data)
    //                 refreshCart()
    //                 //data.quantity = data?.quantity - 1
    //                 //navigation.navigate('CartNav',{screen: 'Cart'})
    //             })
    //             .catch(async error => {
    //                 console.log(error)
    //                 Toast.show({
    //                     type: 'error',
    //                     text1: error
    //                 });
    //             })
    //     }
    // }, [])

    const removeItem = async() => {
        let minimumQty = data?.productdata?.minimum_qty ? data?.productdata?.minimum_qty : 1
        reactotron.log({minimumQty})
        //return false
        let allProducts = cartContext?.cart?.product_details;
        let cartItems;
        if(data?.quantity > 1){
            let quantity = data?.quantity 
            
            if(quantity - 1 >= minimumQty){
                data.quantity = quantity - 1
                allProducts[index].quantity = allProducts[index].quantity - 1;
                cartItems = {
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
                Alert.alert(
                    'Warning',
                    'Are you sure want to remove this product',
                    [
                        {
                            text: 'Cancel',
                            //onPress: () => Alert.alert('Cancel Pressed'),
                            style: 'cancel',
                        },
                        {
                            text: 'Ok',
                            onPress: deleteItem,
                            style: 'cancel',
                        },
                    ],
                    {
                      cancelable: true
                    },
                );
            }
            
    
           
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
                    if(allProducts?.length === 0){
                        navigation.goBack()
                    }
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

    const deleteItem = async() => {
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
                    if(allProducts?.length === 0){
                        navigation.goBack()
                    }
                })
                .catch(async error => {
                    console.log(error)
                    Toast.show({
                        type: 'error',
                        text1: error
                    });
                })
    }

    // const getPrice = useCallback(() => {
    //     if(data?.type === "single"){
    //         if(data?.productdata?.offer_price){
    //             if(moment(data?.productdata?.offer_date_from, "YYYY-MM-DD") < moment() && moment(data?.productdata?.offer_date_to, "YYYY-MM-DD") > moment()){
    //                 let finalPrice = parseFloat(data?.productdata?.offer_price);
    //                 return finalPrice
    //             }
    //             else{
    //                 if(data?.productdata?.regular_price){
    //                     let finalPrice = parseFloat(data?.productdata?.regular_price);
    //                     return finalPrice
    //                 }
    //                 else{
    //                     let commission = (parseFloat(data?.productdata?.seller_price)/100) * parseFloat(commission)
    //                     let amount = (parseFloat(data?.productdata?.seller_price) + parseFloat(commission));
    //                     return amount
    //                 }
    //             }
    //         }
    //         else if(data?.productdata?.regular_price){
    //             let finalPrice = parseFloat(data?.productdata?.regular_price);
    //             return finalPrice
    //         }
    //         else{
    //             let commission = (parseFloat(data?.productdata?.seller_price)/100) * parseFloat(commission)
    //             let amount = (parseFloat(data?.productdata?.seller_price) + parseFloat(commission));
    //             return amount
    //         }
    //     }
    //     else{
    //         if(data?.variants?.offer_price){
    //             if(moment(data?.variants?.offer_date_from, "YYYY-MM-DD") < moment() && moment(data?.variants?.offer_date_to, "YYYY-MM-DD") > moment()){
    //                 let finalPrice = parseFloat(data?.variants?.offer_price);
    //                 return finalPrice
    //             }
    //             else{
    //                 if(data?.variants?.regular_price){
    //                     let finalPrice = parseFloat(data?.variants?.regular_price);
    //                     return finalPrice
    //                 }
    //                 else{
    //                     let commission = (parseFloat(data?.variants?.seller_price)/100) * parseFloat(commission)
    //                     let amount = (parseFloat(data?.variants?.seller_price) + parseFloat(commission));
    //                     return amount
    //                 }
    //             }
    //         }
    //         else if(data?.variants?.regular_price){
    //             let finalPrice = parseFloat(data?.variants?.regular_price);
    //             return finalPrice
    //         }
    //         else{
    //             let commission = (parseFloat(data?.variants?.seller_price)/100) * parseFloat(commission)
    //             let amount = (parseFloat(data?.variants?.seller_price) + parseFloat(commission));
    //             return amount
    //         }
    //     }
    // }, [])

    const getPrice = useCallback(() => {
        if(data?.type === "single"){
            if(data?.productdata?.offer_price){
                if(moment(data?.productdata?.offer_date_from, "YYYY-MM-DD") <= moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") && moment(data?.productdata?.offer_date_to, "YYYY-MM-DD") >= moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD")){
                    let finalPrice = parseFloat(data?.productdata?.offer_price);
                    return finalPrice
                }
                else{
                    if(data?.productdata?.regular_price){
                        let finalPrice = parseFloat(data?.productdata?.regular_price);
                        return finalPrice
                    }
                    else{
                        let comm = data?.productdata?.commission ? data?.productdata?.commission : 0
                        let commission = (parseFloat(data?.productdata?.seller_price)/100) * parseFloat(comm)
                        let amount = (parseFloat(data?.productdata?.seller_price) + parseFloat(commission));
                        return amount
                    }
                }
            }
            else if(parseFloat(data?.productdata?.regular_price) > 0){
                let finalPrice = parseFloat(data?.productdata?.regular_price);
                return finalPrice
            }
            else{
                let comm = data?.productdata?.commission ? data?.productdata?.commission : 0
                let commission = (parseFloat(data?.productdata?.seller_price)/100) * parseFloat(comm)
                let amount = (parseFloat(data?.productdata?.seller_price) + parseFloat(commission));
                return amount
            }
        }
        else{
            if(data?.variants?.offer_price){
                if(moment(data?.variants?.offer_date_from, "YYYY-MM-DD") <= moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD") && moment(data?.variants?.offer_date_to, "YYYY-MM-DD") >= moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD")){
                    let finalPrice = parseFloat(data?.variants?.offer_price);
                    return finalPrice
                }
                else{
                    if(data?.variants?.regular_price){
                        let finalPrice = parseFloat(data?.variants?.regular_price);
                        return finalPrice
                    }
                    else{
                        let comm = data?.variants?.commission ? data?.variants?.commission : 0
                        let commission = (parseFloat(data?.variants?.seller_price)/100) * parseFloat(comm)
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
                let comm = data?.variants?.commission ? data?.variants?.commission : 0
                let commission = (parseFloat(data?.variants?.seller_price)/100) * parseFloat(comm)
                let amount = (parseFloat(data?.variants?.seller_price) + parseFloat(commission));
                return amount
            }
        }
    }, [data])

    const gotoStore = useCallback(() => {
        navigation.navigate('home', {screen: 'store', params : {name : item?.productdata?.store?.name, mode : 'checkoutItem', storeId: item?.productdata?.store?._id }})
    })

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.8 }}>
                <Text style={styles.text1}>{item?.name}</Text>
                {!view && <Text onPress={gotoStore} style={styles.text2}>{item?.productdata?.store?.name}</Text>}
            </View>
            <Text style={styles.text1}>₹ {getPrice()}</Text>
            {!view && <CommonCounter 
                count={item?.quantity}
                addItem={addItem}
                removeItem={removeItem}
            />}

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