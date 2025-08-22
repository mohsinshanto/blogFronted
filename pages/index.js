import Link from "next/link";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to BlogApp</h1>
      <p>
        <Link href="/login">Login</Link> | <Link href="/register">Register</Link>
      </p>
    </div>
  );
}
