import { useEffect } from 'react'
import { useCheckAuthMutation } from '@/api/slices/authApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/redux/features/auth'

const AuthCheck = ({ children }) => {
    const [checkAuth] = useCheckAuthMutation()

    const dispatch = useDispatch()

    const auth = useSelector(state => state.auth)

    useEffect(() => {
        const checkUserAuth = async () => {
            if (auth?.user && auth?.token) {
                try {
                    const result = await checkAuth()
                    if (result.error) {
                        dispatch(logout())
                    }
                } catch (error) {
                    dispatch(logout())
                }
            }
        }

        checkUserAuth()
    }, [checkAuth])

    return children
}

export default AuthCheck
