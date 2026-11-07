import { SignInView } from '@/modules/auth/ui/views/sign-in-views'
import { Button } from '@/shared/Button/Button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/shared/dialog'
import { ShoppingCart01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface LoginDialogTypes {
  open: boolean
  setOpen: (open: boolean) => void
}

export const LoginDialog = ({ open, setOpen }: LoginDialogTypes) => {
  return (
    <Dialog size="lg" open={open} onClose={setOpen}>
      <DialogTitle>
        <div className="flex items-center justify-center gap-2">
          <HugeiconsIcon icon={ShoppingCart01Icon} size={20} className="mr-2" />
          You must be logged in to add items to your cart
        </div>
      </DialogTitle>
      <DialogDescription className="px-6 text-sm text-neutral-500 dark:text-neutral-400">
        Please log in to your account or create a new account to add items to your cart.
      </DialogDescription>
      <DialogBody>
        <SignInView className="!mb-0 max-w-md p-0 lg:!mb-0" titleClassName="hidden" />
      </DialogBody>
      <DialogActions>
        <Button size="smaller" plain onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
