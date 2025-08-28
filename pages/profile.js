// pages/profile.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../lib/axios"; // axios instance

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    api.get("/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setProfile(res.data);
        setUsername(res.data.username);
        setEmail(res.data.email);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const res = await api.put("/api/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated!");
      setProfile(res.data);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h1>User Profile</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
        </div>

        {profile?.profileImage && (
          <div>
            <img
              src={`http://localhost:5000${profile.profileImage}`}
              alt="Profile"
              width="150"
            />
          </div>
        )}

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}
