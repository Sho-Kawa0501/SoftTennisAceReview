import React,{useMemo,useEffect,} from 'react'
import { useForm,FormProvider, } from 'react-hook-form'
import { AppDispatch } from 'app/store'
import { useDispatch,useSelector } from 'react-redux'
import TextInput from '../Atoms/TextInput'
import { Credential } from 'types/accountTypes'
import InputErrorMessage from '../Atoms/InputErrorMessage'
import AppButton from '../Atoms/AppButton'
import { resetIsAuthErrorMessage } from 'features/account/accountSlice'
import { selectAuthError } from 'features/account/accountSlice'
import useNavigation from 'hooks/utils/useNavigation'
import { selectIsButtonDisabled } from 'features/app/appSlice'

type AccountSigninFormProps = {
  onSubmit:(data:Credential) => void
}

const AccountSinginForm = React.memo(({onSubmit,} : AccountSigninFormProps) => {
  const dispatch:AppDispatch = useDispatch()
  //バリデーションエラーの表示をリセットするためのコード。現在他の方法を模索中
  useEffect(() => {
    dispatch(resetIsAuthErrorMessage())
  }, [])
  const isButtonDisabled = useSelector(selectIsButtonDisabled)
  const authError = useSelector(selectAuthError)
  const methods = useForm<Credential>()
  const {
    register,
    formState: {errors},
  } = methods

  const { handleHome } = useNavigation()

  return (
    <FormProvider {...methods}>
    <form className="w-1/3 mx-auto" onSubmit={methods.handleSubmit(onSubmit)}>
      {authError && 
        <InputErrorMessage errorMessage={authError} />
      }
      <div>
          {errors.email && 
            <InputErrorMessage errorMessage={errors.email.message || null} />
          }
        </div>
      <div className="mb-4"> 
        <TextInput
          label="メールアドレス"
          type="email"
          placeholder="xxx@xxx.com"
          {...register('email',{
            required: 'メールアドレスは必須です。'
          })}
        />
      </div>
      <div className="mb-4">
        <TextInput
          label="パスワード"
          type="password"
          placeholder="半角英数8文字以上"
          {...register('password',{
            required: 'パスワードは必須です',
            minLength: {
              value: 8,
              message: 'パスワードは8文字以上で入力してください'
            },
          })}
        />
        </div>
        <div>
          {errors.password && 
            <InputErrorMessage errorMessage={errors.password.message || null} />
          }
        </div>
      <div className="flex justify-center">
        <div>
          <AppButton text="送信" type={"submit"} color="blue" disabled={isButtonDisabled} />
          <AppButton text="戻る" type={"button"} color="blue" onClick={handleHome} />
        </div>
      </div>
    </form>
    </FormProvider>
  )
},)

AccountSinginForm.displayName = 'AccountSigninForm'
export default AccountSinginForm