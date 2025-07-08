import { baseApi } from '@/api/rtkApi'

export const messageApiSlice = baseApi.injectEndpoints({
    endpoints: builder => ({
        sendMessage: builder.mutation({
            query: ({ conversationId, dataChat }) => {
                const { text, files, replyMessage, gifUrl } = dataChat
                console.log('dataChat::', dataChat);

                const formData = new FormData()
                if (text) formData.append('text', text)
                if (gifUrl) formData.append('gifUrl', gifUrl)
                if (files && files.length > 0) {
                    files.forEach(file => {
                        formData.append('files', file)
                    })
                }
                if (replyMessage?.id) formData.append('replyMessageId', replyMessage.id)

                return {
                    url: `/messages/sendMessage/${conversationId}`,
                    method: 'POST',
                    data: formData,
                    userIdHeader: true,
                }
            },
        }),
        sendVoiceMessage: builder.mutation({
            query: ({ conversationId, audioBlob, duration }) => {
                const formData = new FormData()
                const audioFile = new File([audioBlob], 'voice-message.webm', {
                    type: 'audio/webm',
                })

                formData.append('audio', audioFile)
                formData.append('duration', duration)
                formData.append('type', 'voice')

                return {
                    url: `/messages/sendMessage/${conversationId}`,
                    method: 'POST',
                    data: formData,
                    userIdHeader: true,
                }
            },
        }),

        getUserDataForConversations: builder.query({
            query: ids => ({
                url: `/messages/getUserDataForConversations?ids=${ids.join(',')}`,
                method: 'GET',
                userIdHeader: true,
            }),
        }),

        createGroupConversation: builder.mutation({
            query: ({ memberIds = [], userId = '' }) => ({
                url: '/messages/createGroupConversation',
                method: 'POST',
                data: { memberIds: [userId, ...memberIds] },
                userIdHeader: true,
            }),
        }),

        toggleReaction: builder.mutation({
            query: ({ conversationId, messageId, emoji, isAdd }) => ({
                url: '/messages/toggleReaction',
                method: 'POST',
                data: { conversationId, messageId, emoji, isAdd },
                userIdHeader: true,
            }),
        }),
    }),
})

export const {
    useSendMessageMutation,
    useSendVoiceMessageMutation,
    useGetUserDataForConversationsQuery,
    useCreateGroupConversationMutation,
    useToggleReactionMutation,
} = messageApiSlice
