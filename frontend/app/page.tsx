"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, useUser } from "./types/user";

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ user: "", password: "" });
  const {setUser} = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log("API base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
  console.log("HELOOO");
  console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/characters/`);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const endpoint = isLogin ? "/api/login/" : "/api/register/";
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.user,
          password: formData.password,
        }),
      });
  
      const data = await res.json();
      console.log("Status:", res.status);
      console.log("Response:", data);
      console.log(data.message);
  
      if (data.message == "Login successful.") {
        localStorage.setItem("authToken", data.access);
        const user: User = {
            username: data.user,
            is_admin: data.isAdmin,
        };
        setUser(user);
        router.push("/welcome");

      } else {
        alert(data.detail || "Login failed");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">{isLogin ? "Login" : "Register"}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="text"
          name="user"
          placeholder="User"
          value={formData.user}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-blue-700 mt-4 hover:underline"
      >
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
}
