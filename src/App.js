import { StyleSheet, Text, View, SafeAreaView, Platform, PermissionsAndroid } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import Navigation from './Navigations'
import PandaProvider from './contexts/Panda/PandaContext'
import AuthProvider from './contexts/Auth/AuthContext'
import { Provider } from 'react-redux'
import store from './Redux/store'
import LoadProvider from './contexts/Loader/loaderContext'
import Route from './Route'
import CartProvider from './contexts/Cart/CartContext'
import Toast from 'react-native-toast-message';
import AddressProvider from './contexts/Address/AddressContext'
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import RouteTest from './RouteText'
import reactotron from 'reactotron-react-native'
import notifee, { EventType } from '@notifee/react-native';


const App = () => {


	if (Platform.OS === 'ios') {
		//SplashScreen.hide()
	}
	async function onMessageReceived(message) {
		reactotron.log('msg', message)

		// const notiCount = await AsyncStorage.getItem("notifications");
		// if(notiCount){
		//     let newCount = parseInt(notiCount) + 1;
		//     await AsyncStorage.setItem("notifications", newCount.toString())
		//     store.dispatch({
		//         type: AUTH_INPUT,
		//         payload: {
		//             prop: 'notifications',
		//             value: newCount
		//         }
		//     })
		// }
		// else{
		//     store.dispatch({
		//         type: AUTH_INPUT,
		//         payload: {
		//             prop: 'notifications',
		//             value: 1
		//         }
		//     })
		// }
		// Request permissions (required for iOS)
		await notifee.requestPermission()

		// Create a channel (required for Android)
		const channelId = await notifee.createChannel({
			id: 'default',
			name: 'Default Channel',
		});
		// Display a notification
		await notifee.displayNotification({
			title: message?.notification?.title,
			body: message?.notification?.body,
			data: message?.data,
			android: {
				channelId,
				groupId: '123',
				smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
				// pressAction is needed if you want the notification to open the app when pressed
				pressAction: {
					id: 'default',
				},
			},
		});
	}

	useEffect(() => {
		const unsubscribe = messaging().onMessage(onMessageReceived);
		messaging().setBackgroundMessageHandler(onMessageReceived);
		// Check whether an initial notification is available
		messaging()
			.getInitialNotification()
			.then(remoteMessage => {
				if (remoteMessage) {
					reactotron.log({ remoteMessage })

				}
				//setLoading(false);
			});

		return unsubscribe;
	}, []);


	useEffect(() => {
		return notifee.onForegroundEvent(({ type, detail }) => {
			switch (type) {
				case EventType.DISMISSED:
					break;
				case EventType.PRESS:
					reactotron.log({ noti: detail.notification }, 'NOTIFICATION')

					break;
			}
		});
	}, []);

	async function requestUserPermission() {
		const authStatus = await messaging().requestPermission();
		const enabled =
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL;

		if (enabled) {
		}
	}

	useEffect(() => {
		getToken()
		if (Platform.OS === 'ios') {
			requestUserPermission()
		}
		else {
			PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
		}
	}, [])




	const getToken = async () => {
		reactotron.log("GOT FCM ")
		// Register the device with FCM
		if (Platform.OS === 'android') {
			await messaging().registerDeviceForRemoteMessages();
		}

		const token = await messaging().getToken();
		

		const user = await AsyncStorage.getItem("user");



		// if(user){
		//     let userDetails = JSON.parse(user)
		//     let data = {
		//         driver_id: userDetails?.id,
		//         push_token: token
		//     }
		//     customAxios.post('update-driver-push-token', data)
		//     .then(async response => {
		//     })
		//     .catch(async error => {
		//     })
		// }
		// if (user) {
		// 	let data = JSON.parse(user)
		// 	await customAxios.post(`auth/adddevicetoken`, {
		// 		id: data?._id,
		// 		token: token
		// 	})
		// 		.then(async response => {

		// 			//setLoading(false)
		// 		})
		// 		.catch(async error => {

		// 			//setLoading(false)

		// 		})
		// }




	}


	return (
		<Provider store={store}>
			<LoadProvider>
				<AuthProvider>
					<AddressProvider>
						<PandaProvider>
							<CartProvider>

								<RouteTest />
								<Toast
									position='bottom'
									bottomOffset={20}
								/>
							</CartProvider>
						</PandaProvider>
					</AddressProvider>
				</AuthProvider>
			</LoadProvider>
		</Provider>
	)
}

export default App

const styles = StyleSheet.create({})