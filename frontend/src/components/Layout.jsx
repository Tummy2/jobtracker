import Sidebar from "./Sidebar";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Layout() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8000/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Not authorized");
          return res.json();
        })
        .then((data) => {
          if (data.username) {
            setIsLoggedIn(true);
            setUsername(data.username);
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUsername("");
        });
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  };

  useEffect(() => {
    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/auth", { replace: true });
  };

  return (
    <div className="app-container" style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div
        className="content-area"
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "1rem",
            borderBottom: "1px solid #ddd",
          }}
        >
          {isLoggedIn ? (
            <div>
              <span style={{ marginRight: "1rem" }}>Welcome, {username}!</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/auth">
              <button>Sign In / Sign Up</button>
            </Link>
          )}
        </header>

        <main className="main-content" style={{ padding: "1rem", flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}