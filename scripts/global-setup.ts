// import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { config } from 'dotenv'

const envFile = path.resolve(path.join(process.cwd(), '.env.test'))
config({ path: envFile, quiet: true })

console.log('⚠️ Running global setup for Playwright')

export default async function globalSetup() {
  const testDbUrl = process.env.DATABASE_URL
  const testDbName = `secretsanta_test`

  if (!process.env.DATABASE_URL?.includes('test')) {
    throw new Error('❌ Failed to load test database .env config')
  }

  try {
    console.log(`🧹 Dropping test database (if exists): ${testDbName}`)
    execSync(
      `docker exec secret-santa-db sh -c 'psql -U postgres -c "DROP DATABASE IF EXISTS \"${testDbName}\" WITH (FORCE)"'`,
      { stdio: 'inherit' },
    )
  } catch (error) {
    console.error('❌ Failed to drop test database', error)
    throw error
  }

  console.log(`🧪 Creating test database: ${testDbName}`)

  try {
    execSync(
      `docker exec secret-santa-db sh -c 'psql -U postgres -c "CREATE DATABASE \"${testDbName}\""'`,
      { stdio: 'inherit' },
    )
  } catch (error) {
    console.error('❌ Failed to create test database', error)
    throw error
  }

  try {
    execSync(
      `DATABASE_URL=${testDbUrl} pnpx prisma migrate deploy --schema=./prisma/schema.prisma`,
      {
        env: { ...process.env },
        stdio: 'inherit',
      },
    )
    // execSync(`pnpm prisma db seed`, {
    //   env: { ...process.env, DATABASE_URL: testDbUrl },
    //   stdio: 'inherit',
    // })
  } catch (error) {
    console.error('❌ Failed to migrate or seed the database', error)
    throw error
  }
}
