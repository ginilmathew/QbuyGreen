import React,{useState, useEffect, memo, useCallback} from 'react'
import { View, ImageBackground, StyleSheet,TouchableOpacity,useWindowDimensions, Text } from "react-native";
import { useNavigation } from '@react-navigation/native'
import Lottie from 'lottie-react-native';



const CategoriesCard = memo(({item}) => {

    const {width} = useWindowDimensions()

    const navigation = useNavigation();

    const onClick = useCallback(() => {
        navigation.navigate('Category', {name : item?.name})
    },[])

    return (
        <TouchableOpacity 
            onPress={onClick} 
            style={{width: width/4.2,height:80,alignItems:'center'}}
        >
            <View
                style={styles.lottieView}
            >
                <Lottie 
					source={item?.lottie} 
					autoPlay
				/>
            </View>
            <Text style={styles.itemText}>{item?.name}</Text>
        </TouchableOpacity>
    )
})

export default CategoriesCard

const styles = StyleSheet.create({
    lottieView : { 
        width:50, 
        height:50, 
        borderRadius:25, 
        backgroundColor:'#DFEFE2', 
    },
    itemText : { 
        textAlign:'center', 
        fontSize:11, 
        marginTop:5, 
        fontFamily:'Poppins-Medium', 
        color:'#23233C' 
    }
})