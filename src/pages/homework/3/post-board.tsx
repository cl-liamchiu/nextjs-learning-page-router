"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import HomeworkLayout from "@/components/homework/homework-layout";
import HomeworkContent from "@/components/homework/homework-content";
import Modal from "@/components/homework/3/modal";
import { usePostContext } from "@/lib/homework/3/context/post-provider";

const PostBoardPage = () => {
  const { posts, updatePost, removePost } = usePostContext();
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    image: null as File | null,
  });

  const handleEdit = (id: number) => {
    const post = posts.find((item) => item.id === id);
    if (post) {
      setEditForm({ title: post.title, content: post.content, image: null });
      setEditingId(id);
    }
  };

  const handleEditChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      setEditForm((prev) => ({ ...prev, image: file }));
    }
  };

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId || !editForm.title.trim() || !editForm.content.trim()) {
      return;
    }

    if (editForm.image) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const imageDataUrl = loadEvent.target?.result as string;
        updatePost(editingId, {
          title: editForm.title,
          content: editForm.content,
          image: imageDataUrl,
        });
        setEditingId(null);
        setEditForm({ title: "", content: "", image: null });
      };
      reader.readAsDataURL(editForm.image);
    } else {
      const existing = posts.find((item) => item.id === editingId);
      updatePost(editingId, {
        title: editForm.title,
        content: editForm.content,
        image: existing?.image ?? "",
      });
      setEditingId(null);
      setEditForm({ title: "", content: "", image: null });
    }
  };

  const handleRemove = (id: number) => {
    removePost(id);
  };

  const handleCreatePost = () => {
    router.push("/homework/3/create-post");
  };

  const handleCloseModal = () => {
    setEditingId(null);
    setEditForm({ title: "", content: "", image: null });
  };

  return (
    <HomeworkLayout>
      <HomeworkContent className="rounded-2xl bg-neutral-900 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold">Post Board</h1>
            <button
              onClick={handleCreatePost}
              className="rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-neutral-900 transition-colors hover:bg-cyan-300"
            >
              Create Post
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {posts.length === 0 ? (
              <div className="col-span-full rounded-lg border border-neutral-700 px-6 py-12 text-center text-neutral-300">
                <p className="text-xl">No posts available.</p>
                <p className="mt-2">
                  Click &quot;Create Post&quot; to add your first post!
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="relative rounded-lg bg-neutral-800 p-6 transition-colors hover:bg-neutral-750"
                >
                  <div className="absolute right-4 top-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(post.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 text-sm font-bold text-neutral-900 transition-colors hover:bg-cyan-300"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleRemove(post.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white transition-colors hover:bg-red-400"
                    >
                      ×
                    </button>
                  </div>

                  <h3 className="mb-3 pr-20 text-xl font-semibold">
                    {post.title}
                  </h3>
                  <p className="mb-4 leading-relaxed text-neutral-300">
                    {post.content}
                  </p>

                  {post.image && (
                    <div className="mt-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-48 w-full rounded-lg object-cover"
                      />
                    </div>
                  )}

                  <div className="mt-4 text-sm text-neutral-500">
                    Post ID: {post.id}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </HomeworkContent>

      <Modal
        open={editingId !== null}
        title="Edit Post"
        onClose={() => handleCloseModal()}
      >
        {editingId !== null && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={editForm.title}
                onChange={handleEditChange}
                placeholder="Enter post title"
                className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={editForm.content}
                onChange={handleEditChange}
                placeholder="Enter post content"
                rows={4}
                className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-cyan-400 focus:outline-none resize-vertical"
                required
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-2">
                Update Image (optional)
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-cyan-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:text-neutral-900 file:font-semibold hover:file:bg-cyan-300"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-cyan-400 text-neutral-900 rounded-lg font-semibold hover:bg-cyan-300 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => handleCloseModal()}
                className="flex-1 py-2 px-4 bg-neutral-600 text-white rounded-lg font-semibold hover:bg-neutral-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    </HomeworkLayout>
  );
};

export default PostBoardPage;
