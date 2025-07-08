import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

function ErrorPage({ error, resetErrorBoundary }) {
    const navigate = useNavigate();

    return (
        <div className={styles['error-page']}>
            <div className={styles['error-content']}>
                <h1>Oops! Something went wrong</h1>
                <p>We&apos;re sorry, but something went wrong. Please try again later.</p>
                {error && (
                    <details className={styles['error-details']}>
                        <summary>Error Details</summary>
                        <pre>{error.toString()}</pre>
                    </details>
                )}
                <div className={styles['error-actions']}>
                    <button 
                        onClick={() => window.location.reload()}
                        className={`${styles['error-button']} ${styles['primary']}`}
                    >
                        Reload Page
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className={`${styles['error-button']} ${styles['secondary']}`}
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage; 