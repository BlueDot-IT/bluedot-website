import Hero from '@/components/Hero';
import PersonaGrid from '@/components/PersonaGrid';
import CaseHighlights from '@/components/CaseHighlights';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Business Automation in Lenoir, NC',
    description: 'BlueDot IT builds practical reporting systems, workflow automations, websites, and secure business tools for Lenoir, Caldwell County, and remote teams.',
    alternates: {
        canonical: 'https://bluedot.it.com',
    },
};

export default function Landing() {
    return (
        <main>
            <Hero />
            <PersonaGrid />
            <CaseHighlights />
        </main>
    );
}
