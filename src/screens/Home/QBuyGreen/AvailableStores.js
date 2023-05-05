import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import ShopCard from '../Grocery/ShopCard'

const AvailableStores = ({data}) => {
    return (
        <>
            <CommonTexts label={'Available Stores'} ml={15} fontSize={13} mt={25} />
            <View style={styles.grossCatView}>
                {data?.map((item, index) => (
                    <ShopCard key={index} item={item} />
                ))}
            </View>
        </>
    )
}

export default AvailableStores

const styles = StyleSheet.create({
    grossCatView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        marginLeft: 20,
        marginRight: 10
    },
})