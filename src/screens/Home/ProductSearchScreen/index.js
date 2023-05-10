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
import { IMG_URL, env, location } from '../../../config/constants'
import SearchResultsCard from './SearchResultsCard'
import Toast from 'react-native-toast-message';
import reactotron from '../../../ReactotronConfig'
import AuthContext from '../../../contexts/Auth'


const ProductSearchScreen = ({route}) => {

    const contextPanda = useContext(PandaContext)
    const loadingg = useContext(LoaderContext)
    const userContext = useContext(AuthContext)
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
            coordinates: env === "dev" ? location : userContext?.location,
            search: value,
            type : active
        }
        loadingg.setLoading(true)

        await customAxios.post(`customer/product-search`, datas)

            .then(async response => {
                setFilterResult(response?.data?.data)
                loadingg.setLoading(false)
            })
            .catch(async error => {
                // Toast.show({
                //     type: 'error',
                //     text1: error
                // });
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