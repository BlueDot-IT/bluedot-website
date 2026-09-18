import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'BlueDot IT | Security, Automation, and Software'
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
          background:  'linear-gradient(135deg, #07121f 0%, #102b44 55%, #174967 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent:  'center',
          color:  'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left:  0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(6, 103, 255, 0.25) 0%, transparent 50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 80% 50%, rgba(138, 213, 252, 0.18) 0%, transparent 50%)',
          }}
        />
        
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
              fontSize:  72,
              fontWeight:  'bold',
              background:  'linear-gradient(90deg, #2183ff 0%, #8ad5fc 100%)',
              backgroundClip:  'text',
              color:  'transparent',
              marginBottom: 10,
            }}
          >
            BlueDot IT
          </div>
          <div
            style={{
              fontSize: 32,
              color:  '#E2E8F0',
              fontWeight: 500,
            }}
          >
            Security. Automation. Software.
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#94A3B8',
              maxWidth:  900,
              textAlign:  'center',
              lineHeight: 1.4,
            }}
          >
            Complex systems. Brighter possibilities.
          </div>
        </div>
        
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
