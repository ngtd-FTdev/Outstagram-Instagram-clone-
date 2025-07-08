import { axiosPrivate } from '@/api/customAxios1/axios'
import refreshToken from '@/redux/features/refreshToken'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useAxiosPrivate = () => {
    const auth = useSelector(state => state.auth)

    useEffect(() => {
        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async error => {
                const prevRequest = error?.config
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true
                    const newAccessToken = await refreshToken
                    prevRequest.headers['Authorization'] =
                        `Bearer ${newAccessToken}`

                    return axiosPrivate(prevRequest)
                }
            }
        )

        return () => {
            axiosPrivate.interceptors.response.eject(responseInterceptor)
        }
    }, [auth])
}
