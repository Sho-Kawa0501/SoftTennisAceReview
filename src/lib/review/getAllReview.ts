import React from 'react'
import { Review } from 'types/types'
import axios from 'axios'

type GetReviewProps = {
  itemId: number
  initial?: Review[]
}

type GetReview = {
  review: Review[] | undefined
  isError: any
}

const getAllReview = async (
  { itemId, initial }: GetReviewProps
): Promise<GetReview> => {
  try {
    const res = await axios.get<Review[]>(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/review_list/${itemId}/`, {
    })

    return {
      review: res.data ?? initial,
      isError: null,
    } 
  } catch (error) {
    return {
      review: initial,
      isError: error,
    } 
  }
} 

export default getAllReview