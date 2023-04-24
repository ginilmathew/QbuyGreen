import { StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native'
import React from 'react'
import Navigation from './Navigations'
import PandaProvider from './contexts/Panda/PandaContext'
import AuthProvider from './contexts/Auth/AuthContext'
import { Provider } from 'react-redux'
import store from './Redux/store'
import LoadProvider from './contexts/Loader/loaderContext'
import Route from './Route'
import CartProvider from './contexts/Cart/CartContext'


const App = () => {

    
    
   

    return (
        <Provider store={store}>
            <LoadProvider>
                <AuthProvider>
                    <CartProvider>
                        <PandaProvider>
                            <Route />
                        </PandaProvider>
                    </CartProvider>
                </AuthProvider>
            </LoadProvider>
        </Provider>
    )
}

export default App

const styles = StyleSheet.create({})