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
        default: 'BlueDot IT | Business Automation in Lenoir, NC',
        template: '%s | BlueDot IT'
    },
    description: 'Practical workflow automation, operational reporting, secure websites, and custom software for small businesses in Lenoir, Caldwell County, and remote teams.',
    metadataBase: new URL('https://bluedot.it.com'),
    keywords: ['business automation Lenoir NC', 'operational reporting', 'workflow automation', 'custom software', 'web development', 'security reviews', 'server hardening'],
    authors: [{ name: 'Jason O\'Neal' }],
    creator: 'Jason O\'Neal',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://bluedot.it.com',
        siteName: 'BlueDot IT',
        title: 'BlueDot IT | Business Automation in Lenoir, NC',
        description: 'Workflow automation, operational reporting, secure websites, and custom software built around real business needs.',
        images: [{
            url: '/bluedot-logo.png',
            width: 1200,
            height: 630,
            alt: 'BlueDot IT Logo'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BlueDot IT | Business Automation in Lenoir, NC',
        description: 'Workflow automation, operational reporting, secure websites, and custom software built around real business needs.',
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
