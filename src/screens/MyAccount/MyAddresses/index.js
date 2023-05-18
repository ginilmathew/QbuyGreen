import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import CommonTexts from '../../../Components/CommonTexts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomButton from '../../../Components/CustomButton'
import AddressCard from './AddressCard'
import Foundation from 'react-native-vector-icons/Foundation'
import PandaContext from '../../../contexts/Panda'
import customAxios from '../../../CustomeAxios'
import LoaderContext from '../../../contexts/Loader'
import { useFocusEffect } from '@react-navigation/native'
import CartContext from '../../../contexts/Cart'
import Toast from 'react-native-toast-message'
import AuthContext from '../../../contexts/Auth'
import axios from 'axios'
import AddressContext from '../../../contexts/Address'


const MyAddresses = ({ route, navigation }) => {

    const loadingContex = useContext(LoaderContext)
    let loadingg = loadingContex?.loading


    const contextPanda = useContext(PandaContext)
    const userContext = useContext(AuthContext)
    const cartContext = useContext(CartContext)
    const addressContext = useContext(AddressContext)
    let active = contextPanda.active


    const mode = route?.params?.mode

    const [selected, setSelected] = useState(null)
    const [addrList, setAddrList] = useState([])




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
                Toast.show({
                    type: 'error',
                    text1: error
                });
                loadingContex.setLoading(false)
            })
    }


    const backAction = useCallback(() => {
        navigation.navigate('MyAccountNav')
    }, [])

    const chooseCrntLocation = () => {
        addressContext.setCurrentAddress(null)
        if (addrList?.length >= 1) {
            let result = addrList?.filter((res) => res?.default === true)
            const Value = {
                location: result[0]?.area?.address,
                city: result[0]?.area?.location,
                latitude: result[0]?.area?.latitude,
                longitude: result[0]?.area?.longitude
            }
            addressContext.setCurrentAddress(Value)
            if (addressContext?.CucurrentAddress) {
                navigation.navigate('LocationScreen')
            }
        }
        navigation.navigate('LocationScreen')
    }

    const deleteSelect = async (id) => {

        loadingContex.setLoading(true)
        await customAxios.delete(`customer/address/delete/${id}`).then((response) => {
            let result = addrList?.filter((res) => res?._id !== id)
            setAddrList(result)
            loadingContex.setLoading(false)

        }).catch((error) => {
            Toast.show({
                type: 'error',
                text1: error
            });
            loadingContex.setLoading(false)
        }
        )
    }

    const selectAddress = async (id) => {
        let address = addrList.find(addr => addr?._id === id);
        userContext.setLocation([address?.area?.latitude, address?.area?.longitude])
        userContext.setCurrentAddress(address?.area?.address)

        // if (!address?.default) {
        address.default_status = true;
        address.id = address?._id

        loadingContex.setLoading(true)
        await customAxios.post(`customer/address/update`, address).then((response) => {
            setAddrList(response?.data?.data)
            loadingContex.setLoading(false)
        }
        ).catch(async error => {
            Toast.show({
                type: 'error',
                text1: error
            });
            loadingContex.setLoading(false)
        })
        // }

        if (mode === "home") {
            navigation.goBack()
        }
        else if (mode === "checkout") {
            cartContext.setDefaultAddress(address)
            navigation.navigate("Checkout")
        }
    }

    return (
        <>
            <HeaderWithTitle
                title={mode === 'home' ? 'Select Address' : mode === 'MyAcc' ? 'My Addresses' : "My Addresses"}
                // goback={backAction}
                mode={mode}
            />

            <View style={{ backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', paddingHorizontal: 15, flex: 1 }}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={loadingg} onRefresh={getAddressList} />
                    }
                >
                    {(mode === 'home' || addrList?.length === 0) && <CustomButton
                        onPress={chooseCrntLocation}
                        bg={'#19B836'}
                        label='Choose Current Location'
                        mt={10}
                        leftIcon={<Foundation name={'target-two'} color='#fff' size={20} marginRight={10} />}
                    />}

                    {addrList?.map((item, index) =>
                        <AddressCard
                            item={item}
                            key={index}
                            selected={item?.default}
                            setSelected={selectAddress}
                            deleteSelect={deleteSelect}
                        />
                    )}
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