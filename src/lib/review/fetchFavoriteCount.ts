import useSWR from 'swr'
import axios from 'axios'
import { handleAxiosError } from 'lib/utils/HandleAxiosError'

type FavoriteReview = {
  favoriteCounts: number
  isError: any
}

export const fetchFavoriteCount = async (reviewId: string): Promise<FavoriteReview> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/review/favorites_count/${reviewId}/`,)
    return { 
      favoriteCounts: res.data.favorites_count,
      isError: null
    }
  } catch (error) {
    return { 
      favoriteCounts: 0,
      isError: handleAxiosError(error)
    }
  }
}