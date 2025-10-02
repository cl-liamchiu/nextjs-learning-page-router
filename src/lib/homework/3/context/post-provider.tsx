"use client";

import { createContext, useContext, useState } from "react";

export interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
}

export interface PostContextType {
  posts: Post[];
  addPost: (post: Omit<Post, "id">) => void;
  removeLastPost: () => void;
  removePost: (id: number) => void;
  updatePost: (id: number, updated: Partial<Omit<Post, "id">>) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);

  const addPost: PostContextType["addPost"] = (post) =>
    setPosts((prev) => [...prev, { ...post, id: Date.now() }]);

  const removeLastPost = () => setPosts((prev) => prev.slice(0, -1));

  const removePost: PostContextType["removePost"] = (id) =>
    setPosts((prev) => prev.filter((post) => post.id !== id));

  const updatePost = (id: number, updated: Partial<Omit<Post, "id">>) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, ...updated } : post))
    );
  };

  return (
    <PostContext.Provider
      value={{ posts, addPost, removeLastPost, removePost, updatePost }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  const ctx = useContext(PostContext);
  if (!ctx) throw new Error("usePostContext must be used within PostProvider");
  return ctx;
}
