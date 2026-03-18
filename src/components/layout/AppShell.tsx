import { Outlet } from 'react-router'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

interface AppShellProps {
  stars?: number
}

export default function AppShell({ stars = 0 }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <TopBar stars={stars} />
      <main className="pt-16 pb-20 min-h-screen max-w-screen-sm mx-auto px-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
