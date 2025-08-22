import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);   // for success/error messages
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      setMessage("Login successful");
      setTimeout(() => {
        setMessage(null);
        router.push("/posts");   // redirect after 2s
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Login failed");
      setTimeout(() => setMessage(null), 3000);   // hide error after 3s
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        /> <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        /> <br />
        <button type="submit">Login</button>
      </form>

      {/* Temporary message */}
      {message && <p>{message}</p>}
    </div>
  );
}
