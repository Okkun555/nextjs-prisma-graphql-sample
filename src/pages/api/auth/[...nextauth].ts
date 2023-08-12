import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'

import { prisma } from '@/libs/prisma'

const EMAIL_SERVER: string | undefined = process.env.EMAIL_SERVER
const EMAIL_FROM: string | undefined = process.env.EMAIL_FROM
const NEXT_AUTH_SECRET: string | undefined = process.env.NEXT_AUTH_SECRET

// 環境変数のset状況をチェック
if (!EMAIL_SERVER) {
  throw new Error('EMAIL_SERVER is not set')
} else if (!EMAIL_FROM) {
  throw new Error('EMAIL_FROM is not set')
} else if (!NEXT_AUTH_SECRET) {
  throw new Error('NEXT_AUTH_SECRET is not set')
}

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: EMAIL_SERVER,
      from: EMAIL_FROM,
    }),
  ],
  secret: NEXT_AUTH_SECRET,
}

export default NextAuth(authOptions)
