import { useEffect, useState, useContext } from "react";
import api from "../lib/axios";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";

export default function PostsPage() {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // posts per page
  const [sort, setSort] = useState("desc");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  const fetchPosts = () => {
    api
      .get("/api/getPosts", {
        params: {
          page,
          limit,
          sort,
          search,
        },
      })
      .then((res) => {
        setPosts(res.data.posts);
        setTotal(res.data.total);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPosts();
  }, [page, sort, search]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>All Posts</h1>

      {token && (
        <Link href="/create-post">
          <button>Create New Post</button>
        </Link>
      )}

      {/* Search */}
      <div style={{ margin: "10px" }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Sort */}
      <div style={{ margin: "10px" }}>
        <label>Sort: </label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Posts */}
      <ul>
        {posts.map((p) => (
          <li key={p.ID}>
            <Link href={`/posts/${p.ID}`}>
              <b>{p.title}</b>
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div style={{ margin: "20px" }}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
