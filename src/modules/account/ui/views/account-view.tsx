'use client'
import Avatar from '@/shared/Avatar/Avatar'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { Field, Fieldset, Label } from '@/shared/fieldset'
import { Input, InputGroup } from '@/shared/input'
import { Select } from '@/shared/select'
import { useTRPC } from '@/trpc/client'
import { ImageAdd02Icon, Mail01Icon, MapsLocation01Icon, SmartPhone01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import Form from 'next/form'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { UserGet } from '../../types'

interface AccountViewProps {
  isOauth: boolean
  user: UserGet
}

export const AccountView = ({ isOauth, user }: AccountViewProps) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<Partial<UserGet> | null>(user)

  const updateUser = useMutation(
    trpc.user.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.user.get.queryOptions())
        toast.success('Account updated successfully')
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  )

  const onSubmit = async (formData: FormData) => {
    updateUser.mutate({
      phone: formData.get('phone') as string,
      gender: formData.get('gender') as 'male' | 'female' | 'not set',
      address: formData.get('address') as string,
    })
    // You can add your update logic here, such as updating the user state or making an API call
  }

  return (
    <div className="flex flex-col gap-y-10 sm:gap-y-12">
      {/* HEADING */}
      <h1 className="text-2xl font-semibold sm:text-3xl">Account infomation</h1>

      <Form action={onSubmit}>
        <Fieldset className="flex flex-col md:flex-row">
          <div className="flex shrink-0 items-start">
            {/* AVATAR */}
            <div className="relative flex overflow-hidden rounded-full">
              <Avatar imgUrl={user.image} userName={user.name} sizeClass="text-4xl size-32" />
              {!isOauth && (
                <>
                  <div className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/60 text-neutral-50">
                    <HugeiconsIcon icon={ImageAdd02Icon} size={30} color="currentColor" strokeWidth={1.5} />
                    <span className="mt-1 text-xs">Change Image</span>
                  </div>
                  <input type="file" name="avatar" className="absolute inset-0 cursor-pointer opacity-0" />
                </>
              )}
            </div>
          </div>
          <div className="mt-10 max-w-3xl grow space-y-7 md:mt-0 md:pl-16">
            <Field>
              <Label>Full name</Label>
              <Input
                name="full-name"
                value={formData?.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isOauth}
              />
            </Field>

            {/* ---- */}
            <Field>
              <Label>Email</Label>
              <InputGroup>
                <HugeiconsIcon data-slot="icon" icon={Mail01Icon} size={16} />
                <Input name="email" type="email" placeholder={user.email} disabled={isOauth} />
              </InputGroup>
            </Field>

            {/* ---- */}
            {/* <Field className="max-w-lg">
              <Label>Date of birth</Label>
              <InputGroup>
                <HugeiconsIcon data-slot="icon" icon={Calendar01Icon} size={16} />
                <Input name="date-of-birth" type="date" defaultValue="1990-07-22" />
              </InputGroup>
            </Field> */}
            {/* ---- */}
            <Field>
              <Label>Address</Label>
              <InputGroup>
                <HugeiconsIcon data-slot="icon" icon={MapsLocation01Icon} size={16} />
                <Input
                  name="address"
                  placeholder="Enter your address"
                  value={formData?.address!}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </InputGroup>
            </Field>

            {/* ---- */}
            <Field>
              <Label>Gender</Label>
              <Select
                name="gender"
                value={formData?.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'not set' })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="not set">Not set</option>
              </Select>
            </Field>

            {/* ---- */}
            <Field>
              <Label>Phone number</Label>
              <InputGroup>
                <HugeiconsIcon data-slot="icon" icon={SmartPhone01Icon} size={16} />
                <Input
                  name="phone"
                  placeholder="06 33 888 232"
                  value={formData?.phone!}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </InputGroup>
            </Field>
            {/* ---- */}

            <div className="pt-2">
              <ButtonPrimary className="min-w-[20ch] cursor-pointer" type="submit">
                {updateUser.isPending ? (
                  <>
                    Updating <Loader className="size-4 animate-spin" />
                  </>
                ) : (
                  'Update account'
                )}
              </ButtonPrimary>
            </div>
          </div>
        </Fieldset>
      </Form>
    </div>
  )
}
