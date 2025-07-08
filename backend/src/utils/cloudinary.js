import { v2 as cloudinary } from 'cloudinary'

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CD,
    api_secret: process.env.API_SECRET_CD,
})

export default cloudinary
