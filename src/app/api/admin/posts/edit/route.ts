import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminAuth";
import { apiRateLimit } from "@/lib/rateLimit";

export async function PUT(request: NextRequest) {
  const rateLimitResult = await apiRateLimit(request);
  if (rateLimitResult) return rateLimitResult;

  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title, slug, excerpt, content, categoryId, tagIds } = await request.json();

    if (!id || !title || !slug || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.postTag.deleteMany({ where: { postId: Number(id) } });

    const updated = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        slug,
        excerpt,
        content,
        categoryId: categoryId ? Number(categoryId) : null,
        tags: {
          create: tagIds?.map((tagId: number) => ({
            tag: { connect: { id: Number(tagId) } },
          })) || [],
        },
      },
      include: { category: true, tags: { include: { tag: true } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error editing post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}
