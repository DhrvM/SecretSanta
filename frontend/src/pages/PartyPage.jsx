import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Footer } from '../components/Footer'
import { getParty, getParticipants, getParticipantsAdmin, joinParty, removeParticipant, updateParticipant, lockParty, deleteParty, updateParty, resendAllEmails } from '../services/api'
import { motion } from 'framer-motion'

export default function PartyPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [party, setParty] = useState(null)
  const [participants, setParticipants] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Form states
  const [joinForm, setJoinForm] = useState({ name: '', email: '' })
  const [adminAuthOpen, setAdminAuthOpen] = useState(false)
  
  // Editing state
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '' })

  // Party Editing State
  const [isEditingParty, setIsEditingParty] = useState(false)
  const [editPartyForm, setEditPartyForm] = useState({})
  
  // Add loading state for locking
  const [isLocking, setIsLocking] = useState(false)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    loadData()
  }, [id])

  async function loadData() {
    try {
      const partyData = await getParty(id)
      setParty(partyData)
      
      // If we already have admin access, fetch full details
      if (isAdmin) {
        const pList = await getParticipantsAdmin(id, passcode)
        setParticipants(pList)
      } else {
        const pList = await getParticipants(id)
        setParticipants(pList)
      }
    } catch (err) {
      setError(err.message || 'Failed to load party')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    try {
      // Verify passcode by trying to fetch admin list
      const pList = await getParticipantsAdmin(id, passcode)
      setParticipants(pList)
      setIsAdmin(true)
      setAdminAuthOpen(false)
    } catch (err) {
      alert('Invalid passcode')
    }
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    try {
      await joinParty(id, joinForm)
      setJoinForm({ name: '', email: '' })
      loadData() // Refresh list
    } catch (err) {
      alert(err.detail || 'Failed to join')
    }
  }

  const handleRemove = async (pid) => {
    if (!confirm('Remove this participant?')) return
    try {
      await removeParticipant(id, pid, passcode)
      loadData()
    } catch (err) {
      alert(err.detail || 'Failed to remove')
    }
  }

  const startEditing = (p) => {
    setEditingId(p.id)
    setEditForm({ name: p.name, email: p.email })
  }

  const saveEdit = async () => {
    try {
      await updateParticipant(id, editingId, passcode, {
        new_name: editForm.name,
        new_email: editForm.email
      })
      setEditingId(null)
      loadData()
    } catch (err) {
      alert(err.detail || 'Failed to update')
    }
  }

  const startEditingParty = () => {
    setEditPartyForm({
      name: party.name,
      description: party.description || '',
      event_date: party.event_date,
      event_time: party.event_time,
      budget: party.budget
    })
    setIsEditingParty(true)
  }

  const savePartyEdit = async () => {
    try {
      const updated = await updateParty(id, passcode, editPartyForm)
      setParty(updated)
      setIsEditingParty(false)
    } catch (err) {
      alert(err.detail || 'Failed to update party')
    }
  }

  const handleLock = async () => {
    if (isLocking) return
    if (!confirm('This will close the party and send emails. Continue?')) return
    
    setIsLocking(true)
    try {
      await lockParty(id, passcode)
      loadData()
      alert('Party Locked & Emails Sent!')
    } catch (err) {
      alert(err.detail || 'Failed to lock party')
    } finally {
      setIsLocking(false)
    }
  }

  const handleResendAll = async () => {
    if (isResending) return
    if (!confirm('Resend all match emails to every participant?')) return

    setIsResending(true)
    try {
      const res = await resendAllEmails(id, passcode)
      alert(res.message || 'Resent match emails.')
    } catch (err) {
      alert(err.detail || 'Failed to resend emails')
    } finally {
      setIsResending(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('DELETE PARTY? This cannot be undone.')) return
    try {
      await deleteParty(id, passcode)
      navigate('/')
    } catch (err) {
      alert(err.detail || 'Failed to delete')
    }
  }

  if (isLoading) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>
  if (error) return <div className="flex h-screen items-center justify-center text-red-400">{error}</div>

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
        
        <div className="flex min-h-full flex-col px-sides py-12 pb-[var(--footer-safe-area)]">
          
          {/* Header */}
          <div className="mx-auto w-full max-w-4xl text-center mb-12">
            {isEditingParty ? (
              <div className="space-y-4 rounded-3xl border border-white/20 bg-black/20 p-8 backdrop-blur-xl text-left">
                <h2 className="text-2xl font-serif text-white mb-4 text-center">Edit Party Details</h2>
                
                <div>
                  <label className="block text-xs text-white/60 uppercase tracking-wider">Party Name</label>
                  <input 
                    value={editPartyForm.name}
                    onChange={(e) => setEditPartyForm({...editPartyForm, name: e.target.value})}
                    className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:bg-white/20 outline-none text-xl font-serif"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/60 uppercase tracking-wider">Description</label>
                  <textarea 
                    value={editPartyForm.description}
                    onChange={(e) => setEditPartyForm({...editPartyForm, description: e.target.value})}
                    className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:bg-white/20 outline-none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-white/60 uppercase tracking-wider">Date</label>
                    <input 
                      type="date"
                      value={editPartyForm.event_date}
                      onChange={(e) => setEditPartyForm({...editPartyForm, event_date: e.target.value})}
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:bg-white/20 outline-none [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 uppercase tracking-wider">Time</label>
                    <input 
                      value={editPartyForm.event_time}
                      onChange={(e) => setEditPartyForm({...editPartyForm, event_time: e.target.value})}
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:bg-white/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 uppercase tracking-wider">Budget</label>
                    <input 
                      type="number"
                      value={editPartyForm.budget}
                      onChange={(e) => setEditPartyForm({...editPartyForm, budget: parseInt(e.target.value)})}
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:bg-white/20 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 justify-center">
                  <button 
                    onClick={savePartyEdit}
                    className="rounded-full bg-white px-8 py-2 font-medium text-black hover:scale-105 transition-transform"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditingParty(false)}
                    className="rounded-full border border-white/30 px-8 py-2 font-medium text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-tight text-white drop-shadow-lg mb-4">
                  {party.name}
                </h1>
                <p className="text-white/80 text-lg">{party.description}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-medium text-white/90">
                  <span className="rounded-full bg-white/10 px-4 py-1 backdrop-blur-sm border border-white/20">
                    📅 {new Date(party.event_date + 'T00:00:00').toLocaleDateString()}
                  </span>
                  <span className="rounded-full bg-white/10 px-4 py-1 backdrop-blur-sm border border-white/20">
                    🕒 {party.event_time}
                  </span>
                  <span className="rounded-full bg-white/10 px-4 py-1 backdrop-blur-sm border border-white/20">
                    💰 Budget: {party.budget} {party.currency}
                  </span>
                  <span className={`rounded-full px-4 py-1 backdrop-blur-sm border ${party.status ? 'bg-green-500/20 border-green-400/30' : 'bg-red-500/20 border-red-400/30'}`}>
                    {party.status ? '🟢 Open' : '🔒 Locked'}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-2">
            
            {/* LEFT COL: Join / Status */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/20 bg-black/10 p-8 backdrop-blur-md">
                <h2 className="mb-6 font-serif text-3xl text-white">
                  {party.status ? 'Join Party' : 'Matching Complete'}
                </h2>
                
                {party.status ? (
                  <form onSubmit={handleJoin} className="space-y-4">
                    <div>
                      <label className="ml-2 block text-xs font-medium uppercase tracking-wider text-white/70">Name</label>
                      <input
                        required
                        value={joinForm.name}
                        onChange={(e) => setJoinForm({...joinForm, name: e.target.value})}
                        className="mt-1 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/30 focus:border-white focus:bg-white/20 focus:outline-none"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="ml-2 block text-xs font-medium uppercase tracking-wider text-white/70">Email</label>
                      <input
                        required
                        type="email"
                        value={joinForm.email}
                        onChange={(e) => setJoinForm({...joinForm, email: e.target.value})}
                        className="mt-1 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/30 focus:border-white focus:bg-white/20 focus:outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full rounded-full bg-white py-3 font-bold text-black transition-transform hover:scale-[1.02]"
                    >
                      Join the Fun
                    </button>
                  </form>
                ) : (
                  <div className="text-center text-white/80">
                    <p className="mb-4">Matches have been assigned and emails sent!</p>
                    <p className="text-sm">Check your inbox (and spam folder).</p>
                  </div>
                )}
              </div>

              {/* Host Controls Toggle */}
              {!isAdmin && (
                <button 
                  onClick={() => setAdminAuthOpen(!adminAuthOpen)}
                  className="text-sm text-white/50 hover:text-white transition-colors w-full text-center"
                >
                  Are you the host?
                </button>
              )}
              
              {/* Admin Auth Form */}
              {adminAuthOpen && !isAdmin && (
                <form onSubmit={handleAdminLogin} className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md transition-all">
                  <h3 className="mb-4 text-lg font-medium text-white">Host Login</h3>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter Master Passcode"
                    className="mb-4 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:outline-none"
                  />
                  <button type="submit" className="w-full rounded-lg bg-white/10 py-2 text-white hover:bg-white/20">
                    Access Controls
                  </button>
                </form>
              )}

              {/* Admin Controls Panel */}
              {isAdmin && (
                <div className="rounded-3xl border border-red-500/30 bg-red-900/20 p-8 backdrop-blur-md">
                  <h2 className="mb-4 font-serif text-2xl text-white">Host Controls</h2>
                  <div className="space-y-3">
                    {/* Edit Party Details Button */}
                    <button 
                      onClick={startEditingParty}
                      className="w-full rounded-xl bg-white/10 py-3 font-medium text-white hover:bg-white/20 border border-white/10"
                    >
                      ✏️ Edit Party Details
                    </button>
                    
                    {party.status && (
                      <button 
                        onClick={handleLock}
                        disabled={isLocking}
                        className={`w-full rounded-xl py-3 font-medium text-white transition-colors ${
                          isLocking ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600/80 hover:bg-green-500'
                        }`}
                      >
                         {isLocking ? '⏳ Matching...' : '🔒 Lock & Start Matching'}
                      </button>
                    )}
                    {!party.status && (
                      <button 
                        onClick={handleResendAll}
                        disabled={isResending}
                        className={`w-full rounded-xl py-3 font-medium text-white transition-colors ${
                          isResending ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600/80 hover:bg-blue-500'
                        }`}
                      >
                        {isResending ? '⏳ Resending...' : '📧 Resend All Emails'}
                      </button>
                    )}
                    <button 
                      onClick={handleDelete}
                      className="w-full rounded-xl border border-red-500/50 bg-transparent py-3 font-medium text-red-200 hover:bg-red-900/50"
                    >
                      ⚠️ Delete Party
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COL: Participants */}
            <div className="rounded-3xl border border-white/20 bg-black/10 p-8 backdrop-blur-md">
              <div className="mb-6 flex items-end justify-between">
                <h2 className="font-serif text-3xl text-white">Participants</h2>
                <span className="text-sm text-white/60">{participants.length} elves joined</span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20">
                {participants.length === 0 && (
                  <p className="text-center text-white/40 italic py-8">No one has joined yet...</p>
                )}
                
                {participants.map((p) => (
                  <div key={p.id} className="group flex items-center justify-between rounded-xl bg-white/5 p-4 hover:bg-white/10 transition-colors">
                    {editingId === p.id ? (
                      <div className="flex-1 space-y-2 mr-2">
                        <input 
                          value={editForm.name} 
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full rounded bg-black/30 px-2 py-1 text-sm text-white"
                        />
                        <input 
                          value={editForm.email} 
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="w-full rounded bg-black/30 px-2 py-1 text-sm text-white"
                        />
                        <div className="flex gap-2">
                          <button onClick={saveEdit} className="text-xs text-green-400 hover:underline">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-xs text-white/50 hover:underline">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <p className="font-medium text-white">{p.name}</p>
                        {isAdmin && <p className="text-xs text-white/50">{p.email}</p>}
                      </div>
                    )}

                    {isAdmin && !editingId && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEditing(p)}
                          className="rounded p-1.5 text-blue-300 hover:bg-blue-500/20" 
                          title="Edit"
                        >
                          ✏️
                        </button>
                        {party.status && (
                          <button 
                            onClick={() => handleRemove(p.id)}
                            className="rounded p-1.5 text-red-300 hover:bg-red-500/20" 
                            title="Remove"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
        <Footer />
      </div>
    </motion.main>
  )
}
