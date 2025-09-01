// // /posts/[id].js
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import api from "../../lib/axios"; // axios instance

// export default function SinglePost() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [form, setForm] = useState({ title: "", content: "" });

//   useEffect(() => {
//     if (!id) return;
//     api
//       .get(`/api/singlePost/${id}`)
//       .then((res) => {
//         setPost(res.data);
//         setForm({ title: res.data.title, content: res.data.content });
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [id]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleUpdate = async () => {
//     try {
//       const res = await api.put(`/api/updatePost/${id}`, form, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       alert("Post updated!");
//       setPost(res.data.blog);
//       setEditing(false);
//     } catch (err) {
//       alert(err.response?.data?.msg || "Update failed");
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm("Are you sure you want to delete this post?")) return;
//     try {
//       await api.delete(`/api/deletePost/${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       alert("Post deleted!");
//       router.push("/posts"); // redirect back to home or posts list
//     } catch (err) {
//       alert(err.response?.data?.msg || "Delete failed");
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (!post) return <p>Post not found</p>;

//   return (
//     <div style={{ maxWidth: "600px", margin: "20px auto" }}>
//       {editing ? (
//         <div>
//           <input
//             type="text"
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             style={{ width: "100%", marginBottom: "10px" }}
//           />
//           <textarea
//             name="content"
//             value={form.content}
//             onChange={handleChange}
//             rows="6"
//             style={{ width: "100%", marginBottom: "10px" }}
//           />
//           <button onClick={handleUpdate}>Save</button>
//           <button onClick={() => setEditing(false)}>Cancel</button>
//         </div>
//       ) : (
//         <div>
//           <h1>{post.title}</h1>
//           <p>{post.content}</p>
//           <small>
//             Post ID: {post.ID} | User ID: {post.userid}
//           </small>
//           <div style={{ marginTop: "10px" }}>
//             <button onClick={() => setEditing(true)}>Edit</button>
//             <button
//               onClick={handleDelete}
//               style={{ marginLeft: "10px", color: "red" }}
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// /posts/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../lib/axios"; // axios instance

export default function SinglePost() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });

  useEffect(() => {
    if (!id) return;
    api
      .get(`/api/singlePost/${id}`)
      .then((res) => {
        setPost(res.data);
        setForm({ title: res.data.title, content: res.data.content });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put(`/api/updatePost/${id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  const buttonStyle = {
    padding: "5px 10px",
    marginRight: "10px",
    backgroundColor: "gray",
    color: "black",
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
          <small>
            Post ID: {post.id} | User ID: {post.userid}
          </small>
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
    </div>
  );
}
