import { useRouter } from 'next/router'

const useNavigation = () => {
  const router = useRouter()

  // navigateTo関数は指定されたパスに遷移
  const navigateTo = (path: string): void => {
    router.push(path)
  }

  // 前のページに遷移
  const handleBack = (): void => {
    router.back()
  }

  const handleHome = (): void => {
    router.push('/')
  }

  const handleAuthErrorPage = (): void => {
    router.push('/auth-error')
  }

  return {
    navigateTo,
    handleBack,
    handleHome,
    handleAuthErrorPage,
  }
}

export default useNavigation