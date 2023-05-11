import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import HeaderWithTitle from '../../../../../Components/HeaderWithTitle'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import reactotron from 'reactotron-react-native';
import AddressContext from '../../../../../contexts/Address';

const AddNewLocation = ({ route, navigation }) => {

    const addressContext = useContext(AddressContext)


    const { width, height } = useWindowDimensions()

    const mapRef = useRef()

    // const renderRow = (data, index) => {

    //     reactotron.log({ data })
    //     return (
    //         <Text key={index} color={'#000'}>{data?.description}</Text>
    //     )
    // }


    return (

        <>
            <HeaderWithTitle title={'Location'} />
            <View style={{ padding: 20 }}>
                <GooglePlacesAutocomplete
                    fetchDetails={true}
                    placeholder='Search'
                    textInputProps={{
                        placeholderTextColor: 'gray',
                        returnKeyType: "search"
                    }}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        // reactotron.log(data, details);
                        addressContext.setCurrentAddress(data)
                        addressContext.setLocation(details)
                        navigation.navigate('LocationScreen')

                    }}
                    query={{
                        key: 'AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY',
                        language: 'en',
                    }}
                    renderRow={(rowData) => {
                        const title = rowData.structured_formatting.main_text;
                        const address = rowData.structured_formatting.secondary_text;

                        return (
                            <View>
                                <Text style={{ fontSize: 14 }}>{title}</Text>
                                <Text style={{ fontSize: 14 }}>{address}</Text>
                            </View>
                        );
                    }}
                    styles={styles}
                />
            </View>


        </>


    )
}

export default AddNewLocation

// const styles = StyleSheet.create({
//     selectedLocationView: {
//         backgroundColor: '#fff',
//         height: 200,
//         position: 'absolute',
//         bottom: 0,
//         width: '100%',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         padding: 20
//     },
//     address: {
//         fontFamily: 'Poppins-Regular',
//         color: '#23233C',
//         fontSize: 11,
//         marginTop: 5
//     }
// })

const styles = StyleSheet.create({
    textInputContainer: {
        backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        zIndex: 999,
        width: '100%',
    },
    textInput: {
        marginLeft: 0,
        marginRight: 0,
        height: 45,
        color: '#5d5d5d',
        fontSize: 16,
        borderWidth: 1,
        zIndex: 999,
        borderWidth:0,
    
    },
    predefinedPlacesDescription: {
        color: '#1faadb'
    },
    listView: {
        top: 45.5,
        zIndex: 10,
        position: 'absolute',
        color: 'black',
        backgroundColor: "white",
        width: '100%',
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#f5f5f5',
    },
    description: {
        flexDirection: "row",
        flexWrap: "wrap",
        fontSize: 14,
        maxWidth: '100%',
    },

});