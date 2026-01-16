import { Buffer } from "buffer";
import matterType from "gray-matter"; // 仅用于类型提示（不会执行）
import { Post } from "../types";

const POSTS_BASE = "/content/posts";

function ensureBufferGlobal() {
    // ✅ 必须在 import gray-matter 之前执行
    if (typeof (globalThis as any).Buffer === "undefined") {
        (globalThis as any).Buffer = Buffer;
    }
}

async function getMatter(): Promise<typeof matterType> {
    ensureBufferGlobal();
    // ✅ 动态 import：保证 Buffer 已存在后才加载 gray-matter
    const mod = await import("gray-matter");
    return (mod as any).default || (mod as any);
}

export async function getAllPosts(): Promise<Post[]> {
    const manifestRes = await fetch(`${POSTS_BASE}/manifest.json`, { cache: "no-store" });
    if (!manifestRes.ok) throw new Error("Failed to load posts manifest.json");

    const files: string[] = await manifestRes.json();

    const matter = await getMatter();

    const posts = await Promise.all(
        files.map(async (file, index) => {
            const res = await fetch(`${POSTS_BASE}/${file}`, { cache: "no-store" });
            if (!res.ok) return null;

            const raw = await res.text();
            const { data, content } = matter(raw);

            const fileName = file.replace(/\.md$/, "");

            return {
                id: (index + 1).toString(),
                slug: (data as any).slug || fileName,
                title: (data as any).title || "Untitled",
                excerpt:
                    (data as any).description ||
                    (data as any).excerpt ||
                    content.substring(0, 150).replace(/[#*`>]/g, "") + "...",
                content,
                author: (data as any).author || "Binbin",
                // 建议存原始 date，展示时再格式化
                date: (data as any).date || "",
                imageUrl: (data as any).imageUrl || `https://picsum.photos/seed/${fileName}/1200/600`,
                isFeatured: !!(data as any).isFeatured,
                category: (data as any).category || "General",
            } as Post;
        })
    );

    return posts
        .filter((p): p is Post => p !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
    const all = await getAllPosts();
    return all.find((p) => p.slug === slug);
}
