// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import "./Events.css";

// const defaultEvents = [
//   {
//     id: 1,
//     title: "Tech Conference 2026",
//     date: "2026-10-15",
//     time: "10:00",
//     location: "Ahmedabad, Gujarat",
//     category: "Technology",
//     price: 499,
//     description: "A professional technology conference.",
//     image:
//       "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
//     status: "Live",
//   },
//   {
//     id: 2,
//     title: "Live Music Festival",
//     date: "2026-10-20",
//     time: "18:00",
//     location: "Mumbai, Maharashtra",
//     category: "Music",
//     price: 799,
//     description: "Enjoy an amazing live music experience.",
//     image:
//       "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
//     status: "Live",
//   },
//   {
//     id: 3,
//     title: "Startup & Business Summit",
//     date: "2026-11-05",
//     time: "09:30",
//     location: "Bangalore, Karnataka",
//     category: "Business",
//     price: 999,
//     description: "Connect with entrepreneurs and business leaders.",
//     image:
//       "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
//     status: "Live",
//   },
//   {
//     id: 4,
//     title: "Cricket Championship",
//     date: "2026-11-10",
//     time: "16:00",
//     location: "Rajkot, Gujarat",
//     category: "Sports",
//     price: 699,
//     description: "Watch an exciting cricket championship.",
//     image:
//       "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
//     status: "Live",
//   },
//   {
//     id: 5,
//     title: "Digital Marketing Workshop",
//     date: "2026-11-18",
//     time: "11:00",
//     location: "Ahmedabad, Gujarat",
//     category: "Education",
//     price: 299,
//     description: "Learn modern digital marketing strategies.",
//     image:
//       "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80",
//     status: "Live",
//   },
//   {
//     id: 6,
//     title: "Comedy Night",
//     date: "2026-11-25",
//     time: "20:00",
//     location: "Surat, Gujarat",
//     category: "Entertainment",
//     price: 399,
//     description: "Enjoy a fun-filled comedy night.",
//     image:
//       "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80",
//     status: "Live",
//   },
// ];

// const categories = [
//   "All",
//   "Technology",
//   "Music",
//   "Sports",
//   "Business",
//   "Education",
//   "Entertainment",
// ];

// function Events() {
//   const [events, setEvents] = useState([]);
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");

//   // Loading state
//   const [loading, setLoading] = useState(true);

//   // Error state
//   const [error, setError] = useState("");

//   // Load Events
//   useEffect(() => {
//     const loadEvents = () => {
//       try {
//         setLoading(true);
//         setError("");

//         const storedData = localStorage.getItem("eventHubEvents");

//         let storedEvents = [];

//         if (storedData) {
//           storedEvents = JSON.parse(storedData);
//         }

//         if (Array.isArray(storedEvents) && storedEvents.length > 0) {
//           setEvents(storedEvents);
//         } else {
//           localStorage.setItem("eventHubEvents", JSON.stringify(defaultEvents));

//           setEvents(defaultEvents);
//         }
//       } catch (err) {
//         console.error("Error loading events:", err);

//         setError(
//           "Unable to load events. Something went wrong. Please try again.",
//         );

//         setEvents([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Small delay so loading state can be seen properly
//     const timer = setTimeout(() => {
//       loadEvents();
//     }, 400);

//     return () => clearTimeout(timer);
//   }, []);

//   // Retry
//   const handleRetry = () => {
//     window.location.reload();
//   };

//   // Only Live Events
//   const liveEvents = events.filter((event) => event.status === "Live");

//   // Search + Category Filter
//   const filteredEvents = liveEvents.filter((event) => {
//     const searchText = search.toLowerCase().trim();

//     const matchesSearch =
//       event.title?.toLowerCase().includes(searchText) ||
//       event.location?.toLowerCase().includes(searchText) ||
//       event.category?.toLowerCase().includes(searchText);

//     const matchesCategory = category === "All" || event.category === category;

//     return matchesSearch && matchesCategory;
//   });

//   const clearFilters = () => {
//     setSearch("");
//     setCategory("All");
//   };

//   // Loading UI
//   if (loading) {
//     return (
//       <div className="events-page">
//         <section className="events-loading">
//           <div className="loading-spinner"></div>

//           <h2>Loading Events...</h2>

//           <p>Please wait while we load the latest events.</p>
//         </section>
//       </div>
//     );
//   }

//   // Error UI
//   if (error) {
//     return (
//       <div className="events-page">
//         <section className="events-error">
//           <div className="error-icon">⚠️</div>

//           <h2>Something Went Wrong</h2>

//           <p>{error}</p>

//           <button onClick={handleRetry} className="retry-btn">
//             Try Again
//           </button>
//         </section>
//       </div>
//     );
//   }

//   return (
//     <div className="events-page">
//       {/* Header */}
//       <section className="events-header">
//         <div className="events-header-content">
//           <span>EVENTHUB EVENTS</span>

//           <h1>Discover Events</h1>

//           <p>
//             Find the best events, concerts, workshops and experiences happening
//             near you.
//           </p>
//         </div>
//       </section>

//       {/* Filters */}
//       <section className="filters-section">
//         <div className="filters-container">
//           {/* Search */}
//           <div className="events-search">
//             <span>🔍</span>

//             <input
//               type="text"
//               placeholder="Search events or location..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           {/* Category */}
//           <div className="category-filter">
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//             >
//               {categories.map((item) => (
//                 <option key={item} value={item}>
//                   {item}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </section>

//       {/* Events */}
//       <section className="all-events-section">
//         <div className="events-top">
//           <h2>{category === "All" ? "All Events" : `${category} Events`}</h2>

//           <span>{filteredEvents.length} events found</span>
//         </div>

//         {filteredEvents.length > 0 ? (
//           <div className="all-events-grid">
//             {filteredEvents.map((event) => (
//               <div className="event-card" key={event.id}>
//                 {/* Image */}
//                 <div className="event-image-container">
//                   <img
//                     src={
//                       event.image ||
//                       "https://via.placeholder.com/800x500?text=Event"
//                     }
//                     alt={event.title}
//                     className="event-image"
//                     onError={(e) => {
//                       e.target.src =
//                         "https://via.placeholder.com/800x500?text=Event";
//                     }}
//                   />

//                   <span className="event-category">{event.category}</span>
//                 </div>

//                 {/* Content */}
//                 <div className="event-content">
//                   <h3>{event.title}</h3>

//                   <div className="event-info">
//                     <p>📅 {event.date || "Date not available"}</p>

//                     <p>⏰ {event.time || "Time not available"}</p>

//                     <p>📍 {event.location || "Location not available"}</p>
//                   </div>

//                   {/* Footer */}
//                   <div className="event-footer">
//                     <div className="price">
//                       <small>Starting from</small>

//                       <strong>₹{Number(event.price || 0)}</strong>
//                     </div>

//                     <Link to={`/events/${event.id}`} className="view-event-btn">
//                       View Event
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="no-events">
//             <div>🔎</div>

//             <h3>No Events Found</h3>

//             <p>Try searching for another event or category.</p>

//             <button onClick={clearFilters}>Clear Filters</button>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

// export default Events;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Events.css";

const categories = [
  "All",
  "Technology",
  "Music",
  "Sports",
  "Business",
  "Education",
  "Entertainment",
];

function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load events from MongoDB through Backend API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/events");

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();

        setEvents(data);
      } catch (err) {
        console.error("Error loading events:", err);

        setError(
          "Unable to load events. Please make sure the backend server is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Retry
  const handleRetry = () => {
    window.location.reload();
  };

  // Only Live Events
  const liveEvents = events.filter((event) => event.status === "Live");

  // Search + Category Filter
  const filteredEvents = liveEvents.filter((event) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      event.title?.toLowerCase().includes(searchText) ||
      event.location?.toLowerCase().includes(searchText) ||
      event.category?.toLowerCase().includes(searchText);

    const matchesCategory = category === "All" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  // Loading UI
  if (loading) {
    return (
      <div className="events-page">
        <section className="events-loading">
          <div className="loading-spinner"></div>

          <h2>Loading Events...</h2>

          <p>Please wait while we load the latest events.</p>
        </section>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="events-page">
        <section className="events-error">
          <div className="error-icon">⚠️</div>

          <h2>Something Went Wrong</h2>

          <p>{error}</p>

          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="events-page">
      {/* Header */}
      <section className="events-header">
        <div className="events-header-content">
          <span>EVENTHUB EVENTS</span>

          <h1>Discover Events</h1>

          <p>
            Find the best events, concerts, workshops and experiences happening
            near you.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filters-container">
          {/* Search */}
          <div className="events-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search events or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="category-filter">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="all-events-section">
        <div className="events-top">
          <h2>{category === "All" ? "All Events" : `${category} Events`}</h2>

          <span>{filteredEvents.length} events found</span>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="all-events-grid">
            {filteredEvents.map((event) => (
              <div className="event-card" key={event._id}>
                {/* Image */}
                <div className="event-image-container">
                  <img
                    src={
                      event.image ||
                      "https://via.placeholder.com/800x500?text=Event"
                    }
                    alt={event.title}
                    className="event-image"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/800x500?text=Event";
                    }}
                  />

                  <span className="event-category">{event.category}</span>
                </div>

                {/* Content */}
                <div className="event-content">
                  <h3>{event.title}</h3>

                  <div className="event-info">
                    <p>📅 {event.date || "Date not available"}</p>

                    <p>⏰ {event.time || "Time not available"}</p>

                    <p>📍 {event.location || "Location not available"}</p>
                  </div>

                  {/* Footer */}
                  <div className="event-footer">
                    <div className="price">
                      <small>Starting from</small>

                      <strong>₹{Number(event.price || 0)}</strong>
                    </div>

                    <Link
                      to={`/events/${event._id}`}
                      className="view-event-btn"
                    >
                      View Event
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <div>🔎</div>

            <h3>No Events Found</h3>

            <p>Try searching for another event or category.</p>

            <button onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Events;
