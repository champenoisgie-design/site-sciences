import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('ts-node/register')
await import('../prisma/seeds/seed-badges.ts')
