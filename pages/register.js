import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form.username, form.email, form.password);
      setMessage(res.msg);
      setType("success");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || "Registration failed");
      setType("error");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} /><br />
        <input name="email" placeholder="Email" onChange={handleChange} /><br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        /><br />
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
