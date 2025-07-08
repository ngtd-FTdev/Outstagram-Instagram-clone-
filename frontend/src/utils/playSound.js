import notificationSound from '@/assets/sounds/notification-sound.mp3'

export const playNotificationSound = () => {
    const audio = new Audio(notificationSound)
    audio.play().catch(err => console.log('🔇 Sound error:', err))
}
