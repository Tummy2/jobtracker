import { useEffect, useState } from "react";

export default function Home() {
  const [jobApps, setJobApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8000/api/jobs", {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setJobApps(data);
      } catch (err) {
        console.error(err);
        setError("Could not fetch job applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleEdit = (job) => {
    setEditingJob(job);
    setActiveDropdown(null);
  };

  const handleDelete = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete");

      setJobApps(jobApps.filter((job) => job.id !== jobId));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete job application");
    }
  };

  const handleUpdate = async (e, job) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/api/jobs/${job.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(job),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updatedJob = await res.json();
      setJobApps(jobApps.map((j) => (j.id === job.id ? updatedJob : j)));
      setEditingJob(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update job application");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Job Applications</h1>
      {jobApps.length === 0 ? (
        <p>No job applications found</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
                <th style={{ padding: "12px 8px" }}>Job Title</th>
                <th style={{ padding: "12px 8px" }}>Company</th>
                <th style={{ padding: "12px 8px" }}>Status</th>
                <th style={{ padding: "12px 8px" }}>Date Applied</th>
                <th style={{ padding: "12px 8px" }}>Link</th>
                <th style={{ padding: "12px 8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobApps.map((job) => (
                <tr key={job.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "12px 8px" }}>{job.job_title}</td>
                  <td style={{ padding: "12px 8px" }}>{job.company_name}</td>
                  <td style={{ padding: "12px 8px" }}>{job.application_status}</td>
                  <td style={{ padding: "12px 8px" }}>
                    {new Date(job.application_date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <a href={job.application_link} target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  </td>
                  <td style={{ padding: "12px 8px", position: "relative" }}>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === job.id ? null : job.id)}
                      style={{ cursor: "pointer" }}
                    >
                      ⋮
                    </button>
  
                    {activeDropdown === job.id && (
                      <div style={{
                        position: "absolute",
                        right: "20px",
                        top: "40px",
                        backgroundColor: "white",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        padding: "8px",
                        zIndex: 1000,
                      }}>
                        <button onClick={() => handleEdit(job)}>Edit</button>
                        <button onClick={() => setShowDeleteConfirm(job.id)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
  
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          zIndex: 1001
        }}>
          <p>Are you sure you want to delete this job application?</p>
          <button onClick={() => handleDelete(showDeleteConfirm)}>Yes</button>
          <button onClick={() => setShowDeleteConfirm(null)}>No</button>
        </div>
      )}
  
      {/* Edit Modal */}
      {editingJob && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          zIndex: 1001
        }}>
          <form onSubmit={(e) => handleUpdate(e, editingJob)}>
            <input
              type="text"
              value={editingJob.job_title}
              onChange={(e) => setEditingJob({...editingJob, job_title: e.target.value})}
            />
            <input
              type="text"
              value={editingJob.company_name}
              onChange={(e) => setEditingJob({...editingJob, company_name: e.target.value})}
            />
            <input
              type="text"
              value={editingJob.application_status}
              onChange={(e) => setEditingJob({...editingJob, application_status: e.target.value})}
            />
            <input
              type="text"
              value={editingJob.application_link}
              onChange={(e) => setEditingJob({...editingJob, application_link: e.target.value})}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingJob(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};