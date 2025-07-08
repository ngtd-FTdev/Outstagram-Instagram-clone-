import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { useSelector } from 'react-redux'
import StreamVideoProvider from './providers/StreamClientProvider'
import { Fragment } from 'react'
import { AnimatePresence } from 'framer-motion'
import AuthCheck from './components/AuthCheck'
import { publicRoutes } from './routes'
import RequireAuth from './components/RequireAuth'

const renderRoutes = routes =>
    routes.map((route, index) => {
        const Layout = route.layout || Fragment
        const RequireAuthComponent = route.requireAuth ? RequireAuth : Outlet
        const Page = route.component

        return (
            <Route key={index} element={<RequireAuthComponent />}>
                <Route
                    path={route.path}
                    element={
                        <Layout {...(Layout !== Fragment && { option: route })}>
                            <Page />
                        </Layout>
                    }
                >
                    {route.children && renderRoutes(route.children)}
                </Route>
            </Route>
        )
    })

function App() {
    const location = useLocation()
    const user = useSelector(state => state.auth.user)
    const GetStreamVideoProvider = user?._id ? StreamVideoProvider : Fragment

    return (
        <QueryParamProvider adapter={ReactRouter6Adapter}>
            <AnimatePresence mode='wait'>
                <AuthCheck>
                    <GetStreamVideoProvider>
                        <Routes location={location} key={location.pathname}>
                            {renderRoutes(publicRoutes)}
                        </Routes>
                    </GetStreamVideoProvider>
                </AuthCheck>
            </AnimatePresence>
        </QueryParamProvider>
    )
}

export default App
