import React,{useEffect} from 'react'
import { useSelector, useDispatch} from 'react-redux'
import { AppDispatch } from 'app/store'
import { Credential } from 'types/accountTypes'
import { 
  fetchAsyncLogin,
  fetchAsyncCheckAuth,
  selectIsAuthenticated,
} from 'features/account/accountSlice/'
import { fetchAsyncMyReview } from 'features/review/slice'
import Head from 'next/head'
import AccountSinginForm from 'components/organisms/AccountSigninForm'
import { setIsLogin } from 'features/account/accountSlice/'
import useNavigation from 'hooks/utils/useNavigation'
import { setIsButtonDisabled } from 'features/app/appSlice'


const Login = () => {
  const dispatch:AppDispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { handleHome } = useNavigation()
  if (isAuthenticated == true) {
    handleHome()
  }
  const onSubmit = async (credential: Credential) => {
    if(!credential) {
      return
    } 
    dispatch(setIsButtonDisabled(true))
    try {
    const result = await dispatch(fetchAsyncLogin(credential))
      if (fetchAsyncLogin.fulfilled.match(result)) {
        await dispatch(fetchAsyncCheckAuth())
        await dispatch(fetchAsyncMyReview())
        dispatch(setIsLogin())
        handleHome()
      }
    } catch(error){
      console.error("Login:"+error)
    } finally {
      dispatch(setIsButtonDisabled(false))
    }
  }

  return (
    <>
      <Head>
        <title>ログイン</title>
      </Head>
      <div className="text-center text-2xl mb-5">ログイン</div>
      <AccountSinginForm onSubmit={onSubmit} />
    </>
  )
}

export default Login