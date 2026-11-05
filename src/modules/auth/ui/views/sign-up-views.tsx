'use client'
import googleSvg from '@/images/socials/google.svg'
import { authClient } from '@/lib/auth-client'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import { Field, FieldGroup, Fieldset, Label } from '@/shared/fieldset'
import { AlertInline } from '@/shared/inline-alert'
import { Input } from '@/shared/input'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Name must be at least 3 char' })
      .max(20, { message: 'Maximum length is 20 char' }),
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    confirmPassword: z.string().min(1, 'Password is required'),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof formSchema>

export const SignUpView = () => {
  const router = useRouter()
  const [error, setError] = useState<null | string>()
  const [pending, setPending] = useState(false)
  const searchParams = useSearchParams()
  const returnPath = searchParams?.get('r') || '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null)
    setPending(true)

    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: returnPath,
      },
      {
        onSuccess: () => {
          setPending(false)
          router.push(returnPath)
        },
        onError: ({ error }) => {
          setPending(false)
          setError(error.message)
        },
      }
    )
  }

  const onSocial = (provider: 'github' | 'google') => {
    setError(null)
    setPending(true)
    authClient.signIn.social(
      { provider, callbackURL: '/' },
      {
        onSuccess: () => {
          setPending(false)
        },
        onError: ({ error }) => {
          setPending(false)
          setError(error.message)
        },
      }
    )
  }

  return (
    <div>
      <div className="container mb-24 lg:mb-32">
        <h1 className="my-20 flex items-center justify-center text-3xl leading-[115%] font-semibold text-neutral-900 md:text-5xl md:leading-[115%] dark:text-neutral-100">
          Sign up
        </h1>

        <div className="mx-auto flex max-w-md flex-col gap-y-6">
          <div className="grid gap-3">
            <ButtonSecondary
              onClick={() => onSocial('google')}
              className="flex w-full cursor-pointer rounded-lg bg-primary-50 px-4 py-3 sm:px-6 dark:bg-neutral-800"
            >
              <Image sizes="40px" className="size-5 shrink-0 object-cover" src={googleSvg} alt="google auth" />
              <h3 className="grow text-center text-sm font-medium text-neutral-700 sm:text-sm dark:text-neutral-300">
                Google
              </h3>
            </ButtonSecondary>
          </div>

          <div className="relative text-center">
            <span className="relative z-10 inline-block bg-white px-4 text-sm font-medium dark:bg-neutral-900 dark:text-neutral-400">
              OR
            </span>
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 border border-neutral-100 dark:border-neutral-800" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Fieldset>
              <FieldGroup className="sm:space-y-6">
                <Field>
                  <Label>Name</Label>
                  <Input type="text" placeholder="Ahmed sami" {...register('name')} />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </Field>
                <Field>
                  <Label>Email</Label>
                  <Input type="email" placeholder="example@example.com" {...register('email')} />
                </Field>

                <Field>
                  <Label className="flex items-center justify-between gap-2">
                    <span>Password</span>
                  </Label>

                  <Input type="password" {...register('confirmPassword')} />
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </Field>
                <Field>
                  <Label className="flex items-center justify-between gap-2">
                    <span>Confirm Password</span>
                  </Label>

                  <Input type="password" {...register('password')} />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </Field>

                <ButtonPrimary className="mt-2 w-full" type="submit" disabled={pending}>
                  {pending ? 'Signing up...' : 'Continue'}
                </ButtonPrimary>
              </FieldGroup>
            </Fieldset>
            {!!error && (
              <AlertInline variant="danger" className="mt-4">
                {error}
              </AlertInline>
            )}
          </form>

          <span className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
            Already have an account ?{' '}
            <Link className="text-primary-600 underline" href="/login">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
