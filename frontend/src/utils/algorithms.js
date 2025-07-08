import emojiRegex from 'emoji-regex'

export const isOnlyEmojisAndSpaces = (text = '') => {
    const regex = emojiRegex()
    const withoutSpaces = text.replace(/\s+/g, '')

    const emojis = [...withoutSpaces.matchAll(regex)]

    const emojiOnly = emojis.map(m => m[0]).join('')
    return emojiOnly === withoutSpaces && emojiOnly.length > 0
}

export const groupMessages = messages => {
    if (!Array.isArray(messages) || messages.length === 0) return []

    const groups = []
    let currentGroup = []

    messages.forEach((message, index) => {
        let nextMessage = messages[index + 1]
        message.isFirstMessage = false
        message.isLastMessage = false
        message.isOnly = false

        const shouldStartNewGroup = () => {
            if (!nextMessage) return true

            const currentTimestamp = message.createdAt
                ? new Date(message.createdAt).getTime()
                : null
            const nextTimestamp = nextMessage.createdAt
                ? new Date(nextMessage.createdAt).getTime()
                : null

            if (!currentTimestamp || !nextTimestamp) return true

            const timeDiff = (currentTimestamp - nextTimestamp) / (1000 * 60)
            return nextMessage.sender !== message.sender || timeDiff > 1
        }

        if (shouldStartNewGroup()) {
            message.isFirstMessage = true
            if (currentGroup.length > 0) {
                if (currentGroup.length === 1) {
                    currentGroup[0].isOnly = true
                } else {
                    currentGroup[currentGroup.length - 1].isLastMessage = true
                }

                groups.push([...currentGroup])
            }
            currentGroup = [message]
        } else {
            currentGroup.push(message)
        }
    })

    if (currentGroup.length > 0) {
        if (currentGroup.length === 1) {
            currentGroup[0].isOnly = true
        } else {
            currentGroup[currentGroup.length - 1].isLastMessage = true
        }
        groups.push(currentGroup)
    }

    return groups
}

export const getFilterStyle = ({ filter, adjustments }) => {
    if (!adjustments || !filter?.filter) return ''

    const {
        brightness = 0,
        contrast = 0,
        saturation = 0,
        fade = 0,
        temperature = 0,
        vignette = 0,
    } = adjustments

    const defaultFilters = {
        brightness: parseFloat(filter.filter.brightness || '1'),
        contrast: parseFloat(filter.filter.contrast || '1'),
        saturate: parseFloat(filter.filter.saturate || '1'),
        sepia: parseFloat(filter.filter.sepia || '0'),
        'hue-rotate': parseFloat(filter.filter['hue-rotate'] || '0'),
    }

    const finalBrightness =
        brightness !== 0 ? 1 + brightness / 100 : defaultFilters.brightness
    const finalContrast =
        contrast !== 0 ? 1 + contrast / 100 : defaultFilters.contrast
    const finalSaturate =
        saturation !== 0 ? 1 + saturation / 100 : defaultFilters.saturate
    const finalSepia = fade !== 0 ? fade / 100 : defaultFilters.sepia
    const finalHueRotate =
        temperature !== 0 ? temperature : defaultFilters['hue-rotate']

    return `brightness(${finalBrightness}) contrast(${finalContrast}) saturate(${finalSaturate}) sepia(${finalSepia}) hue-rotate(${finalHueRotate}deg) drop-shadow(0 0 ${vignette}px rgba(0, 0, 0, 0.5))`
}