import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const alt = 'BlueDot IT insight'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params:  Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const post = await prisma.post. findUnique({
    where:  { slug },
    select: { 
      title: true,
      excerpt: true,
      createdAt: true,
    }
  })

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize:  48,
            background: '#0F172A',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Post Not Found
        </div>
      ),
      { ...size }
    )
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection:  'column',
          padding:  '60px 80px',
          color: 'white',
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
            background: 'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
          }}
        />
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 15,
            marginBottom: 40,
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #60A5FA 0%, #A78BFA 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            BlueDot IT
          </div>
          <div
            style={{
              fontSize:  24,
              color: '#64748B',
            }}
          >
            •
          </div>
          <div
            style={{
              fontSize: 20,
              color:  '#94A3B8',
            }}
          >
            {formattedDate}
          </div>
        </div>
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent:  'center',
            flex:  1,
            zIndex:  1,
          }}
        >
          <div
            style={{
              fontSize: post.title.length > 60 ? 52 : 64,
              fontWeight: 'bold',
              lineHeight: 1.2,
              color: '#F1F5F9',
              marginBottom: 20,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.title}
          </div>
          
          {post. excerpt && (
            <div
              style={{
                fontSize: 24,
                lineHeight: 1.5,
                color: '#94A3B8',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {post.excerpt}
            </div>
          )}
        </div>
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 40,
            paddingTop:  30,
            borderTop:  '2px solid #334155',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: '#CBD5E1',
            }}
          >
            Jason O&apos;Neal
          </div>
          <div
            style={{
              fontSize: 20,
              color: '#64748B',
            }}
          >
            bluedot.it.com/blog
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
