import React from 'react'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Metadata } from 'next'
import Providers from '@/components/Providers'
import JsonLd from '@/components/seo/JsonLd'
import AnalyticsConsent from '@/components/AnalyticsConsent'

export const metadata:  Metadata = {
    title: {
        default: 'BlueDot IT | Security, AI Automation, and Full-Stack Development',
        template: '%s | BlueDot IT'
    },
    description: 'BlueDot IT provides application security, AI agent and workflow automation, and full-stack software development for startups, technical teams, and growing businesses.',
    metadataBase: new URL('https://bluedot.it.com'),
    keywords: ['application security consulting', 'AI automation development', 'AI agent development', 'full-stack development', 'Next.js security', 'MCP security', 'workflow automation', 'TypeScript development', 'Python automation', 'secure software development', 'application hardening', 'AI agent security'],
    authors: [{ name: 'Jason O\'Neal' }],
    creator: 'Jason O\'Neal',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://bluedot.it.com',
        siteName: 'BlueDot IT',
        title: 'BlueDot IT | Security, AI Automation, and Full-Stack Development',
        description: 'BlueDot IT provides application security, AI agent and workflow automation, and full-stack software development for startups, technical teams, and growing businesses.',
        images: [{
            url: '/bluedot-logo.png',
            width: 1200,
            height: 630,
            alt: 'BlueDot IT Logo'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BlueDot IT | Security, AI Automation, and Full-Stack Development',
        description: 'BlueDot IT provides application security, AI agent and workflow automation, and full-stack software development for startups, technical teams, and growing businesses.',
        images: ['/bluedot-logo.png'],
        // creator: '@yourhandle', // Add your Twitter handle
    }
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
            <html lang="en" data-theme="bluedot-aurora" suppressHydrationWarning>
                <body className="min-h-dvh flex flex-col">
                <JsonLd />
                <Providers>
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                    <AnalyticsConsent />
                </Providers>
                </body>
            </html>
    )
}
