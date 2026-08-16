import React from 'react'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Metadata } from 'next'
import JsonLd from '@/components/seo/JsonLd'
import AnalyticsConsent from '@/components/AnalyticsConsent'

export const metadata:  Metadata = {
    title: {
        default: 'Security, AI Automation & Full-Stack Delivery | BlueDot IT',
        template: '%s | BlueDot IT, LLC'
    },
    description: 'BlueDot IT, LLC helps technical founders and lean teams harden production applications, replace fragile manual workflows, and build maintainable software from interface to infrastructure.',
    metadataBase: new URL('https://bluedot.it.com'),
    keywords: ['application security consulting', 'AI automation development', 'AI agent development', 'full-stack development', 'Next.js security', 'MCP security', 'workflow automation', 'TypeScript development', 'Python automation', 'secure software development', 'application hardening', 'AI agent security'],
    authors: [{ name: 'Jason O\'Neal' }],
    creator: 'Jason O\'Neal',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://bluedot.it.com',
        siteName: 'BlueDot IT, LLC',
        title: 'Security, AI Automation & Full-Stack Delivery | BlueDot IT, LLC',
        description: 'Harden production applications, replace fragile manual workflows, and build maintainable software from interface to infrastructure.',
        images: [{
            url: '/opengraph-image',
            width: 1200,
            height: 630,
            alt: 'BlueDot IT, LLC security, AI automation, and full-stack delivery'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Security, AI Automation & Full-Stack Delivery | BlueDot IT, LLC',
        description: 'Harden production applications, replace fragile manual workflows, and build maintainable software from interface to infrastructure.',
        images: ['/twitter-image'],
    }
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
            <html lang="en" data-theme="bluedot-aurora" suppressHydrationWarning>
                <body className="signal-app min-h-dvh flex flex-col">
                <JsonLd />
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <AnalyticsConsent />
                </body>
            </html>
    )
}
