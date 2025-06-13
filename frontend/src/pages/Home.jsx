import { useEffect, useState } from "react";

export default function Home() {
  const [jobApps, setJobApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJob, setNewJob] = useState({
    company_name: "",
    job_title: "",
    application_status: "",
    application_date: "",
    application_link: "",
  });

  // Add this new function to handle job creation
  const handleAddJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formattedJob = {
      ...newJob,
      application_date: newJob.application_date
        ? new Date(newJob.application_date).toISOString().split("T")[0]
        : null,
    };
    try {
      const res = await fetch("http://localhost:8000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedJob),
      });

      if (!res.ok) throw new Error("Failed to add job");

      const addedJob = await res.json();
      addedJob.application_date = addedJob.application_date
        ? new Date(addedJob.application_date).toISOString().split("T")[0]
        : null;
      setJobApps([...jobApps, addedJob]);
      setShowAddForm(false);
      setNewJob({
        company_name: "",
        job_title: "",
        application_status: "",
        application_date: "",
        application_link: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to add job application");
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8000/api/jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>My Job Applications</h1>
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Job
        </button>
      </div>

      {/* Add Job Form Modal */}
      {showAddForm && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            zIndex: 1001,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Add New Job Application</h2>
          <form onSubmit={handleAddJob}>
            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Company Name"
                value={newJob.company_name}
                onChange={(e) =>
                  setNewJob({ ...newJob, company_name: e.target.value })
                }
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
              />
              <input
                type="text"
                placeholder="Job Title"
                value={newJob.job_title}
                onChange={(e) =>
                  setNewJob({ ...newJob, job_title: e.target.value })
                }
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
              />
              <input
                type="text"
                placeholder="Application Status"
                value={newJob.application_status}
                onChange={(e) =>
                  setNewJob({ ...newJob, application_status: e.target.value })
                }
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
              />
              <input
                type="date"
                value={newJob.application_date}
                onChange={(e) =>
                  setNewJob({ ...newJob, application_date: e.target.value })
                }
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
              />
              <input
                type="url"
                placeholder="Application Link"
                value={newJob.application_link}
                onChange={(e) =>
                  setNewJob({ ...newJob, application_link: e.target.value })
                }
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{ padding: "8px 16px" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Add Job
              </button>
            </div>
          </form>
        </div>
      )}

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
                  <td style={{ padding: "12px 8px" }}>
                    {job.application_status}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    {job.application_date
                      ? new Date(job.application_date).toLocaleDateString()
                      : "No date"}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <a
                      href={job.application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link
                    </a>
                  </td>
                  <td style={{ padding: "12px 8px", position: "relative" }}>
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === job.id ? null : job.id
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      ⋮
                    </button>

                    {activeDropdown === job.id && (
                      <div
                        style={{
                          position: "absolute",
                          right: "20px",
                          top: "40px",
                          backgroundColor: "white",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          padding: "8px",
                          zIndex: 1000,
                        }}
                      >
                        <button onClick={() => handleEdit(job)}>Edit</button>
                        <button onClick={() => setShowDeleteConfirm(job.id)}>
                          Delete
                        </button>
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
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            zIndex: 1001,
          }}
        >
          <p>Are you sure you want to delete this job application?</p>
          <button onClick={() => handleDelete(showDeleteConfirm)}>Yes</button>
          <button onClick={() => setShowDeleteConfirm(null)}>No</button>
        </div>
      )}

      {/* Edit Modal */}
      {editingJob && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            zIndex: 1001,
          }}
        >
          <form onSubmit={(e) => handleUpdate(e, editingJob)}>
            <input
              type="text"
              value={editingJob.job_title}
              onChange={(e) =>
                setEditingJob({ ...editingJob, job_title: e.target.value })
              }
            />
            <input
              type="text"
              value={editingJob.company_name}
              onChange={(e) =>
                setEditingJob({ ...editingJob, company_name: e.target.value })
              }
            />
            <input
              type="text"
              value={editingJob.application_status}
              onChange={(e) =>
                setEditingJob({
                  ...editingJob,
                  application_status: e.target.value,
                })
              }
            />
            <input
              type="text"
              value={editingJob.application_link}
              onChange={(e) =>
                setEditingJob({
                  ...editingJob,
                  application_link: e.target.value,
                })
              }
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingJob(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};