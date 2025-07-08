import axios from 'axios'
import Cookies from 'js-cookie'

const BASE_URL = 'https://your-api-url.com'
const CLIENT_ID = Cookies.get('client-id')

export default axios.create({
    baseURL: BASE_URL,
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-client-id': CLIENT_ID,
    },
    withCredentials: true,
})
