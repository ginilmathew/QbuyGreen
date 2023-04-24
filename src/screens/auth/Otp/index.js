import { StyleSheet, Text, View, Image, ScrollView, Platform, SafeAreaView, ToastAndroid, } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CommonAuthBg from '../CommonAuthBg';
import CustomButton from '../../../Components/CustomButton';
import CommonTitle from '../../../Components/CommonTitle';
import OtpInput from '../../../Components/OtpInput';
import CommonTexts from '../../../Components/CommonTexts';
import AuthContext from '../../../contexts/Auth';
import reactotron from '../../../ReactotronConfig';
import LoaderContext from '../../../contexts/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import customAxios from '../../../CustomeAxios';
import { mode } from '../../../config/constants';
import Toast from 'react-native-simple-toast';
import { CommonActions } from '@react-navigation/native';

const Otp = ({ navigation }) => {

	const user = useContext(AuthContext)
	const loadingg = useContext(LoaderContext)
	let loader = loadingg?.loading

	let mobileNo = user?.login?.mobile
	let userData = user?.userData

	reactotron.log({mode})


	const schema = yup.object({
		otp: yup.number().required('OTP is required'),
	}).required();

	const { control, handleSubmit, formState: { errors }, setValue } = useForm({
		resolver: yupResolver(schema)
	});

	var cardnumber = mobileNo;
	var first2 = cardnumber?.substring(0, 2);
	var last1 = cardnumber?.substring(cardnumber.length - 1);
	
	mask = cardnumber?.substring(2, cardnumber.length - 1).replace(/\d/g,"*");
	let phoneNum = first2 + mask + last1

	const onSubmit = useCallback(async(data) => {
		loadingg.setLoading(true)

		let datas = {
			mobile: mobileNo,
			otp: data?.otp
		}

		await customAxios.post(`auth/customerlogin`, datas)
        .then(async response => {
			user.setUserData(response?.data?.user)
			AsyncStorage.setItem("token", response?.data?.access_token);
			AsyncStorage.setItem("user", JSON.stringify(response?.data?.user));

            loadingg.setLoading(false)
			// navigation.navigate(mode)
			// navigation.navigate('NewUserDetails')

			navigation.dispatch(CommonActions.reset({
				index: 0,
				routes: [
				  { name: mode }
				],
			  }))

        })
        .catch(async error => {
			Toast.showWithGravity(error, Toast.SHORT, Toast.BOTTOM);
            loadingg.setLoading(false)
        })
	})


	return (
		<CommonAuthBg>
			<ScrollView style={{ flex: 1, paddingHorizontal: 40, }}>
				<SafeAreaView>
				<CommonTitle goBack={()=>navigation.goBack()} mt={40}/>
				<CommonTexts
					label={'Enter the 4 - digit code we sent to your registered mobile number'}
					mt={40}
				/>
				<CommonTexts
					label={phoneNum}
					mt={40}
					textAlign='center'
				/>
				<OtpInput 
					onchange={(text) => {
						setValue("otp", text) 
					}}
				/>
				{errors?.otp && <Text style={{color:'red', fontSize:10}} > {errors?.otp?.message}</Text>}
				<CommonTexts
					label={'Resend OTP'}
					mt={10}
					textAlign='right'
					color={'#5871D3'}
				/>
				<CustomButton
					onPress={handleSubmit(onSubmit)}
					bg='#58D36E'
					label={'Confirm'}
					my={20}
					width={100}
					alignSelf='center'
					loading={loader}
				/>
				</SafeAreaView>
			</ScrollView>
		</CommonAuthBg>
	)
}

export default Otp

const styles = StyleSheet.create({

	logo: {
		width: 100,
		height: 100,
		resizeMode: 'contain',
		marginTop: 100,
		alignSelf: 'center'
	},
})