import axios from 'axios'
import { handleAxiosError } from 'lib/utils/HandleAxiosError'

type FavoriteReview = {
  isFavorite: boolean
  isError: any
}

export const fetchIsFavorite = async (reviewId: string): Promise<FavoriteReview> => {
  try {
    const accessToken = localStorage.getItem("access_token") 
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/review/${reviewId}/favorite/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
    })
    return { 
      isFavorite: res.data.isFavorite,
      isError: null 
    }
  } catch (error) {
    return { 
      isFavorite: false,
      isError: handleAxiosError(error)
    }
  }
}