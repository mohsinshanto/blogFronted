import { useEffect, useState, useContext } from "react";
import api from "../lib/axios";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";

export default function PostsPage() {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/api/getPosts")
      .then(res => setPosts(res.data.posts))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>All Posts</h1>
      {token && <Link href="/create-post"><button>Create New Post</button></Link>}
      <ul>
        {posts.map(p => (
          <li key={p.userid}>
            <Link href={`/posts/${p.userid}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
