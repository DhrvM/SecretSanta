import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from './Icons'

export function PartyForm() {
  const [partyCode, setPartyCode] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (partyCode.trim()) {
      // Navigate to party page
      navigate(`/party/${partyCode.toUpperCase()}`)
    }
  }

  const handleCreateParty = () => {
    navigate('/create')
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-sides pb-[var(--footer-safe-area)]">
      <div className="mx-auto w-full max-w-2xl text-center">
        {/* Logo / Title - Large serif like the reference */}
        <h1 className="mb-4 font-serif text-[clamp(3rem,12vw,8rem)] leading-[0.9] tracking-tight text-white drop-shadow-lg">
          Secret Santa
        </h1>
        <p className="mb-12 font-serif text-[clamp(1.5rem,5vw,3rem)] italic text-white/90 drop-shadow-md">
          Matcher
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mx-auto max-w-md">
          {/* Party Code Input - Pill shaped with white border */}
          <div className="relative mb-6">
            <input
              type="text"
              value={partyCode}
              onChange={(e) => setPartyCode(e.target.value.toUpperCase())}
              placeholder="Enter party code"
              maxLength={6}
              className="w-full rounded-full border-2 border-white bg-white/20 px-6 py-4 pr-14 text-center font-mono text-base uppercase tracking-widest text-white placeholder-white/70 shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-sm transition-all focus:bg-white/30 focus:shadow-[0_0_30px_rgba(255,255,255,0.2)] focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white bg-white/30 p-2.5 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm transition-all hover:bg-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              aria-label="Join party"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Description - Below input */}
        <p className="mx-auto mb-8 hidden max-w-lg text-base leading-relaxed text-white drop-shadow-md md:block">
          Organize your Secret Santa gift exchange effortlessly. Create a party, 
          invite your friends, and let us handle the matching magic.
        </p>

        {/* Create Party Button - Ghost/outlined with white border and subtle glow */}
        <button
          type="button"
          onClick={handleCreateParty}
          className="rounded-full border-2 border-white bg-white/10 px-8 py-3 text-sm font-medium tracking-wide text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          Create New Party
        </button>
      </div>
    </div>
  )
}
