'use strict'

const dev = {
    BUILD_MODE: 'dev',
    BASE_URL:
        import.meta.env.VITE_API_BASE_URL_LOCAL ||
        'http://localhost:5000/v1/api/',
    SOCKET_CHAT_URL:
        import.meta.env.VITE_API_SOCKET_CHAT_URL_LOCAL ||
        'http://localhost:5000',
    API_KEY_CHAT: import.meta.env.VITE_API_KEY_CHAT_LOCAL || '',
    VITE_PUBLIC_GETSTREAM_API_KEY: import.meta.env.VITE_PUBLIC_GETSTREAM_API_KEY_LOCAL || '',
}

const pro = {
    BUILD_MODE: 'pro',
    BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/v1/api/',
    SOCKET_CHAT_URL:
    import.meta.env.VITE_API_SOCKET_CHAT_URL || 'http://localhost:5000',
    API_KEY_CHAT: import.meta.env.VITE_API_KEY_CHAT || '',
    VITE_PUBLIC_GETSTREAM_API_KEY: import.meta.env.VITE_PUBLIC_GETSTREAM_API_KEY || '',
}

const BUILD_MODE = import.meta.env.VITE_BUILD_MODE || 'dev'
const config = { dev, pro }
const env = config[BUILD_MODE]

export default env
