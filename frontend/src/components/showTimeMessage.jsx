function ShowTimeMessage({ value, locale = 'en' }) {
    const formatTime = (date, locale) => {
        const d = new Date(date)
        const now = new Date()

        const isSameDay =
            d.getDate() === now.getDate() &&
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()

        const hours = d.getHours().toString().padStart(2, '0')
        const minutes = d.getMinutes().toString().padStart(2, '0')

        if (isSameDay) {
            switch (locale) {
                case 'vi':
                    return `${hours}:${minutes}`
                case 'en':
                    return d.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                    })
                case 'fr':
                    return d.toLocaleTimeString('fr-FR', {
                        hour: 'numeric',
                        minute: '2-digit',
                    })
                case 'ja':
                    return d.toLocaleTimeString('ja-JP', {
                        hour: 'numeric',
                        minute: '2-digit',
                    })
                case 'zh':
                    return d.toLocaleTimeString('zh-CN', {
                        hour: 'numeric',
                        minute: '2-digit',
                    })
                default:
                    return d.toLocaleTimeString(locale, {
                        hour: 'numeric',
                        minute: '2-digit',
                    })
            }
        } else {
            switch (locale) {
                case 'vi': {
                    const day = d.getDate()
                    const month = d.getMonth() + 1
                    const year = d.getFullYear()
                    return `${hours}:${minutes} ${day} Tháng ${month}, ${year}`
                }
                case 'en':
                    return d.toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour12: true,
                    })

                case 'fr':
                    return d.toLocaleString('fr-FR', {
                        hour: 'numeric',
                        minute: '2-digit',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })

                case 'ja':
                    return d.toLocaleString('ja-JP', {
                        hour: 'numeric',
                        minute: '2-digit',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })

                case 'zh':
                    return d.toLocaleString('zh-CN', {
                        hour: 'numeric',
                        minute: '2-digit',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })

                default:
                    return d.toLocaleString(locale, {
                        hour: 'numeric',
                        minute: '2-digit',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })
            }
        }
    }

    return (
        <div className='flex flex-grow items-center justify-center px-5 py-4'>
            <p className='text-xs text-[--placeholder-text]'>
                {formatTime(value, locale)}
            </p>
        </div>
    )
}

export default ShowTimeMessage
