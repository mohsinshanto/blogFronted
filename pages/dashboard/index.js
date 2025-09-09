// import { useEffect, useState, useContext } from "react";
// import api from "../../lib/axios";
// import { AuthContext } from "../../context/AuthContext";
// import Link from "next/link";

// export default function Dashboard() {
//   const { token, user } = useContext(AuthContext);
//   const [publishedPosts, setPublishedPosts] = useState([]);
//   const [draftPosts, setDraftPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user) return;
//     api
//       .get("/api/getPosts", {
//         params: { user_id: user?.ID },
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         const posts = res.data.posts || [];
//   setPublishedPosts(posts.filter((p) => p.published && !p.draft));
//   setDraftPosts(posts.filter((p) => p.draft && !p.published));
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [user, token]);

//   if (!token) {
//     return (
//       <div style={{ textAlign: "center" }}>
//         Please log in to view your dashboard.
//       </div>
//     );
//   }

//   return (
//     <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
//       <h1>User Dashboard</h1>
//       <Link href="/create-post">
//         <button style={{ margin: "10px" }}>Create New Post</button>
//       </Link>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginTop: "30px",
//         }}
//       >
//         <div style={{ width: "48%" }}>
//           <h2>Published Posts</h2>
//           {loading ? (
//             <p>Loading...</p>
//           ) : publishedPosts.length === 0 ? (
//             <p>No published posts.</p>
//           ) : (
//             <ul style={{ listStyle: "none", padding: 0 }}>
//               {publishedPosts.map((p) => (
//                 <li
//                   key={p.id}
//                   style={{
//                     marginBottom: "20px",
//                     border: "1px solid #ccc",
//                     padding: "10px",
//                     borderRadius: "5px",
//                   }}
//                 >
//                   <b>{p.title}</b>
//                   <p style={{ margin: "10px 0", color: "#555" }}>
//                     {p.content.length > 100
//                       ? p.content.substring(0, 100) + "..."
//                       : p.content}
//                   </p>
//                   <Link href={`/posts/${p.id}`}>
//                     <button style={{ padding: "5px 10px" }}>See More</button>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <div style={{ width: "48%" }}>
//           <h2>Draft Posts</h2>
//           {loading ? (
//             <p>Loading...</p>
//           ) : draftPosts.length === 0 ? (
//             <p>No draft posts.</p>
//           ) : (
//             <ul style={{ listStyle: "none", padding: 0 }}>
//               {draftPosts.map((p) => (
//                 <li
//                   key={p.id}
//                   style={{
//                     marginBottom: "20px",
//                     border: "1px solid #ccc",
//                     padding: "10px",
//                     borderRadius: "5px",
//                   }}
//                 >
//                   <b>{p.title}</b>
//                   <p style={{ margin: "10px 0", color: "#555" }}>
//                     {p.content.length > 100
//                       ? p.content.substring(0, 100) + "..."
//                       : p.content}
//                   </p>
//                   <Link href={`/posts/${p.id}`}>
//                     <button style={{ padding: "5px 10px" }}>Edit</button>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState, useContext } from "react";
import api from "../../lib/axios";
import { AuthContext } from "../../context/AuthContext";
import Link from "next/link";

export default function Dashboard() {
  const { token, user } = useContext(AuthContext);
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [draftPosts, setDraftPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // Fetch both published and draft posts for the current user
    api
      .get("/api/getPosts", {
        params: { user_id: user.ID, drafts: "true" },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const posts = res.data.posts || [];

        // Separate published and draft posts
        setPublishedPosts(posts.filter((p) => p.published));
        setDraftPosts(posts.filter((p) => p.draft));

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, token]);

  if (!token) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Please log in to view your dashboard.
      </div>
    );
  }

  const renderPosts = (posts, buttonText, linkPrefix) =>
    posts.length === 0 ? (
      <p>No posts.</p>
    ) : (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((p) => (
          <li
            key={p.id}
            style={{
              marginBottom: "20px",
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
            <Link href={`${linkPrefix}/${p.id}`}>
              <button style={{ padding: "5px 10px" }}>{buttonText}</button>
            </Link>
          </li>
        ))}
      </ul>
    );

  return (
    <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
      <h1>User Dashboard</h1>
      <Link href="/create-post">
        <button style={{ margin: "10px" }}>Create New Post</button>
      </Link>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
        }}
      >
        <div style={{ width: "48%" }}>
          <h2>Published Posts</h2>
          {loading ? <p>Loading...</p> : renderPosts(publishedPosts, "See More", "/posts")}
        </div>

        <div style={{ width: "48%" }}>
          <h2>Draft Posts</h2>
          {loading ? <p>Loading...</p> : renderPosts(draftPosts, "Edit", "/posts")}
        </div>
      </div>
    </div>
  );
}
