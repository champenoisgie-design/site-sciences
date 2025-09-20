'use client'
import { useTheme } from './ThemeProvider'
const LABELS = { light:'Light', anime:'Anime-combat', pirate:'Pirate-aventure', lifesim:'Life-Sim', fantasy:'Fantasy-MMO' } as const

export default function ThemeSwitcher(){
  const { theme, setTheme } = useTheme()
  return (
    <div className="card">
      <div className="text-sm text-muted mb-2">Thème visuel</div>
      <select className="btn w-full" value={theme} onChange={e=> setTheme(e.target.value as any)}>
        {Object.entries(LABELS).map(([k,v])=> <option key={k} value={k}>{v}</option>)}
      </select>
    </div>
  )
}
