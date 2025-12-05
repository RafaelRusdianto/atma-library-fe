import "./Home.css";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../config/api";

export default function Home() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredBooks([]);
      return;
    }

    api
      .get(`/buku/search?q=${query}`)
      .then((res) => setFilteredBooks(res.data.data || []))
      .catch((err) => console.error("Error searching books:", err));
  }, [query]);

  const handleSearchClick = () => {
    if (!query.trim()) return;

    if (filteredBooks.length === 0) {
      setShowDropdown(false);
      return;
    }

    navigate(`/catalog?search=${encodeURIComponent(query)}`);
  };

  // kategori yang ditampilkan di "Explore Our Collections"
  const collections = [
    {
      id: "fiction",
      title: "Fiction",
      img: "/home/fantasi.jpeg",
    },
    {
      id: "science",
      title: "History",
      img: "/home/history.jpeg",
    },
    {
      id: "social",
      title: "Horror",
      img: "/home/horor.jpeg",
    },
    {
      id: "digital",
      title: "Business",
      img: "/home/business1.jpeg",
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Your Gateway to Knowledge</h1>
          <p className="hero-subtitle">
            Search the library catalog by title, author, or ISBN...
          </p>

          <div
            className="hero-search-wrapper"
            tabIndex={0}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            onFocus={() => query.length > 0 && setShowDropdown(true)}
          >
            <div className="hero-search">
              <Search className="search-icon-home" size={20} />
              <input
                type="text"
                placeholder="Enter title, author, or ISBN here"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowDropdown(e.target.value.length > 0);
                }}
              />
              <button onClick={handleSearchClick}>Search</button>
            </div>

            {/* DROPDOWN HASIL SEARCH */}
            {showDropdown && (
            <div className="hero-dropdown">
              {filteredBooks.length === 0 ? (
                <div className="hero-dropdown-item no-result">
                  Not Found !
                </div>
              ) : (
                filteredBooks.map((book) => (
                  <div
                    key={book.id_buku}
                    className="hero-dropdown-item"
                    onMouseDown={() => navigate(`/catalog/book/${book.id_buku}`)}
                  >
                    <img
                      src={book.url_foto_cover}
                      alt={book.judul}
                      className="hero-dropdown-thumb"
                    />
                    <div>
                      <p className="hero-dropdown-title">{book.judul}</p>
                      <p className="hero-dropdown-author">{book.penulis}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="collections-section">
        <h2>Explore Our Collections</h2>

        <div className="collections-grid">
          {collections.map((item) => (
            <div
              key={item.id}
              className="collection-card"
              onClick={() => navigate("/catalog")}
            >
              <img src={item.img} alt={item.title} />
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Vision & Quotes Section */}
      <section className="vision-quotes-section">
        <div className="vq-grid">

          {/* Kiri — Vision */}
          <div className="quotes-column">
            <h2 className="section-heading">Our Vision & Mission</h2>

            <div className="vision-card">
              <h3>Vision</h3>
              <p>
                To be a dynamic academic library that supports learning, research, and innovation...
              </p>

              <h3>Mission</h3>
              <ul>
                <li>Provide access to quality resources.</li>
                <li>Support students & lecturers.</li>
                <li>Create an inclusive learning space.</li>
                <li>Develop digital services for lifelong learning.</li>
              </ul>
            </div>
          </div>

          {/* KANAN: Quotes */}
          <div className="quotes-column">
            <h2>Library Quotes</h2>

            <div className="quote-card">
              <p>“A library is not a luxury but one of the necessities of life.”</p>
              <span>— Henry Ward Beecher</span>
            </div>

            <div className="quote-card">
              <p>
                “The only thing that you absolutely have to know, is the location of the library.”
              </p>
              <span>— Albert Einstein</span>
            </div>

            <div className="quote-card">
              <p>“When in doubt, go to the library.”</p>
              <span>— J.K. Rowling</span>
            </div>

          </div>


        </div>
      </section>


      {/* Map Section */}
      <section className="map-section">
        <h2>Visit Our Library</h2>
        <p className="map-text">
          Find us on campus and enjoy the library facilities for studying, research, and group discussions.
        </p>

        <div className="map-wrapper">
          <iframe
            title="Library Location Map"
            className="map-iframe"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1976.5462405421927!2d110.41426637594643!3d-7.780018584087934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59f1d2361f71%3A0x4a2ce83adbcfd5aa!2sPerpustakaan%20Universitas%20Atma%20Jaya%20Yogyakarta!5e0!3m2!1sid!2sid!4v1764848344890!5m2!1sid!2sid" 
          ></iframe>
        </div>
      </section>
    </div>
  );
}
