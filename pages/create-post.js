// pages/create-post.js
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import api from "../lib/axios";
import { AuthContext } from "../context/AuthContext";

export default function CreatePost() {
  const router = useRouter();
  const { token } = useContext(AuthContext); // token from login
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post(
        "/api/create",
        { title: form.title, content: form.content },
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token in header
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
      /><br />
      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Content"
         style={{ width: "100%", height: "100px" }}
        required
      /><br />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
