// pages/create-post.js
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import api from "../lib/axios";
import { AuthContext } from "../context/AuthContext";

export default function CreatePost() {
  const router = useRouter();
  const { token, user } = useContext(AuthContext); // token from login
  const [form, setForm] = useState({
    title: "",
    content: "",
    published: false,
    draft: true,
  });
  const [loading, setLoading] = useState(false);

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
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(
        "/api/create",
        {
          title: form.title,
          content: form.content,
          published: form.published,
          draft: form.draft
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Post created successfully");
      router.push("/posts");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <br />
      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Content"
        style={{ width: "150px", height: "100px" }}
        required
      />
      <br />
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
      <br />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
