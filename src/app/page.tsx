import Hero from '@/components/Hero';
import PersonaGrid from '@/components/PersonaGrid';
import CaseHighlights from '@/components/CaseHighlights';
import SelectedWorkPreview from '@/components/SelectedWorkPreview';
import EngagementEntryPoints from '@/components/EngagementEntryPoints';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: {
        absolute: 'BlueDot IT | Security, Automation, and Software Delivery',
    },
    description: 'BlueDot IT helps growing teams automate repetitive work, improve application security, and build software they can run and maintain.',
    alternates: {
        canonical: 'https://bluedot.it.com',
    },
    openGraph: {
        title: 'BlueDot IT | Security, Automation, and Software Delivery',
        description: 'BlueDot IT helps growing teams automate repetitive work, improve application security, and build software they can run and maintain.',
        type: 'website',
        url: 'https://bluedot.it.com',
    },
};

export default function Landing() {
    return (
        <>
            <Hero />
            <PersonaGrid />
            <CaseHighlights />
            <SelectedWorkPreview />
            <EngagementEntryPoints />
        </>
    );
}
