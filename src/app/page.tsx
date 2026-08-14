import Hero from '@/components/Hero';
import HomeIndex from '@/components/HomeIndex';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: {
        absolute: 'Security, AI Automation & Full-Stack Delivery | BlueDot IT',
    },
    description: 'BlueDot IT helps technical founders and lean teams harden production applications, replace fragile manual workflows, and build maintainable software from interface to infrastructure.',
    alternates: {
        canonical: 'https://bluedot.it.com',
    },
    openGraph: {
        title: 'Security, AI Automation & Full-Stack Delivery | BlueDot IT',
        description: 'Harden production applications, replace fragile manual workflows, and build maintainable software from interface to infrastructure.',
        type: 'website',
        url: 'https://bluedot.it.com',
        images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BlueDot IT security, AI automation, and full-stack delivery' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Security, AI Automation & Full-Stack Delivery | BlueDot IT',
        description: 'Harden production applications, replace fragile manual workflows, and build maintainable software from interface to infrastructure.',
        images: ['/twitter-image'],
    },
};

export default function Landing() {
    return (
        <>
            <Hero />
            <HomeIndex />
        </>
    );
}
