export function approvedCommentsWhere(postId: number) {
  return { postId, approved: true } as const;
}
