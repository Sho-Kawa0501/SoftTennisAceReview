import React,{ useEffect } from 'react'
import { Provider,useSelector } from 'react-redux'
import { store,persistor } from '../app/store'
import { PersistGate } from 'redux-persist/integration/react'
import Layout from '../components/templates/Layout'
import { AuthProvider } from 'components/organisms/AuthProvider'
import '../styles/globals.css'
import { AppProps } from 'next/app'
import Modal from 'react-modal'




const MyApp = ({ Component, pageProps }:AppProps) => {
  console.log("MyApp Component Mounted")

  useEffect(() => {
    // Modalのルート要素を設定
    Modal.setAppElement('body')
  }, [])

  return (
  
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </PersistGate>
    </Provider>
   
  )
}

export default MyApp