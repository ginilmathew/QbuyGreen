import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { memo, useCallback } from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import ShopCard from '../Grocery/ShopCard'
import { useNavigation } from '@react-navigation/native'

const AvailableStores = memo(({ data }) => {
    const navigation = useNavigation()

    const moveStoreScreen =useCallback(()=>{
        navigation.navigate('ViewAllStore')
    },[])

    return (
        <>
            {data?.length > 0 && <CommonTexts label={'Available Stores'} ml={15}  mt={15} />}
            <View style={styles.grossCatView}>
                {data?.map((item, index) => (
                    <ShopCard key={index} item={item} />
                ))}

            </View>

            <Pressable onPress={moveStoreScreen} style={styles.viewallStyle}>
                <Text style={styles?.viewallStyleText}>View All</Text>
            </Pressable>
        </>
    )
})

export default AvailableStores

const styles = StyleSheet.create({
    grossCatView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        marginLeft: 2,
        flex: 1,
        //justifyContent:'center'
    },

    viewallStyle: {
        paddingHorizontal:15,
        alignSelf: 'flex-end',
        
    },
    viewallStyleText:{
        fontFamily: 'Poppins-Bold',
        color: '#30B948',
        fontSize: 16,
    }

})