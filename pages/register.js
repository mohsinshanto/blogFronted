import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";
// 👇 import from lucide-react
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form.username, form.email, form.password);
      setMessage(res.msg);
      setType("success");
      setTimeout(() => setMessage(""), 1500);
      router.push("/login");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || "Registration failed");
      setType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} />
        <br />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <br />

        {/* Password with toggle */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
            style={{ paddingRight: "35px" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <br />

        <button type="submit">Register</button>
      </form>

      {message && (
        <p
          style={{
            color: type === "success" ? "green" : "red",
            marginTop: "10px",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
