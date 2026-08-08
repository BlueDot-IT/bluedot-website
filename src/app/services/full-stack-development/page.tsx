import { metadataForServicePage, renderServicePage } from '@/components/services/ServiceLandingPage'

export const metadata = metadataForServicePage('full-stack-development')

export default function ServicePage() {
  return renderServicePage('full-stack-development')
}
