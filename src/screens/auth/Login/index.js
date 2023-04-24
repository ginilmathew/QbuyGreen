import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, ToastAndroid, } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CommonAuthBg from '../CommonAuthBg';
import CommonInput from '../../../Components/CommonInput';
import CommonAuthHeading from '../CommonAuthHeading';
import TermsAndPrivacyText from './TermsAndPrivacyText';
import CustomButton from '../../../Components/CustomButton';
import HelpAndSupportText from './HelpAndSupportText';
import CommonTexts from '../../../Components/CommonTexts';
import FastImage from 'react-native-fast-image'
import AuthContext from '../../../contexts/Auth';
import reactotron from '../../../ReactotronConfig';
import LoaderContext from '../../../contexts/Loader';
import customAxios from '../../../CustomeAxios';
import Toast from 'react-native-simple-toast';


const Login = ({ navigation }) => {

	const loginUser = useContext(AuthContext)
	const loadingg = useContext(LoaderContext)

	const [data, setData] = useState('')

	reactotron.log({data})

	let loader = loadingg?.loading

	const schema = yup.object({
		mobile: yup.string().required('Phone number is required').max(10, "Phone Number must be 10 digits").min(10, "Phone Number must be 10 digits"),
	}).required();

	const { control, handleSubmit, formState: { errors }, setValue } = useForm({
		resolver: yupResolver(schema)
	});

	const onSubmit = useCallback(async(data) => {
		// navigation.navigate('Otp')
		loginUser.setLogin(data)
		loadingg.setLoading(true)
		await customAxios.post(`auth/customerloginotp`, data)
        .then(async response => {
            setData(response?.data?.data)
            loadingg.setLoading(false)
			navigation.navigate('Otp')
        })
        .catch(async error => {
            Toast.showWithGravity(error, Toast.SHORT, Toast.BOTTOM);
            loadingg.setLoading(false)
        })
	}, [])


	return (
		<CommonAuthBg>
			<ScrollView style={{ flex: 1, paddingHorizontal: 40, }}>
				<FastImage
					style={styles.logo}
					source={require('../../../Images/pandaLogo.png')}
					resizeMode='contain'
				/>
				<CommonAuthHeading
					label={'Welcome'}
					mt={20}
				/>
				<CommonTexts
					label={'Sign in with your mobile for an OTP'}
					mt={2}
				/>
				<CommonInput
					leftElement
					control={control}
					error={errors.mobile}
					fieldName="mobile"
					placeholder='Mobile Number'
					inputMode={'numeric'}
					mt={40}
					backgroundColor='#fff'
					shadowOpacity={0.1}
					elevation={2}
				/>
				<TermsAndPrivacyText />

				<CustomButton
					onPress={handleSubmit(onSubmit)}
					bg='#58D36E'
					label={'Sign In'}
					mt={20}
					loading={loader}
				/>
				
				<Text style={styles.textStyle}>{"Need Support to Login?"}</Text>
				<HelpAndSupportText/>
			</ScrollView>

		</CommonAuthBg>
	)
}

export default Login

const styles = StyleSheet.create({

	logo: {
		width: 130,
		height: 130,
		marginTop:100,
		alignSelf: 'center',
	},
	textStyle:{
		fontFamily: 'Poppins-Light',
		color: '#8D8D8D',
		fontSize: 11,
		textAlign: 'center',
		marginTop:70
	}
	
})