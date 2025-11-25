const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export async function createParty(partyData) {
  const response = await fetch(`${API_URL}/party`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partyData),
  })
  if (!response.ok) throw await response.json()
  return response.json()
}

export async function getParty(partyId) {
  const response = await fetch(`${API_URL}/party/${partyId}`)
  if (!response.ok) throw await response.json()
  return response.json()
}

export async function getParticipants(partyId) {
  const response = await fetch(`${API_URL}/party/${partyId}/participants`)
  if (!response.ok) throw await response.json()
  return response.json()
}

export async function getParticipantsAdmin(partyId, passcode) {
  const response = await fetch(`${API_URL}/party/${partyId}/participants/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  })
  if (!response.ok) throw await response.json()
  return response.json()
}

export async function joinParty(partyId, participantData) {
  const response = await fetch(`${API_URL}/party/${partyId}/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(participantData),
  })
  if (!response.ok) throw await response.json()
  return response.json()
}

export async function deleteParty(partyId, passcode) {
  const response = await fetch(`${API_URL}/party/${partyId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  })
  if (!response.ok) throw await response.json()
  return true
}

export async function lockParty(partyId, passcode) {
  const response = await fetch(`${API_URL}/party/${partyId}/lock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  })
  if (!response.ok) throw await response.json()
  return response.json()
}

export async function removeParticipant(partyId, participantId, passcode) {
  const response = await fetch(`${API_URL}/party/${partyId}/participants/${participantId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  })
  if (!response.ok) throw await response.json()
  return true
}

export async function updateParticipant(partyId, participantId, passcode, data) {
  const response = await fetch(`${API_URL}/party/${partyId}/participants/${participantId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode, ...data }),
  })
  if (!response.ok) throw await response.json()
  return response.json()
}
