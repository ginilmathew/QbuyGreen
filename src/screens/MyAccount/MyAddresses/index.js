import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import CommonTexts from '../../../Components/CommonTexts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomButton from '../../../Components/CustomButton'
import AddressCard from './AddressCard'
import Foundation from 'react-native-vector-icons/Foundation'
import PandaContext from '../../../contexts/Panda'
import customAxios from '../../../CustomeAxios'
import LoaderContext from '../../../contexts/Loader'
import reactotron from '../../../ReactotronConfig'
import { useFocusEffect } from '@react-navigation/native'
import CartContext from '../../../contexts/Cart'
import Toast from 'react-native-simple-toast';
import AuthContext from '../../../contexts/Auth'


const MyAddresses = ({ route, navigation }) => {

    const loadingContex = useContext(LoaderContext)
    let loadingg = loadingContex?.loading


    const contextPanda = useContext(PandaContext)
    const userContext = useContext(AuthContext)
    const cartContext = useContext(CartContext)
    let active = contextPanda.active


    const mode = route?.params?.mode

    const [selected, setSelected] = useState(null)
    const [addrList, setAddrList] = useState([])

    reactotron.log({ mode })



    // useEffect(() => {
    //     getAddressList()
    // }, [])


    useFocusEffect(
        React.useCallback(() => {
            getAddressList()
        }, [])
    );

    const getAddressList = async () => {
        loadingContex.setLoading(true)
        await customAxios.get(`customer/address/list`)
            .then(async response => {
                cartContext.setAddress(response?.data?.data)
                setAddrList(response?.data?.data)
                loadingContex.setLoading(false)
            })
            .catch(async error => {
                Toast.showWithGravity(error, Toast.SHORT, Toast.BOTTOM);
                loadingContex.setLoading(false)
            })
    }

    datas = [
        {
            _id: '1',
            name: 'Home',
            address: 'Lorem Ipsum, Lorem Street, Lorem,Trivandrum, Kerala, India 953741',
            default: false
        },
        {
            _id: '2',
            name: 'Work',
            address: 'TestHouse, Lorem Street, Lorem,Trivandrum, Kerala, India 953741',
            default: true
        },
        {
            _id: '3',
            name: 'Other',
            address: 'Abc Villa, Lorem Street, Lorem,Trivandrum, Kerala, India 953741',
            default: false
        },

    ]

    const clickAddAddress = useCallback(() => {
        { mode === 'MyAcc' ? navigation.navigate('LocationScreen') : navigation.navigate('AddDeliveryAddress') }
    }, [mode])

    const backAction = useCallback(() => {
        navigation.navigate('MyAccountNav')
    }, [])

    const chooseCrntLocation = useCallback(() => {
        navigation.navigate('LocationScreen')
    }, [])

    const selectAddress = async(id) => {
        let address = addrList.find(addr => addr._id === id);
        userContext.setLocation([address?.area?.latitude, address.area?.longitude])
        userContext.setCurrentAddress(address?.area?.address)
        //reactotron.log({address})
        if(address.default == 0){
            address.default_status =true;
            address.id = address._id
            loadingContex.setLoading(true)
            await customAxios.post(`customer/address/update`, address)
            .then(async response => {
                let address = addrList?.map(add => {
                    if(add._id === id){
                        return response?.data?.data
                    }
                    else{
                        return add
                    }
                })
                setAddrList(add)
                // cartContext.setAddress(response?.data?.data)
                // setAddrList(response?.data?.data)
                loadingContex.setLoading(false)
            })
            .catch(async error => {
                Toast.showWithGravity(error, Toast.SHORT, Toast.BOTTOM);
                loadingContex.setLoading(false)
            })
        }

        if(mode === "home"){
            navigation.goBack()
        }
        else if(mode === "checkout"){
            reactotron.log({address : address?.area?.address})
            cartContext.setDefaultAddress(address)
            navigation.navigate("Checkout")
        }
        
    }



    return (
        <>
            <HeaderWithTitle
                title={mode === 'home' ? 'Select Address' : mode === 'MyAcc' ? 'My Addresses' : "My Addresses"}
                goback={backAction}
            />

            <View style={{ backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', paddingHorizontal: 15, flex: 1 }}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                >
                    {mode === 'home' && <CustomButton
                        onPress={chooseCrntLocation}
                        bg={'#19B836'}
                        label='Choose Current Location'
                        mt={10}
                        leftIcon={<Foundation name={'target-two'} color='#fff' size={20} marginRight={10} />}
                    />}

                    {loadingg ? <ActivityIndicator style={{ marginTop: 10 }} /> : addrList?.map((item, index) =>
                        <AddressCard
                            item={item}
                            key={index}
                            selected={item?.default}
                            setSelected={selectAddress}
                        />
                    )}
                    {addrList?.length === 0 && <CustomButton
                        onPress={chooseCrntLocation}
                        bg={'#19B836'}
                        label='Choose Current Location'
                        mt={10}
                        leftIcon={<Foundation name={'target-two'} color='#fff' size={20} marginRight={10} />}
                    />}
                </ScrollView>
                <CustomButton
                    onPress={chooseCrntLocation}
                    label={'Add Address'}
                    bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#5871D3'}
                    width={'100%'}
                    alignSelf='center'
                    mb={100}
                />
            </View>
        </>

    )
}

export default MyAddresses

const styles = StyleSheet.create({})