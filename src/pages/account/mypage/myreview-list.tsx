import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import Head from 'next/head'
import { AppDispatch } from 'app/store'
import ReviewDeleteModal from 'components/templates/ReviewDeleteModal'
import MyReviewCard from 'components/organisms/MyReviewCard'
import { useAuthGuard } from 'hooks/auth'
import useSWR from 'swr'
import { useFetcherWithCredential } from 'lib/utils'
import { useAlertReviewMessage } from 'hooks/review/useAlertReviewMessage'
import AlertMessage from 'components/Atoms/AlertMessage'
import AppButton from 'components/Atoms/AppButton'
import useNavigation from 'hooks/utils/useNavigation'
import DeleteReviewButton from 'components/Atoms/DeleteReviewButton'
import { selectIsButtonDisabled } from 'features/app/appSlice'


const MyReviewList= () => {
  useAuthGuard()
  const dispatch: AppDispatch = useDispatch()
  const fetcherWithCredential = useFetcherWithCredential() 
  const { showMessage } = useAlertReviewMessage()
  const isButtonDisabled = useSelector(selectIsButtonDisabled)
  const { navigateTo } = useNavigation()
  const handleMyPage = () => navigateTo("/account/mypage/")
  const { data: reviews = [], mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/myreview_list/`,
    (url: string) => fetcherWithCredential(url,'get'))
 
  return (
    <>
      <Head>
        <title>マイレビューリスト</title>
      </Head>
      {showMessage.show && 
        <AlertMessage message={showMessage.message} color={showMessage.color} />
      }
      <AppButton text="マイページに戻る" type="button" onClick={handleMyPage} color="blue" />
      <div className="text-sm space-y-4">
        {reviews.map((review) => (
          <div key={review.id}>
            <MyReviewCard review={review} />     
            <div>
              <Link href={`/review/${review.id}/edit`}>
                <AppButton type={"submit"} color="blue" disabled={isButtonDisabled}>
                  編集                
                </AppButton>
              </Link>
              <DeleteReviewButton reviewId={review.id} />
            </div>
          </div>
        ))}
      </div>
      <ReviewDeleteModal />
    </>
  )
}

export default MyReviewList