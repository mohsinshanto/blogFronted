import { useEffect, useState, useContext } from "react";
import api from "../lib/axios";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";

export default function PostsPage() {
  const { token, user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [sort, setSort] = useState("desc");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [userFilter, setUserFilter] = useState(null); // null = all posts, number = user ID

  const fetchPosts = () => {
    api
      .get("/api/getPosts", {
        params: {
          page,
          limit,
          sort,
          search,
          user_id: userFilter || undefined,
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
  }, [page, sort, search, userFilter]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
      <h1>All Posts</h1>

      {token && (
        <>
          <Link href="/create-post">
            <button style={{ margin: "10px" }}>Create New Post</button>
          </Link>

          {/* Filter: All Posts / My Posts */}
          <div style={{ margin: "10px" }}>
            <button
              style={{
                fontWeight: userFilter === null ? "bold" : "normal",
                marginRight: "10px",
              }}
              onClick={() => {
                setUserFilter(null);
                setPage(1); // reset page when switching filter
              }}
            >
              All Posts
            </button>
            <button
              style={{
                fontWeight: userFilter === user?.ID ? "bold" : "normal",
              }}
              onClick={() => {
                setUserFilter(user?.ID);
                setPage(1); // reset page when switching filter
              }}
            >
              My Posts
            </button>
          </div>
        </>
      )}

      {/* Search */}
      <div style={{ margin: "10px" }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to page 1 when searching
          }}
          style={{ padding: "5px", width: "60%" }}
        />
      </div>

      {/* Sort */}
      <div style={{ margin: "10px" }}>
        <label>Sort: </label>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1); // reset to page 1 when sorting
          }}
          style={{ padding: "5px" }}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Current Filters */}
      <div style={{ margin: "10px" }}>
        <strong>Filters Applied:</strong>{" "}
        {userFilter === user?.ID ? "User: My Posts" : "User: All Posts"} | Sort:{" "}
        {sort === "desc" ? "Newest First" : "Oldest First"} | Search:{" "}
        {search ? `"${search}"` : "None"}
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {posts.map((p) => (
            <li
              key={p.id}
              style={{
                marginBottom: "20px",
                textAlign: "left",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <b>{p.title}</b>
              <p style={{ margin: "10px 0", color: "#555" }}>
                {p.content.length > 100
                  ? p.content.substring(0, 100) + "..."
                  : p.content}
              </p>
              <Link href={`/posts/${p.id}`}>
                <button style={{ padding: "5px 10px" }}>See More</button>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div style={{ margin: "20px" }}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || total === 0}
          style={{ padding: "5px 10px", marginRight: "10px" }}
        >
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || total === 0}
          style={{ padding: "5px 10px", marginLeft: "10px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
