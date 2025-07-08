import { useState } from 'react'
import { useChangePasswordMutation } from '@/api/slices/authApiSlice'
import { toast } from 'sonner'

import SuccessIcon from '@/assets/icons/successIcon.svg?react'
import CloseIcon from '@/assets/icons/closeIcon.svg?react'

function PasswordSettings() {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [changePassword, { isLoading }] = useChangePasswordMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert('Please fill all fields')
            return
        }
        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match')
            return
        }
        try {
            await changePassword({ oldPassword, newPassword }).unwrap()
            toast.success('Password changed successfully!', {
                icon: (
                    <SuccessIcon className='overflow-hidden rounded-full bg-green-300 p-[2px] text-base' />
                ),
            })
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err) {
            toast.error('Failed to change password', {
                icon: (
                    <CloseIcon className='overflow-hidden rounded-full bg-green-300 p-[2px] text-base' />
                ),
            })
        }
    }

    return (
        <div className='mx-auto max-w-[700px] w-full px-12 py-12'>
            <div className='mb-12'>
                <h2 className='text-[20px] font-bold text-[--ig-primary-text]'>Change Password</h2>
            </div>
            <form onSubmit={handleSubmit} className='space-y-8'>
                <div className='space-y-2'>
                    <h2 className='py-2 text-base font-semibold text-[--ig-primary-text]'>Old Password</h2>
                    <input
                        type='password'
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        className='w-full rounded-[12px] border border-[--ig-text-input-border-prism] bg-[--ig-primary-background] px-4 py-3 text-[15px] text-white'
                        placeholder='Old password'
                    />
                </div>
                <div className='space-y-2'>
                    <h2 className='py-2 text-base font-semibold text-[--ig-primary-text]'>New Password</h2>
                    <input
                        type='password'
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className='w-full rounded-[12px] border border-[--ig-text-input-border-prism] bg-[--ig-primary-background] px-4 py-3 text-[15px] text-white'
                        placeholder='New password'
                    />
                </div>
                <div className='space-y-2'>
                    <h2 className='py-2 text-base font-semibold text-[--ig-primary-text]'>Confirm New Password</h2>
                    <input
                        type='password'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className='w-full rounded-[12px] border border-[--ig-text-input-border-prism] bg-[--ig-primary-background] px-4 py-3 text-[15px] text-white'
                        placeholder='Confirm new password'
                    />
                </div>
                <div className='flex flex-grow justify-end'>
                    <button
                        className='h-[44px] w-[253px] rounded-[8px] bg-[--ig-primary-button] px-4 py-2 text-sm font-semibold text-white hover:bg-[--ig-primary-button-hover] disabled:opacity-30 active:opacity-50'
                        type='submit'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Change Password'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default PasswordSettings 