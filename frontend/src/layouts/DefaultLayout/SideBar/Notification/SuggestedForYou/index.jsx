import { useGetSuggestedUsersMutation } from '@/api/slices/userApiSlice'
import UserSuggested from './UserSuggested'
import { useEffect } from 'react'
import { setSuggestedUsers } from '@/redux/features/suggestedUsers'
import { useDispatch, useSelector } from 'react-redux'
import { setUsers } from '@/redux/features/user'

function SuggestedForYou() {
    const dispatch = useDispatch()
    const suggestedUsers = useSelector(
        state => state.suggestedUsers.suggestedUsers
    )

    const [getSuggestedUsers, { isLoading, isError }] =
        useGetSuggestedUsersMutation(20)

    useEffect(() => {
        const fetchSuggestedUser = async () => {
            const result = await getSuggestedUsers()
            const dtUser = result?.data?.metadata
            if (dtUser?.length > 0) {
                const userIds = dtUser.map(user => user._id)
                dispatch(setUsers(dtUser))
                dispatch(setSuggestedUsers(userIds))
            }
        }

        if (suggestedUsers.length === 0) {
            fetchSuggestedUser()
        }
    }, [])

    return (
        <div className='flex flex-col'>
            {suggestedUsers?.map((id) => {
                return <UserSuggested userId={id} key={id} />
            })}
        </div>
    )
}

export default SuggestedForYou
