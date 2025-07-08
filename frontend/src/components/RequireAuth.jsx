import Access from '@/pages/Home/Access'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

const RequireAuth = () => {
    const auth = useSelector(state => state.auth)

    return auth?.user && auth?.token ? <Outlet /> : <Access />
}

export default RequireAuth
