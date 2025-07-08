const formatCaption = caption => {
    const formattedText = caption
        .replace(/(?:^|[\s\n])@(\w+)/g, (match, p1) => {
            return match.replace(
                `@${p1}`,
                `<a href="/profile/${p1}">@${p1}</a>`
            )
        })
        .replace(/(?:^|[\s\n])#(\w+)/g, (match, p1) => {
            return match.replace(
                `#${p1}`,
                `<a href="/hashtag/${p1}">#${p1}</a>`
            )
        })
        .replace(/\n/g, '<br/>')

    return formattedText
}

export default formatCaption
