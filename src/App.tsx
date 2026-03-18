import { BrowserRouter, Routes, Route } from 'react-router'
import { useProgress } from '@/hooks/useProgress'
import AppShell from '@/components/layout/AppShell'
import HomePage from '@/pages/HomePage'
import LetterExplorer from '@/pages/LetterExplorer'
import SoundMatch from '@/pages/SoundMatch'
import SyllableBuilder from '@/pages/SyllableBuilder'
import WordBuilder from '@/pages/WordBuilder'
import ParentsPanel from '@/pages/ParentsPanel'

export default function App() {
  const { progress } = useProgress()

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell stars={progress.totalStars} />}>
          <Route index element={<HomePage />} />
          <Route path="explorar" element={<LetterExplorer />} />
          <Route path="emparejar" element={<SoundMatch />} />
          <Route path="silabas" element={<SyllableBuilder />} />
          <Route path="palabras" element={<WordBuilder />} />
          <Route path="padres" element={<ParentsPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
