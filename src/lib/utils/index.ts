import axios from "axios"
import { useDispatch } from 'react-redux' 
import { AppDispatch, RootState } from 'app/store'
import useNavigation from "hooks/utils/useNavigation"
import { fetchAsyncLogout } from "features/account/accountSlice"

type HttpMethod = 'get' | 'post' | 'delete' | 'put'


export const useFetcherWithCredential = () => {
  const dispatch:AppDispatch = useDispatch()
  const { handleAuthErrorPage } = useNavigation() 

  const fetcherWithCredential = async (
    url: string,
    method: HttpMethod = 'get',
    data = null,
  ) => {
    const accessToken = localStorage.getItem("access_token")
    const config = {
      method,
      headers: {
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        'Content-Type': 'application/json'
      },
      data
    }

    try {
      const res = await axios(url, config)
      return res.data
    } catch (error:any) {
      console.error("fetcherWithCredential:", error)
      dispatch(fetchAsyncLogout())
      handleAuthErrorPage()
      throw error 
    }
  }
  return fetcherWithCredential 
}


export const convertFileToDataURL = (file: File, callback: (dataUrl: string) => void) => {
  let reader = new FileReader()
  reader.onloadend = () => {
    callback(reader.result as string)
  }
  reader.onerror = (error) => {
    console.error("convertFileToDataURL:"+error)
  }
  reader.readAsDataURL(file)
}
