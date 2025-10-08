import { cookies } from 'next/headers'
import TabsShell from '@/components/pricing/TabsShell'

export default async function TarifsPage() {
  const jar = await cookies()
  const entPlans = (jar.get('ent_plans')?.value || '')
    .split(',')
    .filter(Boolean)
  const entSubjects = (jar.get('ent_subjects')?.value || '')
    .split(',')
    .filter(Boolean)
  const entModes = (jar.get('ent_modes')?.value || '')
    .split(',')
    .filter(Boolean)
  const entSkins = (jar.get('ent_skins')?.value || '')
    .split(',')
    .filter(Boolean)
  const entPacks = (jar.get('ent_packs')?.value || '')
    .split(',')
    .filter(Boolean)

  return (
    <div className="max-w-5xl mx-auto p-6">
      <TabsShell
        entPlans={entPlans}
        entSubjects={entSubjects}
        entModes={entModes}
        entSkins={entSkins}
        entPacks={entPacks}
      />
    </div>
  )
}
