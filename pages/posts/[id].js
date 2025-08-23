// pages/posts/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../lib/axios"; // axios instance

export default function SinglePost() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/singlePost/${id}`)
      .then(res => {
        setPost(res.data); // directly the blog object
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <small>Post ID: {post.ID} | User ID: {post.userid}</small>
    </div>
  );
}
