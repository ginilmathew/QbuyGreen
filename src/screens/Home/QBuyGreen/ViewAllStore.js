import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useCallback } from 'react'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import FastImage from 'react-native-fast-image'

const ViewAllStore = ({ route, navigation }) => {

    const { width, height } = useWindowDimensions()

    const storedate = [
        {
            id: 10,
            name: 'ginil'

        },
        {
            id: 11,
            name: 'ginil'

        },
        {
            id: 12,
            name: 'ginil'

        },
        {
            id: 13,
            name: 'ginil'

        },
        {
            id: 14,
            name: 'ginil'

        },
    ]



    const renderItems = ({ item }) => {
        return (
            <View>
                <TouchableOpacity
                    key={item?._id}
                    onPress={null}
                    style={{ width: width / 4, height: 90, alignItems: 'center', marginTop: 10 }}
                >
                    <FastImage
                        style={{ width: 75, height: 70, borderRadius: 10 }}
                        source={require('../../../Images/vegies.png')}
                        borderRadius={10}
                    />
                    <Text
                        numberOfLines={1}
                        style={styles.itemText}
                    >{item?.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }


    const NavigationToHome = useCallback(() => {
        navigation.navigate('Home')
    }, [])

    return (
        <View>
            <HeaderWithTitle title={'Stores'} onPressBack={NavigationToHome} />
            <FlatList
               numColumns={4}
                data={storedate}
                keyExtractor={(item) => item.id}
                renderItem={renderItems}
            />
        </View>
    )
}

export default ViewAllStore

const styles = StyleSheet.create({

    itemText: {
        textAlign: 'center',
        fontSize: 11,
        marginTop: 5,
        fontFamily: 'Poppins-SemiBold',
        color: '#23233C',
        fontWeight: 'bold'
    }
})