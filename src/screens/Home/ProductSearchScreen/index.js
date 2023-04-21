import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useContext, useState, useEffect, useCallback } from 'react'
import PandaContext from '../../../contexts/Panda'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import CustomSearch from '../../../Components/CustomSearch'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import customAxios from '../../../CustomeAxios'
import LoaderContext from '../../../contexts/Loader'
import { IMG_URL } from '../../../config/constants'
import SearchResultsCard from './SearchResultsCard'
import Toast from 'react-native-simple-toast';


const ProductSearchScreen = ({route}) => {

    const mode = route?.params?.mode
    const contextPanda = useContext(PandaContext)
    const loadingg = useContext(LoaderContext)
    let active = contextPanda.active

    let loader = loadingg?.loading

    const [filterResult, setFilterResult] = useState([])


    const schema = yup.object({
        name: yup.string().required('Name is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });


    const filterResults = useCallback(async (value) => {
        if (value === '') {
            setFilterResult([])
        }
        let datas = {
            coordinates: [8.670514, 76.770417],
            search: value
        }
        loadingg.setLoading(true)

        await customAxios.post(`customer/product-search`, datas)

            .then(async response => {
                setFilterResult(response?.data?.data)
                loadingg.setLoading(false)
            })
            .catch(async error => {
                Toast.showWithGravity(error, Toast.SHORT, Toast.BOTTOM);
                loadingg.setLoading(false)
            })
    }, [])


    return (
        <>
            <HeaderWithTitle title={'Search Items...'} />
            <ScrollView style={{
                flex: 1,
                backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',
            }}
            >
                <CustomSearch
                    mb={2}
                    control={control}
                    error={errors.name}
                    fieldName="name"
                    placeholder='Search...'
                    onChangeText={filterResults}
                    autoFocus={true}
                />

                <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
                    {loader ? <ActivityIndicator /> : filterResult?.map((item, index) => (<SearchResultsCard item={item} key={index}/>))}
                </View>
            </ScrollView>
        </>
    )
}

export default ProductSearchScreen

const styles = StyleSheet.create({

})