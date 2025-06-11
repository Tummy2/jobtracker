import Sidebar from "./Sidebar";
import { Outlet, Link } from "react-router-dom";

export default function Layout() {
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
          <Link to="/auth">
            <button>Sign In / Sign Up</button>
          </Link>
        </header>

        <main className="main-content" style={{ padding: "1rem", flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
