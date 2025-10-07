"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import HomeworkLayout from "@/components/homework/homework-layout";
import HomeworkContent from "@/components/homework/homework-content";
import { usePostContext } from "@/lib/homework/3/context/post-provider";
import styles from "./create-post.module.scss";

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
      <HomeworkContent className={styles.postContent}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <button onClick={handleGoBack} className={styles.backButton}>
              ← Back to Post Board
            </button>
            <h1 className={styles.title}>Create New Post</h1>
          </div>

          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="title" className={styles.label}>
                  Post Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter an engaging title for your post"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="content" className={styles.label}>
                  Post Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Share your thoughts, experiences, or anything you'd like to discuss..."
                  rows={6}
                  className={styles.textarea}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="image" className={styles.label}>
                  Add Image (optional)
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
              </div>

              {form.image && (
                <div className={styles.preview}>
                  <p className={styles.previewLabel}>Image Preview:</p>
                  <div className={styles.previewFrame}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.image}
                      alt="Preview"
                      className={styles.previewImage}
                    />
                  </div>
                </div>
              )}

              <div className={styles.actions}>
                <button type="submit" className={styles.submitButton}>
                  Create Post
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className={styles.clearButton}
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
