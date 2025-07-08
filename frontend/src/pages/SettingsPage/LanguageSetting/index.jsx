import React, { useState } from 'react'

const languages = [
    { code: 'en', label: 'English' },
    { code: 'af', label: 'Afrikaans' },
    { code: 'ar', label: 'العربية' },
    { code: 'cs', label: 'Čeština' },
    { code: 'da', label: 'Dansk' },
    { code: 'de', label: 'Deutsch' },
    { code: 'el', label: 'Ελληνικά' },
    { code: 'en-uk', label: 'English (UK)' },
    { code: 'es-es', label: 'Español (España)' },
    { code: 'es', label: 'Español' },
]

function LanguageSetting() {
    const [selected, setSelected] = useState('en')
    const [search, setSearch] = useState('')

    const filteredLanguages = languages.filter(lang =>
        lang.label.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='mx-auto w-full max-w-[700px] flex-grow px-12 py-12'>
            <div className='mb-12'>
                <h1 className='text-[20px] font-bold text-[--ig-primary-text]'>
                    Language preferences
                </h1>
                <div className='mt-2 font-semibold'>App language</div>
                <div className='text-sm text-gray-400'>
                    See buttons, titles, and other texts on Instagram in your
                    preferred language.
                </div>
            </div>
            <input
                className='mb-4 w-full rounded-md bg-[#232323] px-4 py-2 text-white outline-none'
                placeholder='Search'
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className='max-h-[400px] overflow-y-auto rounded-md bg-black'>
                {filteredLanguages.map(lang => (
                    <div
                        key={lang.code}
                        className='flex cursor-pointer items-center px-2 py-3 hover:bg-[#232323]'
                        onClick={() => setSelected(lang.code)}
                    >
                        <span className='flex-1'>{lang.label}</span>
                        <span className='ml-2'>
                            <input
                                type='radio'
                                checked={selected === lang.code}
                                onChange={() => setSelected(lang.code)}
                                className='accent-white'
                            />
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LanguageSetting
