import React,{useEffect,useLayoutEffect,useRef} from 'react'
import { useAuthReload } from 'hooks/account/useAuthReload'
import { selectIsAuthError } from 'features/app/appSlice'

interface ReloadProps {
  children: React.ReactNode
}

export const AuthProvider:React.FC<ReloadProps> = ({ children }) => {
  useAuthReload()

  return (
    <>{children}</>
  )
}

export default React.memo(AuthProvider)