export const useConversationDisplayName = item => {
    const { groupType, users = {}, groupName, memberIds = [], groupAvatar } = item || {}

    let chatName = groupName || ''

    const otherUser = Object.values(users)

    if (groupType === 'one_to_one') {
        return {
            chatName: otherUser?.[0]?.full_name || 'Unknown User',
            fullName: otherUser?.[0]?.full_name || '',
            username: otherUser?.[0]?.username || '',
            avatar: otherUser?.[0]?.avatar || '',
            otherUser
        }
    }

    if (groupType === 'group') {
        if (!chatName) {
            const othersCount = Math.max(0, memberIds.length - otherUser.length)

            if (otherUser.length >= 2) {
                return {
                    chatName: `${otherUser?.[0]?.full_name}, ${otherUser?.[1]?.full_name}${othersCount > 0 ? ` + ${othersCount} người khác` : ''}`,
                    fullName: '',
                    username: '',
                    avatar: groupAvatar || otherUser?.[0]?.avatar,
                    otherUser,
                }
            } else {
                return {
                    chatName: otherUser?.[0]?.full_name || 'Nhóm không tên',
                    fullName: '',
                    username: '',
                    avatar: groupAvatar || otherUser?.[0]?.avatar,
                    otherUser,
                }
            }
        }
    }

    return {
        chatName,
        fullName: '',
        username: '',
        avatar: '',
        otherUser
    }
}
