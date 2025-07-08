import { useEffect, useState } from 'react'
import CloseIcon from '@/assets/icons/closeIcon.svg?react'
import { useDebounce } from '@/hooks/useDebounce'
import {
    useGetSuggestedChatMutation,
    useSearchUsersQuery,
} from '@/api/slices/userApiSlice'
import Suggested from './Suggested'
import SearchUser from './SearchUser'
import { useCreateGroupConversationMutation } from '@/api/slices/messageApiSlide'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function NewMessage({ handleCloseButton }) {
    const userId = useSelector(state => state.auth.user._id)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [suggested, setSuggested] = useState([])
    const navigate = useNavigate()

    const [valueSearch, setValueSearch] = useState('')
    const debouncedValueSearch = useDebounce(valueSearch, 500)

    const {
        data: searchResults,
        isLoading,
        isSuccess,
        isError,
    } = useSearchUsersQuery(
        { q: debouncedValueSearch, limit: 5 },
        {
            skip: !debouncedValueSearch || debouncedValueSearch.length < 2,
        }
    )

    const [getSuggestedChat] = useGetSuggestedChatMutation()

    const [createGroupConversation] = useCreateGroupConversationMutation()

    const fetchSuggested = async () => {
        const result = await getSuggestedChat().unwrap()
        setSuggested(result?.metadata || [])
    }

    console.log('result::', suggested)

    useEffect(() => {
        fetchSuggested()
    }, [])

    const handleSelect = user => {
        if (selectedUsers.some(u => u._id === user?._id)) {
            setSelectedUsers(selectedUsers.filter(u => u._id !== user?._id))
        } else {
            setSelectedUsers([...selectedUsers, user])
        }
    }

    const handleRemove = user => {
        setSelectedUsers(selectedUsers.filter(u => u._id !== user._id))
    }

    const handleCreateChat = async () => {
        try {
            const memberIds = selectedUsers.map(user => user._id)
            const result = await createGroupConversation({ memberIds, userId })
            if (result?.data?.metadata?.groupId) {
                navigate(`/direct/t/${result?.data?.metadata?.groupId}`)
            }
            handleCloseButton()
        } catch (error) {
            console.log('error::', error)
        }
    }

    return (
        <div className='m-5 max-h-[--full-40px] w-[548px] max-w-full overflow-hidden rounded-xl bg-[--ig-elevated-background] p-0 text-white shadow-xl'>
            <div className='flex h-[--scrollable-content-header-height] items-center justify-between border-b border-[--ig-elevated-separator] px-6 py-4'>
                <div className='h-[18px] w-[18px]'></div>
                <span className='text-base font-bold text-[--ig-primary-text]'>
                    New message
                </span>
                <button onClick={handleCloseButton} className='outline-none'>
                    <CloseIcon className='h-[18px] w-[18px] text-[--ig-primary-text]' />
                </button>
            </div>

            <div className='flex max-h-[120px] min-h-[38px] overflow-y-auto border-b border-[--ig-elevated-separator] px-4'>
                <span className='mt-2 font-semibold text-[--ig-primary-text]'>To:</span>
                <div className='flex flex-1 flex-wrap'>
                    {selectedUsers.map(user => (
                        <span
                            key={user?._id}
                            className='m-1 flex h-[26px] items-center rounded-[12px] bg-[--web-secondary-action] px-3 text-[14px] font-semibold text-[--ig-primary-button]'
                        >
                            {user?.full_name}
                            <button
                                className='ml-2'
                                onClick={() => handleRemove(user)}
                                tabIndex={-1}
                            >
                                <CloseIcon className='h-3 w-3' />
                            </button>
                        </span>
                    ))}
                    <input
                        className='min-w-[80px] flex-grow bg-transparent py-1 pl-5 pr-3 text-sm text-[--ig-primary-text] outline-none'
                        placeholder='Search...'
                        value={valueSearch}
                        onChange={e => setValueSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className='flex h-[321px] flex-grow flex-col overflow-y-scroll'>
                {valueSearch ? (
                    <SearchUser
                        selectedUsers={selectedUsers}
                        data={searchResults?.metadata || []}
                        handleSelect={handleSelect}
                    />
                ) : (
                    <Suggested
                        suggested={suggested}
                        selectedUsers={selectedUsers}
                        handleSelect={handleSelect}
                    />
                )}
            </div>

            <div className='m-4'>
                <button
                    className={`h-[44px] w-full rounded-lg py-2 text-sm font-semibold transition-colors duration-150 ${
                        selectedUsers.length
                            ? 'bg-[--ig-primary-button] text-white hover:bg-[--ig-primary-button-hover] active:opacity-50'
                            : 'cursor-not-allowed bg-[--ig-primary-button] text-white text-opacity-50 opacity-30'
                    }`}
                    disabled={!selectedUsers.length}
                    onClick={handleCreateChat}
                >
                    Chat
                </button>
            </div>
        </div>
    )
}
