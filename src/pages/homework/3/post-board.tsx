"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import HomeworkContent from "@/components/homework/homework-content";
import Modal from "@/components/homework/3/modal";
import { usePostContext } from "@/lib/homework/3/context/post-provider";
import styles from "./post-board.module.scss";

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
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    <>
      <HomeworkContent className={styles.boardContent}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h1 className={styles.heading}>Post Board</h1>
            <button onClick={handleCreatePost} className={styles.createButton}>
              Create Post
            </button>
          </div>

          <div className={styles.postsGrid}>
            {posts.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>No posts available.</p>
                <p className={styles.emptyDescription}>
                  Click &quot;Create Post&quot; to add your first post!
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className={styles.postCard}>
                  <div className={styles.cardActions}>
                    <button
                      onClick={() => handleEdit(post.id)}
                      className={`${styles.actionButton} ${styles.editButton}`}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleRemove(post.id)}
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                    >
                      ×
                    </button>
                  </div>

                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardContent}>{post.content}</p>

                  {post.image && (
                    <div className={styles.cardImage}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.image} alt={post.title} />
                    </div>
                  )}

                  <div className={styles.cardFooter}>Post ID: {post.id}</div>
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
          <form onSubmit={handleEditSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="title" className={styles.label}>
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={editForm.title}
                onChange={handleEditChange}
                placeholder="Enter post title"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="content" className={styles.label}>
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={editForm.content}
                onChange={handleEditChange}
                placeholder="Enter post content"
                rows={4}
                className={styles.textarea}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="image" className={styles.label}>
                Update Image (optional)
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                className={styles.fileInput}
              />
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.submitButton}>
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => handleCloseModal()}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default PostBoardPage;
