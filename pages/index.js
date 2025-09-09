import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out!");
    setLoggedIn(false);
    router.push("/");
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to BlogApp</h1>
      <p>
        {!loggedIn ? (
          <>
            <Link href="/login">Login</Link> |{" "}
            <Link href="/register">Register</Link>
          </>
        ) : (
          <>
            <Link href="/create-post">Create Post</Link> |{" "}
            <button onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </button>
          </>
        )}
      </p>
    </div>
  );
}
