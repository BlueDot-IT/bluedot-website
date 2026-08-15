"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { ArrowLeft, FileText, Wand2, Save } from "lucide-react";

export default function CreatePostPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    tagIds: [] as number[],
  });

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState({ title: "", slug: "", content: "" });

  useEffect(() => {
    setIsMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/tags"),
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (tagRes.ok) setTags(await tagRes.json());
    } catch (error) {
      console.error("Failed to load categories/tags:", error);
    }
  };

  if (!isMounted) return null;
  if (!session) {
    router.push("/login");
    return null;
  }

  const validateField = (name: string, value: string) => {
    let error = "";
    if (!value) error = `${name} is required`;
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tagId: number) => {
    setForm((prev) => {
      const exists = prev.tagIds.includes(tagId);
      const tagIds = exists
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId];
      return { ...prev, tagIds };
    });
  };

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });      
      if (res.ok) router.push("/admin");
      else alert("Failed to create post");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-shell py-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent">Create New Post</h1>
          <p className="text-base-content/70">
            Write and publish a new blog article.
          </p>
        </div>
        <Button onClick={() => router.push("/admin")} style="outline">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-base-content/70" />
            <div>
              <span className="text-secondary">Post Details</span>
              <p className="text-base-content/70">
                Fill out the form to publish your new post.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Slug */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-3 mt-1 rounded-md border border-accent/60 bg-secondary/20 text-secondary"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    id="slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="flex-1 p-3 rounded-md border border-accent/60 bg-secondary/20 text-secondary"
                  />
                  <Button onClick={generateSlug} style="outline">
                    <Wand2 className="h-4 w-4" /> Generate
                  </Button>
                </div>
                {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}
              </div>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-md border border-accent/60 bg-secondary/20 text-secondary"
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-2 text-secondary">
                    <input
                      type="checkbox"
                      checked={form.tagIds.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 mt-1 rounded-md border border-accent/60 bg-secondary/20 text-secondary"
              />
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={10}
                className="w-full p-3 mt-1 rounded-md border border-accent/60 bg-secondary/20 text-secondary"
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button>
                <Save className="h-4 w-4" />
                {isLoading ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
