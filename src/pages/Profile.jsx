import { useEffect, useState } from "react";
import { API_BASE } from "../api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(API_BASE + "/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!profile) return null;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>👤 {profile.username}</h1>

      <p>
        Pokémon capturados: {profile.captured} / {profile.total}
      </p>

      <div
        style={{
          width: "100%",
          background: "#eee",
          borderRadius: "8px",
          overflow: "hidden",
          margin: "1rem 0",
        }}
      >
        <div
          style={{
            width: `${profile.percentage}%`,
            background: "#4caf50",
            height: "16px",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <strong>{profile.percentage}%</strong>
    </div>
  );
}
