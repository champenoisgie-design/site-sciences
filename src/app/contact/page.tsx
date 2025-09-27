import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contact | Site Sciences',
  description: 'Écrivez-nous pour toute question.',
}

export default function Page() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        Remplissez le formulaire et nous vous répondrons rapidement.
      </p>
      <ContactForm />
    </section>
  )
}
