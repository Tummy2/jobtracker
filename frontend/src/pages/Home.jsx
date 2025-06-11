import { useEffect, useState } from "react";

export default function Home() {
  const [jobApps, setJobApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log(data);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Job Applications</h1>
      {jobApps.length === 0 ? (
        <p>No job applications found</p>
      ) : (
        <ul>
          {jobApps.map((job) => (
            <li key={job.id}>
              {job.job_title} {"------"} {job.company_name} {"------"}
              {job.application_status} {"------"}
              {new Date(job.application_date).toLocaleDateString()} {"------"}
              {job.application_link}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
