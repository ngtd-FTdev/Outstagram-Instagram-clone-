import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Loading from './pages/Loading/index.jsx'
import { persistor, store } from './redux/store.js'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from './components/ui/sonner'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

const App = lazy(() => import('./App.jsx'))

createRoot(document.getElementById('root')).render(
    // <StrictMode>
        <Suspense fallback={<Loading />}>
            <HelmetProvider>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                        <Toaster theme='system' />
                    </PersistGate>
                </Provider>
            </HelmetProvider>
        </Suspense>
    /*</StrictMode>*/
)
