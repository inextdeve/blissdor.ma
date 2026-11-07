'use client'
import LikeButton from '@/components/LikeButton'
import { authClient } from '@/lib/auth-client'
import { LoginDialog } from '@/modules/auth/ui/components/login-dialog'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export const WishListButton = ({ productId, className }: { productId: string; className?: string }) => {
  const trpc = useTRPC()

  const { data: session } = authClient.useSession()

  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()

  const toggleWishlist = useMutation(
    trpc.wishlist.toggle.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.wishlist.isInWishlist.queryOptions({ productId }))
        queryClient.invalidateQueries(trpc.wishlist.getMany.queryOptions())
      },
    })
  )

  const { data: isInWishlist } = useQuery(trpc.wishlist.isInWishlist.queryOptions({ productId }))

  const handleToggleWishlist = () => {
    if (!session) {
      setOpen(true)
      return
    }
    toggleWishlist.mutate({ productId })
  }

  return (
    <>
      <LoginDialog open={open} setOpen={setOpen} />
      <LikeButton liked={isInWishlist} onClick={handleToggleWishlist} className={className} />
    </>
  )
}
