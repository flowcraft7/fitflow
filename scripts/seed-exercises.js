require('dotenv').config({ path: '.env.local' })
require('dns').setDefaultResultOrder('ipv4first')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWgerExercises() {
  const res = await fetch(
    'https://wger.de/api/v2/exerciseinfo/?language=2&limit=100&format=json'
  )
  const data = await res.json()
  return data.results
}

function mapCategory(categoryName) {
  const map = {
    Arms: 'Arms',
    Legs: 'Legs',
    Abs: 'Core',
    Back: 'Back',
    Chest: 'Chest',
    Shoulders: 'Shoulders',
    Calves: 'Legs',
  }
  return map[categoryName] || categoryName || 'Other'
}

async function insertWithRetry(row, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const { error } = await supabase.from('exercises').insert(row)
    if (!error) return true
    if (attempt === retries) {
      console.error('Failed after retries:', row.name, error.message)
      return false
    }
    await sleep(500)
  }
  return false
}

async function seed() {
  const exercises = await fetchWgerExercises()
  let inserted = 0

  for (const ex of exercises) {
    const translation = ex.translations?.find((t) => t.language === 2)
    if (!translation || !translation.name) continue

    const image = ex.images?.[0]?.image || null
    const muscleGroup = mapCategory(ex.category?.name)

    const row = {
      name: translation.name,
      muscle_group: muscleGroup,
      media_url: image,
      instructions: translation.description?.replace(/<[^>]*>/g, '').slice(0, 500) || '',
    }

    const success = await insertWithRetry(row)
    if (success) inserted++

    await sleep(150)
  }

  console.log(`Done. Inserted ${inserted} exercises.`)
}

seed()