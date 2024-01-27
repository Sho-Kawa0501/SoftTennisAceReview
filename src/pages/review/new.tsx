import React, { useState,useCallback } from 'react'
import { NextPage } from 'next'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from 'app/store'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { fetchAsyncNewReview,fetchAsyncMyReview } from 'features/review/slice/actions'
import { useForm,FormProvider,SubmitHandler } from 'react-hook-form'
import ReviewForm from 'components/organisms/ReviewForm'
import { useAuthGuard } from 'hooks/auth'
import { ReviewInputData } from 'types/reviewTypes'
import { setIsNewReview } from 'features/review/slice'
import { NewReviewSubmitData } from 'types/reviewTypes'
import useNavigation from 'hooks/utils/useNavigation'
import { setIsButtonDisabled } from 'features/app/appSlice'

const NewReview = () => {
  const dispatch: AppDispatch = useDispatch()
  const router = useRouter()
  const { navigateTo } = useNavigation()
  const itemId = parseInt(router.query.itemId as string)
  const methods = useForm<ReviewInputData>()
  
  useAuthGuard()

  const onSubmit:SubmitHandler<NewReviewSubmitData> = useCallback(async (data) => {
    if (!data || !itemId) {
      return
    }
    dispatch(setIsButtonDisabled(true))
    const submitData:NewReviewSubmitData = {
      itemId: itemId,
      title:data.title,
      content:data.content,
      image:data.image
    }
    try {
      const resultAction = await dispatch(fetchAsyncNewReview(submitData))
      if (fetchAsyncNewReview.fulfilled.match(resultAction)) {
        dispatch(fetchAsyncMyReview())
        dispatch(setIsNewReview())
        if (router.query.itemId) {
          navigateTo(`/review/review-list/${itemId}?alert=success_new`)
        }
      }
    } catch(error) {
      console.error("NewReview:"+error)
    } finally {
      dispatch(setIsButtonDisabled(false))
    }
  },[itemId])

  return (
    <>
    <div>
      <Head>
        <title>レビュー投稿</title>
      </Head>
      <div className="text-center text-2xl mb-5">レビュー投稿</div>
      <FormProvider {...methods}>
        <ReviewForm onSubmit={onSubmit} />
      </FormProvider>
    </div>
    </>
  )
}

export default NewReview