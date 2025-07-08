import env from '@/configs/environment'
import axios from 'axios'
import Cookies from 'js-cookie'

const BASE_URL = env.VITE_API_BASE_URL

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
        'x-client-id': Cookies.get('client-id'),
    },
    withCredentials: true,
})
