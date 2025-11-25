import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import CreateParty from './pages/CreateParty'
import PartyPage from './pages/PartyPage'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateParty />} />
        <Route path="/party/:id" element={<PartyPage />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter basename="/SecretSanta">
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
