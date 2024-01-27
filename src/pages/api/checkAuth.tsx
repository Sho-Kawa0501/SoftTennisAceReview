import axios from "axios"
import { GetServerSidePropsContext } from 'next' 

export const checkUserAuthentication = async (context: GetServerSidePropsContext) => {

  try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/auth/loginuser-information/`,)
    return res.data.isAccessAuthenticated
  } catch (error) {
    console.error('Error verifying JWT:', error)
    return false 
  }
}
