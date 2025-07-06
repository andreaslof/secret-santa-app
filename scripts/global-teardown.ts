import { execSync } from 'child_process'
import path from 'path'
import dotenv from 'dotenv'

export default async function globalTeardown() {
  console.log('⚙️ Playwright global teardown executing...')

  const envPath = path.join(process.cwd(), '.env.test')
  dotenv.config({ path: envPath, quiet: true })

  const dbUrl = process.env.DATABASE_URL
  const dbName = dbUrl?.split('/').pop()

  if (!dbName || dbName === 'secretsanta') {
    throw new Error('❌ Invalid test DB name or missing DATABASE_URL')
  }

  try {
    console.log(`🧹 Dropping test database: ${dbName}`)
    execSync(
      `docker exec secret-santa-db sh -c 'psql -U postgres -c "DROP DATABASE IF EXISTS \"${dbName}\" WITH (FORCE)"'`,
      { stdio: 'inherit' },
    )
  } catch (error) {
    console.error('❌ Failed to drop test database', error)
    throw error
  }
}
