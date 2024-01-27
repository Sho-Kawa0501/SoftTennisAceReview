import {
  createAsyncThunk,
} from '@reduxjs/toolkit'
import axios from 'axios'
import { AppDispatch } from 'app/store'
import { NewReviewSubmitData,EditReviewSubmitData } from 'types/reviewTypes'
import { Review } from 'types/types'


type AsyncThunkConfig = {
  state?: unknown
  dispatch?: AppDispatch
  extra?: unknown
  rejectValue?: unknown
  serializedErrorType?: unknown
}

type ToggleFavoriteParams = {
  reviewId: string
  isFavorite: boolean
}

export const fetchAsyncMyReview = createAsyncThunk<
  Review[],
  void,
  AsyncThunkConfig
>(
  'review/MyReview',
  async (_,{ rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("access_token") 
      if (!accessToken) {
        throw new Error("No access token available") 
      }
      const res = await axios.get<Review[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/myreview_list/`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'content-type': 'multipart/form-data',
          },
        }
      )
    return res.data
  } catch(error:any) {
    if (error.response.data) {
      return rejectWithValue(error.response.data)
    } else {
      return rejectWithValue(error)
    }
  }
}
)


export const fetchAsyncNewReview = createAsyncThunk<
  Review,
  NewReviewSubmitData,
  AsyncThunkConfig
>(
  'review/NewReview',
  async (newReview: NewReviewSubmitData,{ rejectWithValue }) => {
    const uploadData = new FormData()
    uploadData.append("title", newReview.title)
    uploadData.append("content", newReview.content)
    newReview.image && uploadData.append("image", newReview.image)
    const accessToken = localStorage.getItem("access_token")
    try {
      const res = await axios.post<Review>(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/review/create/${newReview.itemId}/`,
        uploadData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'content-type': 'multipart/form-data',
          },
        }
      )
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

export const fetchAsyncEditReview = createAsyncThunk<
  Review,
  EditReviewSubmitData,
  AsyncThunkConfig
>(
  'review/EditReview',
  async (editReview: EditReviewSubmitData,{ rejectWithValue }) => {
    const uploadData = new FormData()
    uploadData.append("title", editReview.title)
    uploadData.append("content", editReview.content)
    if (editReview.image !== null) {
      // 画像がある場合、その画像を追加
      editReview.image && uploadData.append("image", editReview.image) 
    } else {
      uploadData.append("image", "") 
    }
    const accessToken = localStorage.getItem("access_token")
    try {
      const res = await axios.patch<Review>(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/reviews/${editReview.reviewId}/`,
        uploadData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'content-type': 'multipart/form-data',
          },
        }
      )

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

export const fetchAsyncDeleteReview = createAsyncThunk<
  void,
  string,
  AsyncThunkConfig
>(
  'review/DeleteReview',
  async (reviewId: string,{ rejectWithValue }) => {
    const accessToken = localStorage.getItem("access_token") 
    try{
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/reviews/${reviewId}/`, 
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch(error:any) {
    if (error.response.data) {
      return rejectWithValue(error.response.data)
    } else {
      return rejectWithValue(error)
    }
  }}
)

export const fetchAsyncToggleFavorite = createAsyncThunk<
  boolean,
  ToggleFavoriteParams,
  AsyncThunkConfig
>(
  'favorites/ToggleFavorite',
  async ({reviewId, isFavorite,},{ rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("access_token") 
      const res = await axios({
        url: isFavorite ?  
          `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/review/set/${reviewId}/unfavorite/`
          : `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/review/set/${reviewId}/favorite/`,
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (isFavorite && res.status !== 204) {
        throw new Error('Failed to delete favorite')
      } else if (!isFavorite && !res.data) {
        throw new Error('Failed to create favorite')
      }
      return true
    } catch (error:any) {
      if (error.response.data) {
        return rejectWithValue(error.response.data)
      } else {
        return rejectWithValue(error)
      }
    }
  },
)