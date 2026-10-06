import { Link } from "react-router-dom";

function EventCard({ event }) {
  return (
    <div className="event-card">
      <div className="event-card-image">{event.image}</div>

      <div className="event-card-content">
        <span className="event-category">{event.category}</span>

        <h3>{event.title}</h3>

        <p>📅 {event.date}</p>

        <p>📍 {event.location}</p>

        <div className="event-card-bottom">
          <strong>₹{event.price}</strong>

          <Link to={`/event/${event.id}`} className="view-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
