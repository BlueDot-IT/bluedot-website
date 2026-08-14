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
        default: 'BlueDot IT | Security, Automation, and Software Delivery',
        template: '%s | BlueDot IT'
    },
    description: 'BlueDot IT helps growing teams automate repetitive work, improve application security, and build software they can run and maintain.',
    metadataBase: new URL('https://bluedot.it.com'),
    keywords: ['application security consulting', 'AI automation development', 'AI agent development', 'full-stack development', 'Next.js security', 'MCP security', 'workflow automation', 'TypeScript development', 'Python automation', 'secure software development', 'application hardening', 'AI agent security'],
    authors: [{ name: 'Jason O\'Neal' }],
    creator: 'Jason O\'Neal',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://bluedot.it.com',
        siteName: 'BlueDot IT',
        title: 'BlueDot IT | Security, Automation, and Software Delivery',
        description: 'BlueDot IT helps growing teams automate repetitive work, improve application security, and build software they can run and maintain.',
        images: [{
            url: '/bluedot-logo.png',
            width: 1200,
            height: 630,
            alt: 'BlueDot IT Logo'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BlueDot IT | Security, Automation, and Software Delivery',
        description: 'BlueDot IT helps growing teams automate repetitive work, improve application security, and build software they can run and maintain.',
        images: ['/bluedot-logo.png'],
        // creator: '@yourhandle', // Add your Twitter handle
    }
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
            <html lang="en" data-theme="bluedot-aurora" suppressHydrationWarning>
                <body className="signal-app min-h-dvh flex flex-col">
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
