import env from '@/configs/environment'
import { logout, setCredentials } from '@/redux/features/auth'
import axios from 'axios'
import { useDispatch } from 'react-redux'

const { BASE_URL, BUILD_MODE } = env
// Tạo Axios Instance
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Để gửi cookie với request
})

// Interceptor: Thêm Authorization Token
axiosInstance.interceptors.request.use(
    config => config,
    error => Promise.reject(error)
)

// Interceptor: Xử lý Refresh Token khi gặp lỗi 403 (Token hết hạn)
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                // Gửi request lấy token mới
                await axios.post(`${BASE_URL}/refresh`, null, {
                    withCredentials: true,
                })

                return axiosInstance(originalRequest)
            } catch (err) {
                const dispatch = useDispatch()
                dispatch(logout())
                return Promise.reject(err)
            }
        }

        if (error && BUILD_MODE === 'pro') {
            console.log('Lỗi::', error);
        }

        return Promise.reject(error)
    }
)

export default axiosInstance
