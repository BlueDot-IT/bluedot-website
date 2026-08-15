"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  Plus,
  MessageSquare,
  FileText,
  LogOut,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  BarChart3,
} from "lucide-react";
import { DeletePostModal } from "@/components/DeletePostModal";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

  useEffect(() => {
    if (session) fetchPosts();
  }, [session]);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/posts");
      if (res.ok) {
        setPosts(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleted = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeleteTarget(null);
  };

  if (!session) {
    return (
      <div className="page-shell py-20 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <User className="h-10 w-10 text-primary" />
            </div>
            <span>
              Admin Access Required
            </span>
            <p className="text-base-content/70">
              Please sign in to access the admin dashboard.
            </p>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")}>
              <User className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-shell py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold heading-accent">
          Admin Dashboard
        </h1>
        <p className="text-base-content/70">
          Manage posts and comments from this private workspace.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center md:justify-end">
        <Button onClick={() => router.push("/admin/post/create")}>
          <Plus className="h-4 w-4" /> New Post
        </Button>
        <Button
          onClick={() => router.push("/admin/comments")}
          style="outline"
        >
          <MessageSquare className="h-4 w-4" /> Comments
        </Button>
        <Button
          onClick={() => signOut()}
          style="outline"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Posts",
            icon: FileText,
            value: posts.length,
            detail: "All published posts",
          },
          {
            label: "Recent Posts",
            icon: Calendar,
            value: posts.filter(
              (p) =>
                new Date(p.createdAt) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length,
            detail: "Added in last 7 days",
          },
          {
            label: "Comments",
            icon: MessageSquare,
            value: "Review",
            detail: "Open the moderation queue",
          },
          {
            label: "Analytics",
            icon: BarChart3,
            value: "Off",
            detail: "No traffic service connected",
          },
        ].map((item, idx) => (
          <Card
            key={idx}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-medium text-secondary">
                {item.label}
              </span>
              <item.icon className="h-4 w-4 text-base-content/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {item.value}
              </div>
              <p className="text-xs text-base-content/70">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Posts Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <span className="text-xl text-secondary">Blog Posts</span>
              <p className="text-base-content/70">
                Manage and organize your blog content
              </p>
            </div>
            <Button
              onClick={() => router.push("/admin/post/create")}
            >
              <Plus className="h-4 w-4" /> Create New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
              <p className="text-base-content/70">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-base-content/70 mb-4" />
              <h3 className="text-lg font-semibold text-secondary mb-2">
                No posts yet
              </h3>
              <p className="text-base-content/70 mb-6 text-center max-w-sm">
                Create your first post to get started.
              </p>
              <Button onClick={() => router.push("/admin/post/create")}>
                <Plus className="h-4 w-4 mr-2" /> New Post
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-accent/30">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-secondary truncate">
                        {post.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        Published
                      </Badge>
                    </div>
                    <p className="text-sm text-base-content/70 line-clamp-2 mb-2">
                      {post.excerpt || "No excerpt available"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-base-content/70">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span>/{post.slug}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      style="ghost"
                      onClick={() => router.push(`/blog/${post.slug}`)}
                    >
                      <Eye className="h-4 w-4" /> View
                    </Button>
                    <Button
                      size="sm"
                      style="ghost"
                      onClick={() => router.push(`/admin/post/edit/${post.id}`)}
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      style="ghost"
                      onClick={() => setDeleteTarget(post)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {deleteTarget && (
        <DeletePostModal
          postId={deleteTarget.id}
          title={deleteTarget.title}
          onDeleted={() => handleDeleted(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
