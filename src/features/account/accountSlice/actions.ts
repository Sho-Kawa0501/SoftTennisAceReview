import { 
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import axios,{ AxiosError } from 'axios'
import { AppDispatch} from 'app/store'
import { LoginUserInfo } from 'types/types'
import { handleAxiosError } from 'lib/utils/HandleAxiosError'
import { Credential,ProfileSubmitData } from 'types/accountTypes'

type AsyncThunkConfig = {
  state?: unknown
  dispatch?: AppDispatch
  extra?: unknown
  rejectValue?: any
  serializedErrorType?: unknown
}

export interface AuthToken {
  access_token: string 
  refresh_token: string 
}

type AuthResponse = LoginUserInfo | { error: string } | string

export const fetchAsyncLogin = createAsyncThunk<
  AuthToken,
  Credential,
  AsyncThunkConfig
  >(
    'account/Login',
    async (auth:Credential,{ rejectWithValue }) => {
      try {
      const res = await axios.post<AuthToken>(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/auth/login/`, 
        auth,
        {
          headers: {
            'Content-Type':'application/json',
          },
        }
      )
      localStorage.setItem("access_token", res.data.access_token) 
      localStorage.setItem("refresh_token", res.data.refresh_token) 
      return res.data
    } catch (error:any) {
      if (error.response.data) {
        return rejectWithValue(error.response.data)
      } else {
        return rejectWithValue(error)
      }
    }
  }
)

export const fetchAsyncRegister = createAsyncThunk<
  { data: Credential },
  Credential,
  AsyncThunkConfig
  >(
  'account/Register',
  async (auth:Credential,{ rejectWithValue }) => {
    try {
    const res = await axios.post<{ data: Credential }>(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/auth/register/`, 
      auth,
      {
      headers: {
        'Content-Type':'application/json',
      },
    },
  )
    return res.data
  } catch(error:any) {
    if (error.response.data) {
      return rejectWithValue(error.response.data)
    } else {
      return rejectWithValue(error)
    }
  }
})

export const fetchAsyncCheckAuth = createAsyncThunk<
  AuthResponse,
  void
>(
  'account/CheckAuth',
  async (_, { dispatch, rejectWithValue }) => {
    const accessToken = localStorage.getItem("access_token") 
    const refreshToken = localStorage.getItem("refresh_token") 
    try {
      if (!accessToken) {
        throw new Error("No access token available") 
      }
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/auth/check-auth/`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      )
      return res.data
    } catch (error: any) {
      if (error.response && error.response.status === 401 && refreshToken) {
        try {
          const refreshRes = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/auth/refresh/`,
            { refresh: refreshToken }
          )
          localStorage.setItem("access_token", refreshRes.data.access)
          return dispatch(fetchAsyncCheckAuth())
        } catch (refreshError) {
          dispatch(fetchAsyncLogout())
          return rejectWithValue(refreshError.response.data)
        }
      } else {
        dispatch(fetchAsyncLogout())
        return rejectWithValue(error.message || "An error occurred")
      }
    }
  }
)

export const fetchAsyncGetRefreshToken = createAsyncThunk<
  {refresh: string },
  void,
  AsyncThunkConfig
> (
  'account/Refresh',
  async (_,{rejectWithValue}) => {
  try {
    const res = await axios.get<{refresh:string}>(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/auth/get-refresh-token/`,{
  })
  return res.data
  } catch(error:any) {
    if (error.response.data) {
      return rejectWithValue(error.response.data)
    } else {
      return rejectWithValue(error)
    }
  }
})


export const fetchAsyncLogout = createAsyncThunk<
  string,
  void,
  AsyncThunkConfig
>(
  'account/Logout',
  async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token")
      localStorage.removeItem("access_token") 
      localStorage.removeItem("refresh_token") 
      const res = await axios.post<string>(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/auth/logout/`,
        {
          headers: {
            'Authorization': `Bearer ${refreshToken}` ,
            'Content-Type':'application/json',
          },
        },
      )
      return res.data
    } catch (error:any) {
      console.error(error)
    }
  }
)

export const fetchAsyncDeleteUser = createAsyncThunk<
  string,
  void,
  AsyncThunkConfig
>(
  'account/Delete',
  async (_,{dispatch,rejectWithValue }) => {
    const accessToken = localStorage.getItem("access_token")
    try {
      if (!accessToken) {
        throw new Error("No access token available") 
      }
      const res = await axios.delete<string>(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/auth/user/delete/`,  
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type':'application/json',
          },
        },
      )
    if (res.status === 204) {
      dispatch(fetchAsyncLogout()) 
    }
    return res.data
    } catch (error:any) {
      if (error.response.data) {
        return rejectWithValue(error.response.data)
      } else {
        return rejectWithValue(error)
      }
    }
  }
)

export const fetchAsyncEditProfile = createAsyncThunk<
  ProfileSubmitData,
  ProfileSubmitData,
  AsyncThunkConfig
>(
  'account/EditProfile',
  async (newProfile:ProfileSubmitData,{rejectWithValue }) => {
    const uploadData = new FormData()
    uploadData.append("name", newProfile.name)   
    if (newProfile.image !== null) {
      uploadData.append("image", newProfile.image) 
    } else {
      uploadData.append("image", "")
    }
    const accessToken = localStorage.getItem("access_token")
    try {
      const res = await axios.patch<ProfileSubmitData>(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/auth/users/${newProfile.id}/`,
        uploadData, 
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'content-type': 'multipart/form-data',
          },
        },
      )
      return res.data
    } catch (error:any) {
      return rejectWithValue(error)
    }
  }
)
