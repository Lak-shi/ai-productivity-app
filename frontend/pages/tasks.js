import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("list");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [timeEstimate, setTimeEstimate] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5002/tasks");
      const data = await res.json();
  
      console.log("📌 API Response:", data);
  
      if (!Array.isArray(data)) {
        throw new Error("API response is not an array");
      }
  
      // Send tasks to AI prioritization endpoint
      const aiRes = await fetch("http://localhost:5002/tasks/prioritize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: data }),
      });
  
      const prioritizedTasks = await aiRes.json();
      console.log("✅ AI Prioritized Tasks:", prioritizedTasks);
      setTasks(prioritizedTasks); // ✅ Update UI with sorted tasks
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]); // Prevent crashing by setting tasks to an empty array
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title || !description || !priority || !timeEstimate || !dueDate) {
      alert("Please fill all fields before adding a task.");
      return;
    }
    const taskData = {
      title,
      description,
      priority,
      time_estimate: parseInt(timeEstimate),
      due_date: dueDate,
      completed: false,
    };
    try {
      await fetch("http://localhost:5002/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTaskCompletion = async (id, completed) => {
    try {
      await fetch(`http://localhost:5002/tasks/${id}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5002/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const localizer = momentLocalizer(moment);

  const events = tasks.map((task) => ({
    title: `${task.title} - ${task.description}`,
    start: new Date(task.due_date),
    end: new Date(task.due_date),
    allDay: true,
    desc: task.description,
    priority: task.priority,
  }));
  
  

  const eventStyleGetter = (event) => {
    let backgroundColor =
      event.priority === "High" ? "#ff4d4d" : event.priority === "Medium" ? "#ffcc00" : "#66cc66";
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "5px",
        padding: "5px",
      },
    };
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>📌 Donna</h1>
      <button onClick={() => setView(view === "list" ? "calendar" : "list")} style={toggleButtonStyle}>
        {view === "list" ? "📅 Switch to Calendar View" : "📋 Switch to List View"}
      </button>
      {view === "list" && (
        <>
          <form onSubmit={addTask} style={formStyle}>
            <div style={formRowStyle}>
              <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="High">🔥 High</option>
                <option value="Medium">⚡ Medium</option>
                <option value="Low">✅ Low</option>
              </select>
              <input type="number" placeholder="Time (hours)" value={timeEstimate} onChange={(e) => setTimeEstimate(e.target.value)} required />
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              <button type="submit" style={addButtonStyle}>➕ Add Task</button>
            </div>
          </form>
          
          <h2 style={sectionHeadingStyle}>📅 Scheduled Tasks</h2>
          {tasks.filter(task => !task.completed).map(task => (
            <div key={task.id} style={taskCardStyle}>
              <h3>{task.title} - <span style={{ color: getPriorityColor(task.priority) }}>{task.priority}</span></h3>
              <p><b>📅 Due:</b> {moment(task.due_date).format("ddd MMM D YYYY")}</p>
              <p><b>📝 Description:</b> {task.description}</p>
              <p><b>⏳ Time:</b> {task.time_estimate} hrs</p>
              <div style={buttonContainerStyle}>
                <button onClick={() => toggleTaskCompletion(task.id, task.completed)} style={completeButtonStyle}>✔ Mark as Completed</button>
                <button onClick={() => deleteTask(task.id)} style={deleteButtonStyle}>🗑 Delete</button>
              </div>
            </div>
          ))}

          <h2 style={sectionHeadingStyle}>✅ Completed Tasks</h2>
          {tasks.filter(task => task.completed).map(task => (
            <div key={task.id} style={{ ...taskCardStyle, backgroundColor: "#d4edda" }}>
              <h3>{task.title} - <span style={{ color: "green" }}>Completed</span></h3>
              <p><b>📅 Due:</b> {moment(task.due_date).format("ddd MMM D YYYY")}</p>
              <p><b>📝 Description:</b> {task.description}</p>
              <p><b>⏳ Time:</b> {task.time_estimate} hrs</p>
              <div style={buttonContainerStyle}>
                <button onClick={() => deleteTask(task.id)} style={deleteButtonStyle}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </>
      )}
      {view === "calendar" && (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: "50px" }}
          eventPropGetter={eventStyleGetter}
          components={{
            event: ({ event }) => (
              <span>
                <strong>{event.title}</strong>
                {event.desc && <p>{event.desc}</p>}
              </span>
            ),
          }}
        />
      )}
    </div>
  );
}

/* Styles */
const containerStyle = { padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "Courier New" };
const headingStyle = { fontSize: "28px", fontWeight: "bold", textAlign: "center" };
const toggleButtonStyle = { padding: "10px", cursor: "pointer", marginBottom: "20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" };
const formStyle = { backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "10px" };
const formRowStyle = { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" };
const addButtonStyle = { backgroundColor: "#28a745", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" };
const sectionHeadingStyle = { fontSize: "20px", fontWeight: "600", marginTop: "20px", borderBottom: "2px solid #ddd", paddingBottom: "5px" };
const taskCardStyle = { padding: "15px", marginBottom: "10px", backgroundColor: "#ffffff", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" };
const deleteButtonStyle = { backgroundColor: "red", color: "white", padding: "10px", cursor: "pointer", borderRadius: "5px" };
const completeButtonStyle = { backgroundColor: "#28a745", color: "white", padding: "10px", cursor: "pointer", borderRadius: "5px" };
const buttonContainerStyle = { display: "flex", justifyContent: "space-between", marginTop: "10px" };
const getPriorityColor = (priority) => (priority === "High" ? "red" : priority === "Medium" ? "orange" : "green");
