import { ScrollView, StyleSheet, Text, Button, View, Alert, PermissionsAndroid, Platform, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Foundation from 'react-native-vector-icons/Foundation'
import HeaderWithTitle from '../../../../Components/HeaderWithTitle'
import CommonTexts from '../../../../Components/CommonTexts'
import CustomButton from '../../../../Components/CustomButton'
import MapView, { Marker } from 'react-native-maps';
import PandaContext from '../../../../contexts/Panda'
import Geolocation, { getCurrentPosition } from 'react-native-geolocation-service';
import reactotron from '../../../../ReactotronConfig'
import axios from 'axios'

const LocationScreen = ({ route, navigation }) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const { width, height } = useWindowDimensions()

    const mapRef = useRef()

    const [location, setLocation] = useState({ latitude: 0, longitude: 0 })
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    reactotron.log(location?.latitude)

    async function fetchData() {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            )
        }
        if (Platform.OS === 'ios') {
            const hasPermission = await hasPermissionIOS();
            return hasPermission;
        }
    }

    const hasPermissionIOS = async () => {
        const openSetting = () => {
            Linking.openSettings().catch(() => {
                Alert.alert('Unable to open settings');
            });
        };
        const status = await Geolocation.requestAuthorization('whenInUse');
        if (status === 'granted') {
            return true;
        }
        if (status === 'denied') {
            Alert.alert('Location permission denied');
        }
        if (status === 'disabled') {
            Alert.alert(
                `Turn on Location Services to allow  to determine your location.`,
                '',
                [
                    { text: 'Go to Settings', onPress: openSetting },
                    { text: "Don't Use Location", onPress: () => { } },
                ],
            );
        }
        return false;
    };

    useEffect(() => {
        fetchData().then(() => {
            Geolocation.getCurrentPosition(
                position => {
                    reactotron.log({position})
                    getAddressFromCoordinates(position?.coords?.latitude, position?.coords?.longitude);
                    setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })
                },
                error => {
                    console.log(error.code, error.message)
                },
                {
                    showLocationDialog: true,
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0
                }
            )
        })
    }, [])

    const onConfirm = useCallback(() => {

        let locationData = {
            location: address,
            city: city,
            latitude: location.latitude,
            longitude: location.longitude,
        }
        navigation.navigate('AddDeliveryAddress', { item: locationData })
    }, [location, address, city])

    const addNewAddress = useCallback(() => {
        navigation.navigate('AddNewLocation')
    }, [])

    const myApiKey="Key Received from Google map"

function getAddressFromCoordinates(latitude, longitude) {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=AIzaSyDDFfawHZ7MhMPe2K62Vy2xrmRZ0lT6X0I`).then(response => {
        setAddress(response?.data?.results[0]?.formatted_address)
        let locality = response?.data?.results?.[0]?.address_components?.find(add => add.types.includes('locality'));
        setCity(locality?.long_name)
    })
    .catch(err => {
        reactotron.log({err})
    })
  
}


    const RegionChange = (e) => {
        reactotron.log({coordinates: e.nativeEvent.coordinate})
        let coordinates= e.nativeEvent.coordinate;
        getAddressFromCoordinates(coordinates?.latitude, coordinates?.longitude)
        setLocation({ latitude: coordinates?.latitude, longitude:  coordinates?.longitude })
        //setLocation(region)
        reactotron.log({location})
    }

    return (
        <>
            <HeaderWithTitle
                title={'Select Address'}
            // onPress={mode === 'header' ?}
            />
            <MapView
                style={{ flex: 1 }}
                region={{
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                onPress={RegionChange}
                ref={mapRef}
                //onRegionChangeComplete={RegionChange}
                showsUserLocation={true}
                // onUserLocationChange={(e)=>{
                //     console.log("onUserLocationChange", e.nativeEvent)
                // }}
            >
                {location && <Marker
                    coordinate={{
                        latitude: location?.latitude,
                        longitude: location?.longitude,
                    }}
                />}
            </MapView>
            <View style={styles.selectedLocationView}>
                <View style={{ flexDirection: 'row', }}>
                    <Foundation name={'target-two'} color='#FF0000' size={23} marginTop={7} />
                    <View style={{ flex: 0.9, marginLeft: 7,   }}>
                        <CommonTexts label={city} fontSize={22} />
                        <Text
                            style={{
                                fontFamily: 'Poppins-Regular',
                                color: '#23233C',
                                fontSize: 11,
                                marginTop:-5
                            }}
                        >{address}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={addNewAddress}
                        style={{ position: 'absolute', right: 10 }}
                    >
                        <MaterialCommunityIcons name={'lead-pencil'} color={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#5871D3'} size={18} marginTop={5} />
                    </TouchableOpacity>
                </View>
                <CustomButton
                    onPress={onConfirm}
                    label={'Confirm'}
                    bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#5871D3'}
                    mt={10}
                />
            </View>
        </>
    )
}

export default LocationScreen

const styles = StyleSheet.create({
    selectedLocationView: {
        backgroundColor: '#fff',
        height: 200,
        position: 'absolute',
        bottom: 50,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20
    },
    address: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
        marginTop: 5,
        
        
    }
})