import { StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import ShopCard from '../Grocery/ShopCard'

const AvailableStores = memo(({data}) => {
    return (
        <>
            <CommonTexts label={'Available Stores'} ml={15} fontSize={13} mt={15} />
            <View style={styles.grossCatView}>
                {data?.map((item, index) => (
                    <ShopCard key={index} item={item} />
                ))}
            </View>
        </>
    )
})

export default AvailableStores

const styles = StyleSheet.create({
    grossCatView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 7,
        marginLeft: 4,
    },
})