import { StyleSheet, ToastAndroid } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useDispatch, useSelector } from 'react-redux';
import { navigationRef } from './RootNavigation';
import Login from '../screens/auth/Login';
import Otp from '../screens/auth/Otp';
import Menu from './Menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import reactotron from '../ReactotronConfig';
import AuthContext from '../contexts/Auth';
import customAxios from '../CustomeAxios';
import LoaderContext from '../contexts/Loader';


// import Menu from './Menu';


const Stack = createNativeStackNavigator();

const Navigation = () => {

    const userContext = useContext(AuthContext)
	const loadingg = useContext(LoaderContext)

    const [initialScreen, setInitialScreen] = useState(null)


    useEffect(() => {
        checkLogin();
    }, [])
    const checkLogin =  async() => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            const user = await AsyncStorage.getItem("user");
            if (user) {
                let userdata = JSON.parse(user)
                reactotron.log({ userdata })
                await customAxios.get(`customer/customer-profile`)
                .then(async response => {
                    // setData(response?.data?.data)
                    userContext.setUserData(response?.data?.data)
                    loadingg.setLoading(false)
                })
                .catch(async error => {
                    ToastAndroid.showWithGravity(
                        error,
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                    )
                    loadingg.setLoading(false)
                })

                
                setInitialScreen('Menu');
            }
            else {
                setInitialScreen('Login');
            }
        }
        else {
            setInitialScreen('Login');
        }
    }
    if (!initialScreen) {
        return (
            <SplashScreen />
        )
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>

                <Stack.Screen name="SplashScreen" component={SplashScreen} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Otp" component={Otp} />

                <Stack.Screen name="Menu" component={Menu} />


                {/* <Stack.Screen name="Menu" component={Menu} /> */}
                {/* <Stack.Screen name="ViewPdf" component={ViewPdf} options={{
                    presentation: 'containedTransparentModal'
                }} />
                <Stack.Screen name='notifications' component={Notifications} /> */}


            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation

const styles = StyleSheet.create({})