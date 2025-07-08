import {
    EmailShareButton,
    FacebookMessengerShareButton,
    FacebookShareButton,
    TwitterShareButton,
} from 'react-share'

export const MORE_OPTIONS = [
    {
        name: 'Report',
    },
    {
        name: 'Go to post',
        link: 'https://www.instagram.com/p/DDZkG74oAYq/',
    },
    {
        name: 'Share to...',
    },
    {
        name: 'Copy link',
        copy: true,
    },
    {
        name: 'Embed',
    },
    {
        name: 'About this account',
    },
    {
        cancel: true,
    },
]

export const REPORT = [
    {
        Title: 'Why are you reporting this post?',
    },
    {
        // eslint-disable-next-line quotes
        name: "I just don't like it",
    },
    {
        name: 'Bullying or unwanted contact',
    },
    {
        name: 'Suicide, self-injury or eating disorders',
    },
    {
        name: 'Violence, hate or exploitation',
    },
    {
        name: 'Selling or promoting restricted items',
    },
    {
        name: 'Nudity or sexual activity',
    },
    {
        name: 'Scam, fraud or spam',
    },
    {
        name: 'False information',
    },
]

export const SHARE_TO = [
    {
        name: 'Share to Facebook',
        shareTo: FacebookShareButton,
    },
    {
        name: 'Share in Messenger',
        shareTo: FacebookMessengerShareButton,
    },
    {
        name: 'Share to Twitter(X)',
        shareTo: TwitterShareButton,
    },
    {
        name: 'Share via Email',
        shareTo: EmailShareButton,
    },
    {
        cancel: true,
    },
]
