import { useState } from 'react'

const SeeTranslation = ({
    originalText,
    sourceLang = 'auto',
    targetLang = 'en',
}) => {
    const [translatedText, setTranslatedText] = useState(null)
    const [showTranslation, setShowTranslation] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleTranslate = async () => {
        if (translatedText) {
            setShowTranslation(prev => !prev)
            return
        }
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(
                'https://libretranslate.de/translate',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        q: originalText,
                        source: sourceLang,
                        target: targetLang,
                        format: 'text',
                    }),
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            setTranslatedText(data.translatedText)
            setShowTranslation(true)
        } catch (err) {
            console.error(err)
            setError('Translation failed.')
        }
        setLoading(false)
    }

    return (
        <div>
            <p>{originalText}</p>
            {loading && <p>Translating...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {showTranslation && translatedText && (
                <p style={{ fontStyle: 'italic' }}>{translatedText}</p>
            )}
            <button
                onClick={handleTranslate}
                style={{
                    border: 'none',
                    background: 'none',
                    color: '#3897f0',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                }}
            >
                {showTranslation ? 'Hide translation' : 'See translation'}
            </button>
        </div>
    )
}

export default SeeTranslation
