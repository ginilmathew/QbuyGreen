import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PandaContext from '../../../contexts/Panda'

const StoreAddressCard = ({address}) => {

    const contextPanda = useContext(PandaContext)
    let fashion = contextPanda.pinkPanda
    let grocery = contextPanda.pinkPanda

    return (
        <View style={styles.container}>
            <Ionicons name='ios-location-sharp' color={fashion ? '#FF7190' : grocery ? '#8ED053' : '#58D36E'} size={15}/>
            <Text style={styles.regularText}>{address}</Text>
        </View>
    )
}

export default StoreAddressCard

const styles = StyleSheet.create({
    container: {
        flexDirection:'row', 
        alignItems:'center', 
        marginTop:10
    },
    regularText: {
        fontFamily:'Poppins-Regular', 
        fontSize:11, 
        color:'#23233C', 
        marginLeft:5
    }
})