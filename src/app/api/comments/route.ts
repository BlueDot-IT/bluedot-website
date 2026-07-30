import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { commentRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
    // 1. Apply Rate Limiting
    const limitReached = await commentRateLimit(req);
    if (limitReached) return limitReached;

    try {
        const session = await auth();
        const body = await req.json();
        const { postId, body: content } = body;

        if (!postId || !content) {
            return NextResponse.json({ error: 'Post ID and comment body are required' }, { status: 400 });
        }

        // 2. Validate Post Existence
        const post = await prisma.post.findUnique({
            where: { id: Number(postId) }
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // 3. Create Comment (Default to unapproved for security)
        const comment = await prisma.comment.create({
            data: {
                postId: Number(postId),
                content: String(content).slice(0, 4000),
                author: session?.user?.name || 'Anonymous',
                email: session?.user?.email || 'anonymous@example.com',
                approved: false // Requirement: manual approval to prevent spam/defacement
            }
        });

        return NextResponse.json({ id: comment.id, status: 'pending' });
    } catch (err) {
        console.error('Comment submission error:', err);
        return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
    }
}
