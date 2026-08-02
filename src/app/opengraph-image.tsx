import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'BlueDot IT | Business Automation in Lenoir, NC'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position:  'absolute',
            top:  0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left:  0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
          }}
        />
        
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #60A5FA 0%, #A78BFA 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 10,
            }}
          >
            BlueDot IT
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#E2E8F0',
              fontWeight: 500,
            }}
          >
            Jason O&apos;Neal
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#94A3B8',
              maxWidth: 900,
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            Automation • Reporting • Secure Software
          </div>
        </div>
        
        {/* Bottom tag */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: '#64748B',
          }}
        >
          bluedot.it.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
