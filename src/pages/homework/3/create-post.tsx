"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import HomeworkLayout from "@/components/homework/homework-layout";
import HomeworkContent from "@/components/homework/homework-content";
import { usePostContext } from "@/lib/homework/3/context/post-provider";

const CreatePostPage = () => {
  const [form, setForm] = useState({ title: "", content: "", image: "" });
  const { addPost } = usePostContext();
  const router = useRouter();

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title || !form.content) return;
    addPost({ title: form.title, content: form.content, image: form.image });
    setForm({ title: "", content: "", image: "" });
    router.push("/homework/3/post-board");
  };

  const handleClear = () => {
    setForm({ title: "", content: "", image: "" });
  };

  const handleGoBack = () => {
    router.push("/homework/3/post-board");
  };

  return (
    <HomeworkLayout>
      <HomeworkContent className="rounded-2xl bg-neutral-900 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button
              onClick={handleGoBack}
              className="rounded-lg bg-neutral-700 px-4 py-2 text-white transition-colors hover:bg-neutral-600"
            >
              ← Back to Post Board
            </button>
            <h1 className="text-3xl font-bold">Create New Post</h1>
          </div>

          <div className="rounded-lg bg-neutral-800 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2"
                >
                  Post Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter an engaging title for your post"
                  className="w-full px-4 py-3 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium mb-2"
                >
                  Post Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Share your thoughts, experiences, or anything you'd like to discuss..."
                  rows={6}
                  className="w-full px-4 py-3 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-cyan-400 focus:outline-none resize-vertical"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium mb-2"
                >
                  Add Image (optional)
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-cyan-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:text-neutral-900 file:font-semibold hover:file:bg-cyan-300"
                />
              </div>

              {form.image && (
                <div>
                  <p className="text-sm font-medium mb-2">Image Preview:</p>
                  <div className="border border-neutral-600 rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-neutral-900 transition-colors hover:bg-cyan-300"
                >
                  Create Post
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-lg bg-neutral-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-neutral-500"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </HomeworkContent>
    </HomeworkLayout>
  );
};

export default CreatePostPage;
