import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../lib/axios"; // axios instance

export default function SinglePost() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    published: false,
    draft: true,
  });

  // ---- Comments state ----
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch post
  useEffect(() => {
    if (!id) return;
    api
      .get(`/api/singlePost/${id}`)
      .then((res) => {
        console.log(res.data);
        setPost(res.data);
        setForm({
          title: res.data.title,
          content: res.data.content,
          published: !!res.data.published,
          draft: !!res.data.draft,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Fetch comments
  const fetchComments = async () => {
    if (!id) return;
    try {
      const res = await api.get(`/comments/post/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "status") {
      if (value === "published") {
        setForm((prev) => ({
          ...prev,
          published: true,
          draft: false,
        }));
      } else if (value === "draft") {
        setForm((prev) => ({
          ...prev,
          published: false,
          draft: true,
        }));
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put(
        `/api/updatePost/${id}`,
        {
          title: form.title,
          content: form.content,
          published: form.published,
          draft: form.draft,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Post updated!");
      setPost(res.data.blog);
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/api/deletePost/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Post deleted!");
      router.push("/posts"); // redirect back to posts list
    } catch (err) {
      alert(err.response?.data?.msg || "Delete failed");
    }
  };

  // ---- Handle adding a comment ----
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await api.post(
        "/comments/",
        { content: newComment, post_id: Number(id) }, // ✅ fixed: ensure post_id is number
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNewComment("");
      fetchComments(); // refresh after adding
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add comment");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  const buttonStyle = {
    padding: "5px 10px",
    marginRight: "10px",
    border: "none",
    cursor: "pointer",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    marginRight: 0,
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", textAlign: "left" }}>
      <button
        style={{ ...buttonStyle, marginBottom: "20px" }}
        onClick={() => router.push("/posts")}
      >
        Back
      </button>

      {editing ? (
        <div>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows="6"
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <div style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="radio"
                name="status"
                value="draft"
                checked={form.draft}
                onChange={handleChange}
              />{" "}
              Draft
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                name="status"
                value="published"
                checked={form.published}
                onChange={handleChange}
              />{" "}
              Published
            </label>
          </div>
          <button style={buttonStyle} onClick={handleUpdate}>
            Save
          </button>
          <button style={cancelButtonStyle} onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          <small>Posted By: {post.user.username}</small>
          <div style={{ marginTop: "10px" }}>
            <button style={buttonStyle} onClick={() => setEditing(true)}>
              Edit
            </button>
            <button style={buttonStyle} onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* ---- Comments Section ---- */}
      <div style={{ marginTop: "30px" }}>
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul>
            {comments.map((c) => (
              <li key={c.id} style={{ marginBottom: "8px" }}>
                {c.content} <small>(commented by: {c.username})</small>
              </li>
            ))}
          </ul>
        )}

        {localStorage.getItem("token") && (
          <div style={{ marginTop: "10px" }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
              style={{ width: "100%", marginBottom: "5px" }}
            />
            <button style={buttonStyle} onClick={handleAddComment}>
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
