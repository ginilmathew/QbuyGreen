import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import HeaderWithTitle from '../../../../../Components/HeaderWithTitle'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const AddNewLocation = ({ route, navigation }) => {


    const { width, height } = useWindowDimensions()

    const mapRef = useRef()

    const renderRow = (data, index) => {
        return (
            <Text key={index} color={'#000'}>{data?.description}</Text>
        )
    }


    return (

        <>
            <HeaderWithTitle title={'Location'}/>
   

            <View style={{padding:20}}>

                <GooglePlacesAutocomplete
                    fetchDetails={true}
                    placeholder='Search'
                    textInputProps={{
                        placeholderTextColor: 'gray',
                        returnKeyType: "search"
                      }}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        console.log(data, details);
                    }}
                    query={{
                        key: 'AIzaSyC0G7dxT1BOwA2sacNdua7wmwcZbQonKXo',
                        language: 'en',
                    }}
                    renderRow={renderRow}
                    styles={{
                        textInput: {
                          color: '#000',
                          fontSize: 16,
                        },
                        predefinedPlacesDescription: {
                          color: '#000',
                        },
                    }}
                />
            </View>


        </>


    )
}

export default AddNewLocation

const styles = StyleSheet.create({
    selectedLocationView: {
        backgroundColor: '#fff',
        height: 200,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20
    },
    address: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
        marginTop: 5
    }
})