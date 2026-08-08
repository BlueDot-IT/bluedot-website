import Hero from '@/components/Hero';
import PersonaGrid from '@/components/PersonaGrid';
import CaseHighlights from '@/components/CaseHighlights';
import SelectedWorkPreview from '@/components/SelectedWorkPreview';
import EngagementEntryPoints from '@/components/EngagementEntryPoints';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: {
        absolute: 'BlueDot IT | Security, AI Automation, and Full-Stack Development',
    },
    description: 'BlueDot IT provides application security, AI agent and workflow automation, and full-stack software development for startups, technical teams, and growing businesses.',
    alternates: {
        canonical: 'https://bluedot.it.com',
    },
    openGraph: {
        title: 'BlueDot IT | Security, AI Automation, and Full-Stack Development',
        description: 'BlueDot IT provides application security, AI agent and workflow automation, and full-stack software development for startups, technical teams, and growing businesses.',
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
