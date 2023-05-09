import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { memo } from 'react'
import CommonItemCard from '../../../Components/CommonItemCard'
import CommonTexts from '../../../Components/CommonTexts'

const RecentlyViewed = memo(({data, addToCart}) => {
    const {width} = useWindowDimensions()

    return (
        <>
        {data?.length > 0 &&<CommonTexts label={'Recently Viewed'} fontSize={13} ml={15} mb={15} mt={5} />}
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: 'row', paddingLeft: 7, }}
        >
            {data.map((item) =>
                <CommonItemCard
                    key={item?._id}
                    item={item}
                    width={width / 2.5}
                    marginHorizontal={5}
                    addToCart={addToCart}
                />
            )}
        </ScrollView>
        </>
        
    )
})

export default RecentlyViewed

const styles = StyleSheet.create({})