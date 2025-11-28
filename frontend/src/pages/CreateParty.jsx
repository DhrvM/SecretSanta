import { useState } from 'react'
import { Background } from '../components/Background'
import { Footer } from '../components/Footer'
import { ArrowRight } from '../components/Icons'
import { createParty } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CreateParty() {
  const [step, setStep] = useState('form') // 'form' | 'success'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    organizer_name: '',
    organizer_email: '',
    event_date: '',
    event_time: '12:00 PM',
    budget: '',
    currency: 'USD',
    participate: true,
    description: ''
  })

  const [createdParty, setCreatedParty] = useState(null)

  const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString())
  const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'))

  const handleTimeChange = (type, value) => {
    const [timeStr, period] = formData.event_time.split(' ')
    const [hour, minute] = timeStr.split(':')
    
    let newHour = hour
    let newMinute = minute
    let newPeriod = period

    if (type === 'hour') newHour = value
    if (type === 'minute') newMinute = value
    if (type === 'period') newPeriod = value

    setFormData(prev => ({
      ...prev,
      event_time: `${newHour}:${newMinute} ${newPeriod}`
    }))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const partyId = Math.random().toString(36).substring(2, 8).toUpperCase()
      
      const payload = {
        id: partyId,
        ...formData,
        budget: formData.budget ? parseInt(formData.budget) : 0
      }

      const result = await createParty(payload)
      setCreatedParty(result)
      setStep('success')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyLink = () => {
    const link = `${window.location.origin}/SecretSanta/#/party/${createdParty.id}`
    navigator.clipboard.writeText(link)
    alert('Link copied to clipboard!')
  }

  return (
    <motion.main 
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.4 }}
      className="p-4 h-[100dvh] w-full md:p-6 overflow-hidden"
    >
      <div className="relative h-full w-full overflow-y-auto rounded-3xl">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 z-50 flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-sm text-white/70 backdrop-blur-md border border-white/30 transition-all hover:bg-black/40 hover:text-white"
        >
          ← Home
        </button>

        <Background />
        
        <div className="flex min-h-full flex-col items-center justify-center px-sides py-12 pb-[var(--footer-safe-area)]">
          <div className="mx-auto w-full max-w-2xl text-center">
            
            <h1 className="mb-8 font-serif text-[clamp(2.5rem,8vw,5rem)] leading-[0.9] tracking-tight text-white drop-shadow-lg">
              {step === 'form' ? 'Create Party' : 'Party Created!'}
            </h1>

            {step === 'form' ? (
              <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-6 text-left">
                
                {error && (
                  <div className="rounded-lg bg-red-500/20 p-4 text-center text-sm text-white backdrop-blur-sm border border-red-500/50">
                    {error}
                  </div>
                )}

                <div className="space-y-4 rounded-2xl border border-white/20 bg-black/10 p-6 backdrop-blur-md">
                  <h2 className="font-serif text-2xl text-white">Party Details</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80">Party Name</label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Office Xmas Party"
                      className="mt-1 w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:border-white focus:bg-white/20 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80">Date</label>
                      <input
                        required
                        type="date"
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:border-white focus:bg-white/20 focus:outline-none [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80">Time</label>
                      <div className="mt-1 flex gap-2">
                        <select
                          value={formData.event_time.split(':')[0]}
                          onChange={(e) => handleTimeChange('hour', e.target.value)}
                          className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white focus:border-white focus:bg-white/20 focus:outline-none appearance-none cursor-pointer text-center"
                        >
                          {HOURS.map(h => (
                            <option key={h} value={h} className="text-black">{h}</option>
                          ))}
                        </select>
                        <span className="flex items-center text-white/50">:</span>
                        <select
                          value={formData.event_time.split(' ')[0].split(':')[1]}
                          onChange={(e) => handleTimeChange('minute', e.target.value)}
                          className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white focus:border-white focus:bg-white/20 focus:outline-none appearance-none cursor-pointer text-center"
                        >
                          {MINUTES.map(m => (
                            <option key={m} value={m} className="text-black">{m}</option>
                          ))}
                        </select>
                        <select
                          value={formData.event_time.split(' ')[1]}
                          onChange={(e) => handleTimeChange('period', e.target.value)}
                          className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white focus:border-white focus:bg-white/20 focus:outline-none appearance-none cursor-pointer text-center"
                        >
                          <option value="AM" className="text-black">AM</option>
                          <option value="PM" className="text-black">PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80">Budget ($)</label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="50"
                      className="mt-1 w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:border-white focus:bg-white/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-white/20 bg-black/10 p-6 backdrop-blur-md">
                  <h2 className="font-serif text-2xl text-white">Your Details</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80">Your Name</label>
                    <input
                      required
                      name="organizer_name"
                      value={formData.organizer_name}
                      onChange={handleChange}
                      placeholder="Santa Claus"
                      className="mt-1 w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:border-white focus:bg-white/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80">Your Email</label>
                    <input
                      required
                      type="email"
                      name="organizer_email"
                      value={formData.organizer_email}
                      onChange={handleChange}
                      placeholder="santa@northpole.com"
                      className="mt-1 w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:border-white focus:bg-white/20 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="participate"
                      name="participate"
                      checked={formData.participate}
                      onChange={handleChange}
                      className="h-5 w-5 rounded border-white/30 bg-white/10 text-white focus:ring-offset-0"
                    />
                    <label htmlFor="participate" className="text-sm text-white/90">
                      I want to participate in the gift exchange
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full overflow-hidden rounded-full border-2 border-white bg-white/10 py-4 font-medium text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Party'}
                </button>

              </form>
            ) : (
              <div className="mx-auto max-w-lg space-y-8 rounded-3xl border border-white/20 bg-black/20 p-8 backdrop-blur-xl">
                <div className="space-y-2 text-center">
                  <p className="text-lg text-white/80">Share this link with your friends:</p>
                  <div 
                    onClick={copyLink}
                    className="cursor-pointer rounded-xl border border-dashed border-white/40 bg-white/5 p-4 transition-all hover:bg-white/10"
                  >
                    <p className="font-mono text-xl text-white break-all">
                      {window.location.origin}/SecretSanta/#/party/{createdParty.id}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-widest text-white/50">Click to Copy</p>
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <p className="text-lg text-white/80">Your Master Passcode:</p>
                  <div className="rounded-xl bg-red-500/20 border border-red-500/30 p-4">
                    <p className="font-mono text-2xl font-bold text-white tracking-widest">
                      {createdParty.passcode}
                    </p>
                    <p className="mt-2 text-xs text-white/70">
                      ⚠️ Save this! You need it to start the matching or delete the party.
                      We've also emailed it to you.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/party/${createdParty.id}`)}
                  className="w-full rounded-full bg-white py-3 font-medium text-black transition-transform hover:scale-105"
                >
                  Go to Party Page <ArrowRight className="ml-2 inline h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </motion.main>
  )
}
