import React,{ useState,useEffect,useMemo,useContext,useRef } from 'react'
import { useSelector, useDispatch,} from 'react-redux'
import { 
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import axios from 'axios'
import { AppDispatch,RootState } from 'app/store'
import { 
  getItemDetail,
  getItemIds
}from 'lib/item'
import { fetchAsyncMyReview } from 'features/review/slice'
import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'
import { Item } from 'types/itemTypes'
import { PencilAltIcon } from '@heroicons/react/outline'
import ReviewDeleteModal from 'components/templates/ReviewDeleteModal'
import ItemDetail from 'components/molecules/ItemDetailCard'
import ReviewCard from 'components/molecules/ReviewCard'
import ReviewCardList from 'components/organisms/ReviewCardList'
import { AlertMessage } from 'components/Atoms/AlertMessage'
import { useAlertReviewMessage } from 'hooks/review/useAlertReviewMessage'
import { selectLoginUser,selectIsAuthenticated } from 'features/account/accountSlice'
import { selectItems } from 'features/item/itemSlice'
import AppButton from 'components/Atoms/AppButton'
import useNavigation from 'hooks/utils/useNavigation'
import { Review } from 'types/types'
import { useFetcherWithCredential } from 'lib/utils'
import DeleteReviewButton from 'components/Atoms/DeleteReviewButton'
import { selectIsDeleteReview } from 'features/review/slice'
import { selectIsButtonDisabled } from 'features/app/appSlice'

type ReviewPageProps = InferGetStaticPropsType<typeof getStaticProps>

export const ReviewListPage: NextPage<ReviewPageProps> = ({itemId,itemDetail,reviews: ssgReviews}) => {
  const loginUser = useSelector(selectLoginUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isDeleteReview = useSelector(selectIsDeleteReview)
  const isButtonDisabled = useSelector(selectIsButtonDisabled)
  const fetcherWithCredential = useFetcherWithCredential()
  const { showMessage } = useAlertReviewMessage()
  const { data: swrReviews, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/review_list/${itemId}/`,
    (url: string) => fetcherWithCredential(url,'get'))

  useEffect(() => {
    console.log("mutate")
    mutate()
  },[isDeleteReview])
  
  const reviews = swrReviews || ssgReviews

  console.log("SWRreview"+swrReviews)

  const [loginUserReview, otherUserReviews] = useMemo((): [Review | undefined, Review[] | undefined] => {
    if (loginUser && isAuthenticated) {
      // ログインしている場合、reduceを使用してレビューを分類する
      return reviews.reduce(
        ([userReview, others]: any, review: { user: { id: string } }) => {
          if (review.user.id === loginUser.id) {
            return [review, others]
          }
          return [userReview, [...others, review]]
        },
        [undefined, []]
      )
    } else {
      return [undefined, reviews]
    }
  }, [reviews, loginUser, isAuthenticated])
  console.log("Login User Review:", loginUserReview)
  console.log("Other User Reviews:", otherUserReviews)

  const { handleHome } = useNavigation()

  if (!isAuthenticated) {
    return (
      <>
        <Head><title>レビューリスト</title></Head>
        {showMessage.show && (
          <AlertMessage message={showMessage.message} color={showMessage.color} />
        )}
        <AppButton text="ホームに戻る" type="button" onClick={handleHome} color="blue" />
        <ItemDetail item={itemDetail} />
        <div className="col-span-2">
          <ReviewCardList reviews={otherUserReviews} />
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>レビューリスト</title>
      </Head>
      {showMessage.show && (
        <AlertMessage message={showMessage.message} color={showMessage.color} />
      )}
      <AppButton text="ホームに戻る" type="button" onClick={handleHome} color="blue" />
      {itemDetail && <ItemDetail item={itemDetail} />}
      {isAuthenticated && (
        <>
          {loginUserReview && loginUserReview.id ? (
            <>
              <p>自分のレビュー</p>
              <ReviewCard review={loginUserReview} />
              <div>
                {loginUser && loginUser.id === loginUserReview.user.id && (
                  <div className="text-sm flex space-x-1">
                    <Link href={`/review/${loginUserReview.id}/edit?itemId=${itemId}`}>
                      <AppButton type={"submit"} color="blue" disabled={isButtonDisabled}>
                        編集
                      </AppButton>
                    </Link>
                    <DeleteReviewButton reviewId={loginUserReview.id} />
                  </div>
                )}
              </div>
              <ReviewDeleteModal />
            </>
          ) : (
            <div className="flex justify-center mb-4">
              <Link href={`/review/new?itemId=${itemId}`}>
                <div className="inline-flex items-center border rounded-md p-4 hover:bg-gray-100 hover:scale-110 transition-transform duration-300">
                  <PencilAltIcon className="h-7 w-7"/>
                  <span className="text-base sm:text-2xl ml-2">新規投稿</span>
                </div>
              </Link>
            </div>
          )}
          <div className="col-span-2">
            <div className="col-span-2">
              <ReviewCardList reviews={otherUserReviews}/>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ReviewListPage

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getItemIds()
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params } :GetStaticPropsContext) => {
  if (!params) {
    throw new Error("params is undefined")
  }

  const itemId = Number(params.itemId)
  const reviewsData = await axios.get<Review[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/review_list/${itemId}/`,
  )
  //getItemDetailを発動
  const itemData = await axios.get<Review[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/item/item_detail/${itemId}/`,
  )
  
  return {
    props: {
      itemId:itemId,
      itemDetail:itemData.data,
      reviews: reviewsData.data
    },
    revalidate: 8,
  }
}