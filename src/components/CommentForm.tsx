"use client";

import { useState } from "react";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";

export default function CommentForm({ postId }: { postId: number }) {
    const [body, setBody] = useState("");
    const [ok, setOk] = useState<string | null>(null);
    async function submit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/comments", {
            method: "POST",
            body: JSON.stringify({ postId, body }),
        });
        setOk(res.ok ? "Sent!" : "Failed");
        if (res.ok) setBody("");
    }
    return (
        <form onSubmit={submit} className="space-y-3">
            <label htmlFor={`comment-${postId}`} className="sr-only">Comment</label>
            <Textarea
                id={`comment-${postId}`}
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <Button>Comment</Button>
            {ok && <div className="text-sm opacity-70">{ok}</div>}
        </form>
    );
}
