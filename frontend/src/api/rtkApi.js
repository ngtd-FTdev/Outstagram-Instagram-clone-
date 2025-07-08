/* eslint-disable indent */
import env from '@/configs/environment'
import { createApi } from '@reduxjs/toolkit/query/react'
import axiosInstance from './axiosClient'

const axiosBaseQuery =
    ({ baseUrl } = { baseUrl: '' }) =>
    async (
        { url, method, data, params, headers = {}, userIdHeader },
        { getState }
    ) => {
        // Nếu endpoint có chỉ định userIdHeader: true thì lấy userId từ state và thêm vào header
        if (userIdHeader) {
            const { user } = getState().auth
            if (user._id) {
                headers['x-client-id'] = user._id
            }
        }
        try {
            const result = await axiosInstance({
                url: baseUrl + url,
                method,
                data,
                params,
                headers,
            })
            return { data: result.data }
        } catch (axiosError) {
            return {
                error: axiosError.response
                    ? axiosError.response.data
                    : axiosError.message,
            }
        }
    }

export const baseApi = createApi({
    baseQuery: axiosBaseQuery({ baseUrl: env.BASE_URL }),
    endpoints: () => ({}),
})
