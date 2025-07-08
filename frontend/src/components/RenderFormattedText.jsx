import { Fragment } from 'react'
import { Link } from 'react-router-dom'

function RenderFormattedText({ text }) {
    if (!text) return <></>
    const lines = text.split('\n')
    return lines.map((line, i) => (
        <Fragment key={i}>
            {parseLine(line)}
            {i < lines.length - 1 && <br />}
        </Fragment>
    ))
}

function parseLine(line) {
    const parts = []
    const regex = /(@\w+|#\w+|\S+|\s+)/g
    let match

    while ((match = regex.exec(line))) {
        const token = match[0]

        if (token.startsWith('@')) {
            const username = token.slice(1)
            parts.push(
                <Link
                    key={match.index}
                    to={`/${username}`}
                    className='text-[--ig-colors-button-borderless-text] hover:underline'
                >
                    {token}
                </Link>
            )
        } else if (token.startsWith('#')) {
            const tag = token.slice(1)
            parts.push(
                <Link
                    key={match.index}
                    to={`/hashtag/${tag}`}
                    className='text-[--ig-colors-button-borderless-text] hover:underline'
                >
                    {token}
                </Link>
            )
        } else {
            parts.push(<span key={match.index}>{token}</span>)
        }
    }

    return parts
}

export default RenderFormattedText
