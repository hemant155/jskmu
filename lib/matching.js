// lib/matching.js
// Rule-based matching: scores a missing person against unidentified bodies.
// Pure scoring logic kept separate so it can be reused by on-demand matching now,
// and by a weekly cron job later (Phase 3).

// ─── Scoring weights (max 100) ───
// Gender match:      30  (body "Unknown" => 15, since gender is unconfirmed)
// Age overlap:       30
// State match:       25
// City match:        15  (bonus on top of state)
// Date sanity is a HARD filter, not a score: found_date must be >= last_seen_date,
// otherwise the pair is impossible (body found before the person went missing).

const MATCH_THRESHOLD = 60

// Returns true if the body could have been found at/after the person went missing.
// If either date is missing we don't block the match (can't disprove it).
function passesDateSanity(person, body) {
  if (!person.last_seen_date || !body.found_date) return true
  return new Date(body.found_date) >= new Date(person.last_seen_date)
}

function scoreGender(person, body) {
  if (!person.gender || !body.gender) return 0
  if (body.gender === 'Unknown') return 15 // body gender not confirmed
  // missing_persons uses Male/Female/Other; bodies use Male/Female/Unknown
  if (person.gender === body.gender) return 30
  return 0
}

function scoreAge(person, body) {
  // person.age is a single number; body has estimated_age_min / estimated_age_max
  if (person.age == null) return 0
  const min = body.estimated_age_min
  const max = body.estimated_age_max
  if (min == null && max == null) return 0
  // Treat open-ended ranges gracefully
  const lo = min != null ? min : 0
  const hi = max != null ? max : 200
  if (person.age >= lo && person.age <= hi) return 30
  // Near miss: within 3 years of the range edge gets partial credit
  if (person.age >= lo - 3 && person.age <= hi + 3) return 15
  return 0
}

function scoreState(person, body) {
  if (!person.state || !body.state) return 0
  return person.state === body.state ? 25 : 0
}

function scoreCity(person, body) {
  if (!person.city || !body.city) return 0
  // Case-insensitive, trimmed compare
  const a = person.city.trim().toLowerCase()
  const b = body.city.trim().toLowerCase()
  return a && a === b ? 15 : 0
}

// Scores a single (person, body) pair. Returns { score, breakdown } or null if
// the pair fails the hard date-sanity filter.
export function scorePair(person, body) {
  if (!passesDateSanity(person, body)) return null

  const breakdown = {
    gender: scoreGender(person, body),
    age: scoreAge(person, body),
    state: scoreState(person, body),
    city: scoreCity(person, body),
  }
  const score = breakdown.gender + breakdown.age + breakdown.state + breakdown.city
  return { score, breakdown }
}

// Given one missing person and an array of bodies, returns sorted possible matches
// at or above the threshold. Each item: { body, score, breakdown }.
export function findMatchesForPerson(person, bodies) {
  const results = []
  for (const body of bodies) {
    // Skip bodies already marked identified
    if (body.status === 'identified') continue
    const res = scorePair(person, body)
    if (res && res.score >= MATCH_THRESHOLD) {
      results.push({ body, score: res.score, breakdown: res.breakdown })
    }
  }
  // Highest score first
  results.sort((a, b) => b.score - a.score)
  return results
}

export { MATCH_THRESHOLD }  