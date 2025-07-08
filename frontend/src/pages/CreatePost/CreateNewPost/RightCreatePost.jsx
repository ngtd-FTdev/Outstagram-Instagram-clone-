import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import CustomRickTextEditor from '@/components/RichTextEditer'
import useProseMirrorMentionEditor from '@/hooks/useProseMirrorMentionEditor'
import './RightCreatePost.css'

import ArrowIcon from '@/assets/icons/arrowIcon.svg?react'
import CollaboratorsIcon from '@/assets/icons/CollaboratorsIcon.svg?react'
import EmojiIcon from '@/assets/icons/emojiIcon.svg?react'
import LocationIcon from '@/assets/icons/LocationIcon.svg?react'

import PopoverCom from '@/components/PopoverCom'
import { Switch } from '@/components/ui/switch'
import { useDebounce } from '@/hooks/useDebounce'
import { setAdvancedSettings, setCaptionPost, setLocation } from '@/redux/features/createPost'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddEmoji from '@/components/AddEmoji'
import AddTag from './AddTag'

function RightCreatePost() {
    const [isAdvanSettingsOpent, setAdvanSettingsOpent] = useState(false)
    const location = useSelector(state => state.createPost.location)
    const advancedSettings = useSelector(state => state.createPost.advancedSettings)
    const caption = useSelector(state => state.createPost.caption)

    const [locationPost, setLocationPost] = useState(location)

    const dispatch = useDispatch()

    const MAX_LENGTH = 2200

    const {
        editorRef,
        suggestions,
        activeMention,
        insertText,
        choose,
        textValue,
        textLength,
    } = useProseMirrorMentionEditor({ maxLength: MAX_LENGTH, textDefault: caption })

    const debouncedTextValue = useDebounce(textValue, 500)
    useEffect(() => {
        if (debouncedTextValue) {
            dispatch(setCaptionPost(debouncedTextValue))
        }
    }, [debouncedTextValue])

    const debouncedLocationPost = useDebounce(locationPost, 500)
    useEffect(() => {
        dispatch(setLocation(debouncedLocationPost))
    }, [debouncedLocationPost])

    const handleSetLocationPost = e => {
        setLocationPost(e.target.value)
    }

    const handleSetAdvanSettings = (key, value) => {
        dispatch(setAdvancedSettings({ ...advancedSettings, [key]: value }))
    }

    return (
        <div className='relative z-20 w-[--creation-settings-width] border-l border-[--ig-elevated-separator]'>
            <div className='absolute inset-0 overflow-y-scroll'>
                <div>
                    <div className='mx-4 mb-[14px] mt-[18px] flex flex-nowrap items-center justify-between'>
                        <div className='mr-3 flex flex-col'>
                            <Avatar className='h-[28px] w-[28px] overflow-hidden rounded-full'>
                                <AvatarImage
                                    src='https://github.com/shadcn.png'
                                    alt='@shadcn'
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className='flex flex-grow items-center justify-between'>
                            <span className='line-clamp-1 text-sm font-semibold leading-[18px] text-[--ig-primary-text]'>
                                tuandat
                            </span>
                        </div>
                    </div>
                </div>
                <div className='relative flex flex-col text-[--ig-primary-text]'>
                    <div ref={editorRef} className='h-[168px]'></div>
                    <div className='flex flex-grow items-center justify-between'>
                        <div className='flex flex-grow items-center px-2 py-1'>
                            <PopoverCom
                                BodyPop={() => (
                                    <AddEmoji insertText={insertText} />
                                )}
                                side='bottom'
                                modal={true}
                                asChild={true}
                                sideOffset={5}
                            >
                                <button
                                    className='p-2'
                                    aria-label='Choose Emoji'
                                >
                                    <EmojiIcon className='h-[20px] w-[20px] text-[--ig-secondary-text]' />
                                </button>
                            </PopoverCom>
                        </div>
                        <div className='flex items-center justify-center px-3'>
                            <span className='text-xs text-[--ig-tertiary-text]'>
                                {textLength.toLocaleString('en-US')}/
                                {MAX_LENGTH.toLocaleString('en-US')}
                            </span>
                        </div>
                    </div>
                    {activeMention?.type && (
                        <AddTag activeMention={activeMention} choose={choose} />
                    )}
                </div>
                <div className='flex h-[44px] flex-grow items-center justify-center px-2 outline-none'>
                    <label className='flex flex-grow items-center justify-between gap-2 pr-2'>
                        <input
                            type='text'
                            onChange={handleSetLocationPost}
                            value={locationPost}
                            placeholder='Add location'
                            spellCheck='true'
                            className='h-[38px] flex-grow bg-transparent px-[9px] py-1 text-base text-[--ig-primary-text] placeholder-[--placeholder-input] outline-none'
                        />
                        <div>
                            <LocationIcon className='h-4 w-4 text-[--ig-primary-text]' />
                        </div>
                    </label>
                </div>
                {/* <div className='flex h-[44px] flex-grow items-center justify-center px-2 outline-none'>
                    <label className='flex flex-grow items-center justify-between gap-2 pr-2'>
                        <input
                            type='text'
                            placeholder='Add collaborators'
                            spellCheck='true'
                            className='h-[38px] flex-grow bg-transparent px-[9px] py-1 text-base text-[--ig-primary-text] placeholder-[--placeholder-input] outline-none'
                        />
                        <div>
                            <CollaboratorsIcon className='h-4 w-4 text-[--ig-primary-text]' />
                        </div>
                    </label>
                </div> */}
                <div className='flex flex-col'>
                    <div
                        onClick={() =>
                            setAdvanSettingsOpent(!isAdvanSettingsOpent)
                        }
                        className='flex cursor-pointer select-none items-center justify-between px-4 py-[14px]'
                    >
                        <span className='text-base font-semibold text-[--ig-primary-text]'>
                            Advanced settings
                        </span>
                        <span>
                            <ArrowIcon
                                className={`h-4 w-4 text-[--ig-primary-text] ${isAdvanSettingsOpent ? '' : 'rotate-180'}`}
                            />
                        </span>
                    </div>
                    {isAdvanSettingsOpent && (
                        <div className='mb-1 flex flex-col gap-2 px-4 py-1'>
                            <div className='flex flex-col'>
                                <div className='flex flex-nowrap items-center justify-center'>
                                    <span className='flex-grow text-base font-medium leading-[20px] text-[--ig-primary-text]'>
                                        Hide like and view counts on this post
                                    </span>
                                    <div>
                                        <Switch
                                            checked={advancedSettings?.hideLikeAndView}
                                            onCheckedChange={() => handleSetAdvanSettings('hideLikeAndView', !advancedSettings?.hideLikeAndView)}
                                            className='h-[24px] w-[40px] data-[state=checked]:bg-[--ig-toggle-background-on-prism] data-[state=unchecked]:bg-[--ig-toggle-background-off-prism]'
                                            classThumb='h-[20px] w-[20px] bg-[--ig-stroke-prism] data-[state=checked]:translate-x-[16px] data-[state=unchecked]:translate-x-[2px]'
                                            id='sound-one'
                                        />
                                    </div>
                                </div>
                                <div className='py-3'>
                                    <span className='line-clamp-4 text-xs leading-4 text-[--ig-secondary-text]'>
                                        Only you will see the total number of
                                        likes and views on this post. You can
                                        change this later by going to the ···
                                        menu at the top of the post. To hide
                                        like counts on other people&apos;s
                                        posts, go to your account settings.
                                    </span>
                                    <a
                                        href='https://help.instagram.com/113355287252104'
                                        target='_blank'
                                        className='text-nowrap text-xs leading-4 text-[--ig-colors-button-borderless-text]'
                                    >
                                        Learn more
                                    </a>
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <div className='flex flex-nowrap items-center justify-between'>
                                    <span className='flex-grow text-base font-medium leading-[20px] text-[--ig-primary-text]'>
                                        Turn off commenting
                                    </span>
                                    <div>
                                        <Switch
                                            checked={advancedSettings?.turnOffCommenting}
                                            onCheckedChange={() => handleSetAdvanSettings('turnOffCommenting', !advancedSettings?.turnOffCommenting)}
                                            className='h-[24px] w-[40px] data-[state=checked]:bg-[--ig-toggle-background-on-prism] data-[state=unchecked]:bg-[--ig-toggle-background-off-prism]'
                                            classThumb='h-[20px] w-[20px] bg-[--ig-stroke-prism] data-[state=checked]:translate-x-[16px] data-[state=unchecked]:translate-x-[2px]'
                                            id='sound-one'
                                        />
                                    </div>
                                </div>
                                <div className='py-3'>
                                    <span className='line-clamp-4 text-xs leading-4 text-[--ig-secondary-text]'>
                                        You can change this later by going to
                                        the ··· menu at the top of your post.
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RightCreatePost
