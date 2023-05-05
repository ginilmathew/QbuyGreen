import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TypeCard from '../Grocery/TypeCard'

const CategoryCard = ({data}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:20}}>
        {data?.map((item, index) =>
            (<TypeCard item={item} key={index} />)
        )}
    </ScrollView>
  )
}

export default CategoryCard

const styles = StyleSheet.create({})