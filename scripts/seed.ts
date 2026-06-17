import { readFileSync } from 'fs'
import { join } from 'path'

async function seedDatabase() {
  console.log('Starting database seed...')

  try {
    // Read and execute schema
    const schemaPath = join(__dirname, '../supabase/schema.sql')
    const schema = readFileSync(schemaPath, 'utf8')
    
    console.log('Schema loaded. Please run this in your Supabase SQL editor:')
    console.log('---')
    console.log(schema)
    console.log('---')
    
    // Read seed data
    const seedPath = join(__dirname, '../supabase/seed.sql')
    const seedData = readFileSync(seedPath, 'utf8')
    
    console.log('\nSeed data loaded. Please run this in your Supabase SQL editor after schema:')
    console.log('---')
    console.log(seedData)
    console.log('---')
    
    console.log('\nAfter running both SQL files in Supabase, your database will be ready.')
    
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
