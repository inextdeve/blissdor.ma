import ChangePasswordView from '@/modules/account/ui/views/change-password-view'
import { getQueryClient, trpc } from '@/trpc/server'

export const metadata = {
  title: 'Account - Password',
  description: 'Account - Password page',
}

const Page = async () => {
  const queryClient = getQueryClient()

  const sessionProvider = await queryClient.fetchQuery(trpc.account.getSessionProvider.queryOptions())

  const isOauth = sessionProvider?.provider !== 'credential'

  if (isOauth) {
    return (
      <div className="flex flex-col gap-y-10 sm:gap-y-12">
        <h1 className="text-2xl font-semibold">Update your password</h1>
        <p className="mt-4 text-neutral-500 dark:text-neutral-400">
          You are logged in with an OAuth provider ({sessionProvider?.provider}). Password management is handled by the
          provider ({sessionProvider?.provider}).
        </p>
      </div>
    )
  }

  return <ChangePasswordView />
}

export default Page
