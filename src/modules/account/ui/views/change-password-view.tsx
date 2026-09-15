'use client'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'

import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { Field, FieldGroup, Fieldset, Label } from '@/shared/fieldset'
import { Input } from '@/shared/input'
import { Loader } from 'lucide-react'
import Form from 'next/form'
import { useTransition } from 'react'
import toast from 'react-hot-toast'

const ChangePasswordView = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    setError('')
    setSuccess('')

    const currentPassword = formData.get('currentPassword')
    const newPassword = formData.get('newPassword')
    const confirmPassword = formData.get('confirmPassword')

    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || typeof confirmPassword !== 'string') {
      setError('Please fill in all fields.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (currentPassword === newPassword) {
      setError('Your new password must be different from your current password.')
      return
    }

    startTransition(async () => {
      try {
        const { error } = await authClient.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        })

        if (error) {
          toast.error(error.message || 'Unable to update your password.')
          return
        }
        toast.success('Your password has been updated successfully.')
      } catch {
        toast.error('Something went wrong. Please try again.')
      }
    })
  }

  return (
    <div className="flex flex-col gap-y-10 sm:gap-y-12">
      {/* HEADING */}
      <div>
        <h1 className="text-2xl font-semibold">Update your password</h1>
        <p className="mt-4 text-neutral-500 dark:text-neutral-400">Update your password to keep your account secure.</p>
      </div>

      <Form action={handleSubmit}>
        <Fieldset>
          <FieldGroup className="max-w-xl">
            <Field>
              <Label>Current password</Label>
              <Input type="password" name="currentPassword" autoComplete="current-password" required />
            </Field>

            <Field>
              <Label>New password</Label>
              <Input type="password" name="newPassword" autoComplete="new-password" minLength={8} required />
            </Field>

            <Field>
              <Label>Confirm password</Label>
              <Input type="password" name="confirmPassword" autoComplete="new-password" minLength={8} required />
            </Field>

            {error && (
              <p className="text-sm text-red-500" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-green-600" role="status">
                {success}
              </p>
            )}

            <div className="pt-2">
              <ButtonPrimary className="cursor-pointer" type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    Updating <Loader className="size-4 animate-spin" />
                  </>
                ) : (
                  'Update password'
                )}
              </ButtonPrimary>
            </div>
          </FieldGroup>
        </Fieldset>
      </Form>
    </div>
  )
}

export default ChangePasswordView
