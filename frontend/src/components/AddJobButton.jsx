// THIS INCLUDES THE HEADER NEED TO FIX THAT

export default function AddJobButton(props) {

    return (
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
          onClick={() => props.showAddForm(true)}
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
    );
}