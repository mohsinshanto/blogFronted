
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Dynamically import icons to avoid SSR issues
const Eye = dynamic(() => import("lucide-react").then(mod => mod.Eye), { ssr: false });
const EyeOff = dynamic(() => import("lucide-react").then(mod => mod.EyeOff), { ssr: false });

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
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
        router.push("/posts");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Login failed");
      setTimeout(() => setMessage(null), 3000);
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

        <div style={{ position: "relative", display: "inline-block" }}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer"
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div> <br />

        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

