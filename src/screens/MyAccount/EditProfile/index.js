import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import CommonInput from '../../../Components/CommonInput'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
// import ChooseAddressType from '../MyAddresses/LocationScreen/AddDeliveryAddress/ChooseAddressType'
// import CommonTexts from '../../../Components/CommonTexts'
// import CommonSwitch from '../../../Components/CommonSwitch'
import AuthContext from '../../../contexts/Auth'
import CustomButton from '../../../Components/CustomButton'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import PandaContext from '../../../contexts/Panda'
import { launchImageLibrary } from 'react-native-image-picker';
import reactotron from '../../../ReactotronConfig';
import CartContext from '../../../contexts/Cart';
import customAxios from '../../../CustomeAxios';

const EditProfile = ({ navigation }) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    const cartContext = useContext(CartContext)


    const user = useContext(AuthContext)

    let userdata = user?.userData

    const [filePath, setFilePath] = useState(null);

    // reactotron.log({addr: cartContext?.defaultAddress?.area?.address})


    // const [isEnabled, setIsEnabled] = useState(false);
    // const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const schema = yup.object({
        name: yup.string().required('Name is required'),
        // area: yup.string().required('Area is required'),
        // address: yup.string().required('Address is required'),
        // pincode: yup.string().required('Pincode is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            mobile: userdata?.mobile,
            address : cartContext?.defaultAddress?.area?.address
        }
    });



    const onSubmit = useCallback(async(data) => {
        navigation.goBack()

        // const formData = new FormData();
        // formData.append('name', data?.name);
        // formData.append('address', data?.address);
       
        // if (filePath) {
        //     formData.append('image', {
        //         name: filePath?.assets?.[0]?.fileName,
        //         type: filePath?.assets?.[0]?.type,
        //         uri: filePath?.assets?.[0]?.uri
        //     });
        // }

        // await customAxios.post(`auth/patient/updateProfile`, formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //     }
        // })
        //     .then(async response => {

        //     })
        //     .catch(async error => {
               
        //     });

    }, [])


    const imageGalleryLaunch = useCallback(() => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchImageLibrary(options, (res) => {

            setFilePath(res)

            if (res.didCancel) {
                // console.log('User cancelled image picker');
            } else if (res.error) {
                setFilePath(null)
            } else if (res.customButton) {
                // console.log('User tapped custom button: ', res.customButton);
                // alert(res.customButton);
            } else {
                setFilePath(res)
            }
        });
    }, [])

    return (

        <>
            <HeaderWithTitle
                title={'Edit Profile'}
            // onPress={mode === 'header' ?}
            />


            <ScrollView style={{ paddingHorizontal: 30, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff',  }}>

                    <View style={{alignSelf:'center'}}>
                        <Image
                            style={styles.image}
                            source={filePath ? {uri: filePath?.assets?.[0]?.uri} : require('../../../Images/drawerLogo.png')}
                        />
                        <TouchableOpacity 
                            onPress={imageGalleryLaunch}
                            style={{width:25, height:25, borderRadius:15, backgroundColor: active === "green" ? '#8ED053' : active === "fashion" ? '#FF7190' : '#58D36E', alignItems:'center', justifyContent:'center', alignSelf:'flex-end', marginTop:-25}}
                        >
                            <MaterialIcons name='photo-camera' size={15} color='#fff'/>
                        </TouchableOpacity>
                    </View>
                <CommonInput
                    control={control}
                    error={errors.name}
                    fieldName="name"
                    topLabel={'Name'}
                    top={10}
                />
                <CommonInput
                    control={control}
                    error={errors.address}
                    fieldName="address"
                    topLabel={'Address'}
                    top={10}
         
                />
                <CommonInput
                    control={control}
                    error={errors.mobile}
                    fieldName="mobile"
                    topLabel={'Phone Number'}
                    top={10}
                    editable={false}
                />

                {/* <View style={styles.headerView}>
                        <View style={{ flexDirection: 'row' }}>
                            {datas.map((item, index) =>
                                <ChooseAddressType
                                    item={item}
                                    key={index}
                                    selected={selected}
                                    setSelected={setSelected}
                                    color='#58D36E'
                                />
                            )}
                        </View>
                        <View>
                            <CommonTexts label={'Default'} fontSize={12} />
                            <CommonSwitch isEnabled={isEnabled} toggleSwitch={toggleSwitch} color={'#58D36E'}/>
                        </View>
                    </View>

                    <CommonInput
                        control={control}
                        error={errors.area}
                        fieldName="area"
                        backgroundColor='#fff'
                        topLabel={'Area'}
                        top={10}
                        shadowOpacity={0.1}
                        elevation={2}
                    />

                    <CommonInput
                        control={control}
                        error={errors.address}
                        fieldName="address"
                        backgroundColor='#fff'
                        topLabel={'Address'}
                        top={10}
                        shadowOpacity={0.1}
                        elevation={2}
                    />
                    <CommonInput
                        control={control}
                        error={errors.comments}
                        fieldName="comments"
                        backgroundColor='#fff'
                        topLabel={'Comments'}
                        top={10}
                        shadowOpacity={0.1}
                        elevation={2}
                    />
                    <CommonInput
                        control={control}
                        error={errors.pincode}
                        fieldName="pincode"
                        backgroundColor='#fff'
                        topLabel={'Pincode'}
                        top={10}
                        shadowOpacity={0.1}
                        elevation={2}
                    /> */}

                <CustomButton
                    label={'Submit'}
                    bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#5871D3'}
                    my={30}
                    onPress={handleSubmit(onSubmit)}
                />
            </ScrollView>


        </>


    )
}

export default EditProfile

const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 20,
        borderRadius: 50
    },
})