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
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof formSchema>

export const SignInView = ({ className, titleClassName }: { className?: string; titleClassName?: string }) => {
  const router = useRouter()
  const [error, setError] = useState<null | string>(null)
  const [pending, setPending] = useState(false)
  const currentPath = usePathname()
  const returnPath = currentPath && currentPath.length > 3 && !currentPath.includes('/login') ? currentPath : null

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null)
    setPending(true)

    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          setPending(false)
          router.push('/')
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
      <div className={`container mb-24 lg:mb-32 ${className}`}>
        <h1
          className={`my-20 flex items-center justify-center text-3xl leading-[115%] font-semibold text-neutral-900 md:text-5xl md:leading-[115%] dark:text-neutral-100 ${titleClassName}`}
        >
          Login
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
                  <Label>Email</Label>
                  <Input type="email" placeholder="example@example.com" {...register('email')} />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </Field>

                <Field>
                  <Label className="flex items-center justify-between gap-2">
                    <span>Password</span>
                    <Link className="text-sm font-normal text-primary-600" href="/forgot-password">
                      Forgot password?
                    </Link>
                  </Label>

                  <Input type="password" {...register('password')} />

                  {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
                </Field>

                <ButtonPrimary className="mt-2 w-full" type="submit" disabled={pending}>
                  {pending ? 'Signing in...' : 'Continue'}
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
            New user?{' '}
            <Link
              className="text-primary-600 underline"
              // r is the current path, so we can redirect the user back to the page they were on after signing up
              href={returnPath ? `/signup?r=${returnPath}` : `/signup`}
            >
              Create an account
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
