import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useLoginMutation } from '@/api/slices/authApiSlice'
import fbIcon from '@/assets/icons/fbIcon.svg?react'
import LoadingIcon from '@/assets/icons/loadingIcon.svg?react'
import SuccessIcon from '@/assets/icons/successIcon.svg?react'
import CloseIcon from '@/assets/icons/closeIcon.svg?react'
import instagramLogoText from '@/assets/img/blackLogo.png'
import googlePlayImg from '@/assets/img/googlePlay.png'
import microsoftImg from '@/assets/img/microsoft.png'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form'
import { setUser } from '@/redux/features/auth'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { signInWithCustomToken } from 'firebase/auth'
import { auth as authFirebase } from '@/lib/firebaseConfig'

const formSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z
        .string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .max(20, 'Mật khẩu không được vượt quá 20 ký tự')
        .regex(
            /^(?=.*[A-Z])(?=.*\d)/,
            'Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 chữ số'
        ),
})
function FormLogin() {
    const [showPassword, setShowPassword] = useState(false)
    const [login, { isLoading, isError, error }] = useLoginMutation()

    const dispatch = useDispatch()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const emailValue = form.watch('email')
    const passwordValue = form.watch('password')
    const onSubmit = async values => {
        const { email, password } = values

        try {
            const result = await login({ email, password }).unwrap()
            const dataRes = result.metadata

            if (!dataRes.token) {
                throw new Error('Something wrong happened!! Please re-login')
            }
            await signInWithCustomToken(authFirebase, dataRes?.token)
            dispatch(setUser(dataRes))

            toast.success('Login success!', {
                icon: (
                    <SuccessIcon className='overflow-hidden rounded-full bg-green-300 p-[2px] text-base' />
                ),
            })
        } catch (err) {
            console.log('error::', err);
            toast.error('Login failed!', {
                icon: (
                    <CloseIcon className='overflow-hidden rounded-full bg-green-300 p-[2px] text-base' />
                ),
            })
        }
    }

    const handleShowPassword = e => {
        setShowPassword(!showPassword)
    }

    return (
        <>
            <div className='mt-3 h-full w-[350px] max-w-[350px]'>
                <div className='mb-[10px] flex flex-col items-center justify-center border-[1px] border-[#dbdbdb] py-[10px]'>
                    <div className='mb-3 mt-9'>
                        <img src={instagramLogoText} alt='Instagram' />
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='mb-3 mt-6 flex h-full w-full flex-col justify-center px-10 dark:bg-[#fff]'
                        >
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem className='relative mb-2 space-y-0'>
                                        <div
                                            className={`relative h-[36px] rounded-[2px] border-[1px] ${form.formState.errors.email ? 'border-red-500' : 'border-[#dbdbdb]'} bg-[#fafafa]`}
                                        >
                                            <motion.label
                                                className='absolute left-2 flex h-full w-full origin-left transform items-center text-ellipsis align-middle text-xs font-normal text-[#737373]'
                                                htmlFor='email'
                                                initial={{ scale: 1, y: 0 }}
                                                animate={{
                                                    scale: field.value
                                                        ? 0.75
                                                        : 1,
                                                    y: field.value ? -10 : 0,
                                                }}
                                                transition={{ duration: 0.1 }}
                                            >
                                                Phone number, username, or email
                                            </motion.label>
                                            <FormControl>
                                                <input
                                                    className='peer w-full bg-transparent pb-[5px] pl-2 pt-[17px] text-xs text-black outline-none placeholder-shown:pb-[7px] placeholder-shown:pt-[7px] placeholder-shown:text-base dark:bg-white'
                                                    placeholder=''
                                                    autoComplete='email'
                                                    id='email'
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage className='mt-1 text-xs text-red-500' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem className='relative mb-2 space-y-0'>
                                        <div
                                            className={`relative flex h-[36px] flex-nowrap rounded-[2px] border-[1px] ${form.formState.errors.password ? 'border-red-500' : 'border-[#dbdbdb]'} bg-[#fafafa]`}
                                        >
                                            <motion.label
                                                className='absolute left-2 flex h-full origin-left transform items-center text-ellipsis align-middle text-xs font-normal text-[#737373]'
                                                htmlFor='password'
                                                initial={{ scale: 1, y: 0 }}
                                                animate={{
                                                    scale: field.value
                                                        ? 0.75
                                                        : 1,
                                                    y: field.value ? -10 : 0,
                                                }}
                                                transition={{ duration: 0.1 }}
                                            >
                                                Password
                                            </motion.label>
                                            <FormControl>
                                                <input
                                                    className='peer w-full bg-transparent pb-[5px] pl-2 pt-[17px] text-xs text-black outline-none placeholder-shown:pb-[7px] placeholder-shown:pt-[7px] placeholder-shown:text-base dark:bg-white'
                                                    placeholder=''
                                                    autoComplete='off'
                                                    type={
                                                        showPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    id='password'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <div className='px-2'>
                                                {field.value && (
                                                    <button
                                                        className='h-full w-auto text-sm font-semibold text-black outline-none'
                                                        type='button'
                                                        onClick={
                                                            handleShowPassword
                                                        }
                                                    >
                                                        {showPassword
                                                            ? 'Hide'
                                                            : 'Show'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <FormMessage className='mt-1 text-xs text-red-500' />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type='submit'
                                className='my-2 h-auto w-full cursor-pointer rounded-[8px] bg-[#0095f6] px-4 py-2 leading-4 text-[#ffffff] hover:bg-[#1877f2] disabled:bg-[#4cb5f9]'
                                disabled={
                                    !(
                                        emailValue && passwordValue.length >= 6
                                    ) || isLoading
                                }
                            >
                                {isLoading ? (
                                    <div className='flex items-center justify-center'>
                                        <LoadingIcon className='mr-2 h-5 w-5 animate-spin' />
                                        <span>Logging in...</span>
                                    </div>
                                ) : (
                                    <span>Log in</span>
                                )}
                            </Button>
                            <Button
                                type='button'
                                className='mb-2 h-auto w-full cursor-pointer rounded-[8px] bg-[#f6b800] px-4 py-2 leading-4 text-[#fff] hover:bg-[#e6a700]'
                                onClick={() => {
                                    form.setValue('email', 'ngtd07@gmail.com');
                                    form.setValue('password', 'ngtd123A@');
                                    setTimeout(() => {
                                        form.handleSubmit(onSubmit)();
                                    }, 0);
                                }}
                                disabled={isLoading}
                            >
                                Đăng nhập acc test 1
                            </Button>
                            <Button
                                type='button'
                                className='mb-2 h-auto w-full cursor-pointer rounded-[8px] bg-[#00b6f6] px-4 py-2 leading-4 text-[#fff] hover:bg-[#0095f6]'
                                onClick={() => {
                                    form.setValue('email', 'ngtd08@gmail.com');
                                    form.setValue('password', 'ngtd123A@');
                                    setTimeout(() => {
                                        form.handleSubmit(onSubmit)();
                                    }, 0);
                                }}
                                disabled={isLoading}
                            >
                                Đăng nhập acc test 2
                            </Button>
                            <div className='mb-[22px] mt-[14px] flex w-full flex-row items-center'>
                                <div className='h-[1px] w-full bg-[#dbdbdb] text-[#000]'></div>
                                <div className='mx-4 text-[13px] font-semibold text-[#737373]'>
                                    OR
                                </div>
                                <div className='h-[1px] w-full bg-[#dbdbdb] text-[#000]'></div>
                            </div>
                            <div className='my-2'>
                                <button
                                    className='flex h-full w-full flex-row items-center justify-center text-sm font-semibold text-[#385185] outline-none'
                                    type='button'
                                >
                                    <span className='mr-2 h-4 w-4 bg-fbIcon bg-center object-contain'></span>
                                    <span className='align-middle'>
                                        Log in with Facebook
                                    </span>
                                </button>
                            </div>
                            <Link
                                to='/accounts/password/reset/'
                                className='mt-3 cursor-pointer text-center leading-4'
                            >
                                <span className='text-xs text-[#00376b]'>
                                    Forgot password?
                                </span>
                            </Link>
                        </form>
                    </Form>
                </div>
                <div className='mb-[10px] flex w-full items-center justify-center border-[1px] border-[#dbdbdb] py-2'>
                    <p className='m-3 flex flex-row flex-nowrap gap-1 text-sm leading-[18px] text-black'>
                        Don&apos;t have an account?
                        <Link
                            to='/accounts/signup'
                            className='font-semibold text-[#0095f6]'
                        >
                            <span>Sign up</span>
                        </Link>
                    </p>
                </div>
                <div className='w-full text-black'>
                    <div className='my-3 w-full text-center'>
                        <span className='text-sm'>Get the app.</span>
                    </div>
                    <div className='flex flex-row items-center justify-center gap-2'>
                        <a href=''>
                            <img src={googlePlayImg} alt='' className='h-10' />
                        </a>
                        <a href=''>
                            <img src={microsoftImg} alt='' className='h-10' />
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FormLogin
