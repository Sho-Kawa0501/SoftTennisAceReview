import React,{useEffect,useRef} from 'react'
import { useSelector, useDispatch ,shallowEqual} from 'react-redux'
import { AppDispatch, RootState } from 'app/store'
import { 
  fetchAsyncCheckAuth,
  selectIsAuthenticated,
  resetIsAuthenticated,
  fetchAsyncLogout,
} from 'features/account/accountSlice'
import { fetchAsyncMyReview } from 'features/review/slice'
import useNavigation from 'hooks/utils/useNavigation'

export const useAuthReload = () => {
  const dispatch:AppDispatch = useDispatch()
  const { handleAuthErrorPage } = useNavigation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  
  useEffect(() => {
    
    const fetchData = async () => {
      if (!isAuthenticated) {
        return
      }
      try {
        await dispatch(fetchAsyncMyReview())
        await dispatch(fetchAsyncCheckAuth())
        
      } catch (error) {
        dispatch(resetIsAuthenticated())
        dispatch(fetchAsyncLogout)
        handleAuthErrorPage()
      }
    }

    fetchData()
  }, [isAuthenticated])
}
