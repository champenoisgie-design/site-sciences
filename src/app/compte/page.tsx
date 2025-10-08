import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import ChangePasswordForm from '@/components/ChangePasswordForm'

export const metadata = {
  title: 'Mon compte | Site Sciences',
  description: 'Gérer votre compte.',
}

export default async function Page() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Mon compte</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        Connecté en tant que <b>{(user as any).name || user.email}</b>
      </p>
      <h2 className="text-lg font-semibold mb-2">Changer mon mot de passe</h2>
      <ChangePasswordForm />
    </section>
  )
}
