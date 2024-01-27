import React from 'react'
import { Review } from 'types/types'
import useSWR from 'swr'
import { useFetcherWithCredential } from 'lib/utils'
import { handleAxiosError } from 'lib/utils/HandleAxiosError'

type UseReviewProps = {
  initial?: Review[]
}

type UseReview = {
  review: Review[] | undefined
  isError: any
}

const useFavoriteReview = (): UseReview => {
  const fetcherWithCredential = useFetcherWithCredential() 
  const { data, error } = useSWR<Review[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/favorite_list/`,
    (url: string) => fetcherWithCredential(url,'get'))

  return {
    review: data,
    isError: error ? handleAxiosError(error) : null,
  }
}

export default useFavoriteReview