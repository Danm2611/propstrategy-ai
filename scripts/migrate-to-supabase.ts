import { PrismaClient as SqliteClient } from '@prisma/client'
import { PrismaClient as PostgresClient } from '@prisma/client'

// Create two separate Prisma clients
const sqliteDb = new SqliteClient({
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
})

// This will use the DATABASE_URL from .env (your Supabase URL)
const postgresDb = new PostgresClient()

async function migrate() {
  console.log('Starting migration from SQLite to Supabase...')

  try {
    // 1. Migrate Users
    console.log('Migrating users...')
    const users = await sqliteDb.user.findMany()
    for (const user of users) {
      await postgresDb.user.create({
        data: {
          id: user.id,
          email: user.email,
          password: user.password,
          name: user.name,
          credits: user.credits,
          subscription: user.subscription,
          subscriptionEnd: user.subscriptionEnd,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      })
    }
    console.log(`Migrated ${users.length} users`)

    // 2. Migrate Reports
    console.log('Migrating reports...')
    const reports = await sqliteDb.report.findMany()
    for (const report of reports) {
      await postgresDb.report.create({
        data: {
          id: report.id,
          userId: report.userId,
          propertyAddress: report.propertyAddress,
          propertyPostcode: report.propertyPostcode,
          purchasePrice: report.purchasePrice,
          propertyType: report.propertyType,
          condition: report.condition,
          reportType: report.reportType,
          status: report.status,
          reportUrl: report.reportUrl,
          reportData: report.reportData,
          createdAt: report.createdAt,
          updatedAt: report.updatedAt,
        }
      })
    }
    console.log(`Migrated ${reports.length} reports`)

    // 3. Migrate Payments
    console.log('Migrating payments...')
    const payments = await sqliteDb.payment.findMany()
    for (const payment of payments) {
      await postgresDb.payment.create({
        data: {
          id: payment.id,
          userId: payment.userId,
          stripePaymentId: payment.stripePaymentId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          credits: payment.credits,
          createdAt: payment.createdAt,
        }
      })
    }
    console.log(`Migrated ${payments.length} payments`)

    // 4. Migrate CreditLogs
    console.log('Migrating credit logs...')
    const creditLogs = await sqliteDb.creditLog.findMany()
    for (const log of creditLogs) {
      await postgresDb.creditLog.create({
        data: {
          id: log.id,
          userId: log.userId,
          creditsChange: log.creditsChange,
          creditsAfter: log.creditsAfter,
          transactionType: log.transactionType,
          description: log.description,
          relatedId: log.relatedId,
          createdAt: log.createdAt,
        }
      })
    }
    console.log(`Migrated ${creditLogs.length} credit logs`)

    // 5. Migrate Subscriptions
    console.log('Migrating subscriptions...')
    const subscriptions = await sqliteDb.subscription.findMany()
    for (const sub of subscriptions) {
      await postgresDb.subscription.create({
        data: {
          id: sub.id,
          userId: sub.userId,
          stripeSubscriptionId: sub.stripeSubscriptionId,
          stripePriceId: sub.stripePriceId,
          status: sub.status,
          currentPeriodEnd: sub.currentPeriodEnd,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
          createdAt: sub.createdAt,
          updatedAt: sub.updatedAt,
        }
      })
    }
    console.log(`Migrated ${subscriptions.length} subscriptions`)

    console.log('Migration completed successfully!')

  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  } finally {
    await sqliteDb.$disconnect()
    await postgresDb.$disconnect()
  }
}

// Run migration
migrate().catch(console.error)