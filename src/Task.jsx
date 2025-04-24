import "./board.css";

export default function Task({ title, description, onDelete }) {
  return (
    <div className="task">
     

      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}