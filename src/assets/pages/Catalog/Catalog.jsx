import { Search } from "lucide-react";
import "./Catalog.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../config/api";

const BookCard = ({ book }) => { //parameternya 1 buah buku
    const navigate = useNavigate();
    return (
        <div
            className="book-card"
            onClick={() => navigate(`/catalog/book/${book.id_buku}`)}
            style={{ cursor: "pointer" }}
        >
            <img src={book.url_foto_cover} alt={book.judul} className="book-image" />
            {/* cari cover buku disini https://openlibrary.org/dev/docs/api/covers */}
            <p className="book-title">{book.judul}</p>
            <p className="book-author">{book.penulis}</p>
        </div>
    );
};

const BookSection = ({ title, books }) => (
    <div className="book-section">
        <h2 className="section-title">{title}</h2>
        <div className="book-row">
            {books.map((b, i) => (
                <BookCard key={i} book={b} />
            ))}
        </div>
    </div>
);

export default function LibraryCatalog() {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");//utk search
    const [filteredBooks, setFilteredBooks] = useState([]);//fetch all books utk search

    const [randBooks, setRecommendation] = useState([]);//fetch 8 rand books, utk fungsi setRec
    const [showDropdown, setShowDropdown] = useState(false);//utk dropdown

    const [genreBooks, setGenreBooks] = useState([]);//utk buku sesuai genre


    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search") || "";


    //recommendations
    useEffect(() => {
        api.get("/books/random")
            .then((res) => {
                setRecommendation(res.data.data);
            })
            .catch((err) => {
                console.error("Error fetching books:", err);
            });
    }, []);

    //search bar
    useEffect(() => {
        if (query.trim() === "") { //cek isinya spasi doang kaga
            setFilteredBooks([]); //klo kosong, set array kosong
            return;
        }

        api.get(`/buku/search?q=${query}`)
            .then((res) => setFilteredBooks(res.data.data))
            .catch((err) => console.error("Error searching books:", err));
    }, [query]);//inputan search

    return (
        <div className="page-container">
            <header className="header">
                <h1 className="header-title">University Library Catalog</h1>
                <p className="header-subtitle">Search for books, articles, journals, and more.</p>
            </header>

            <div className="content">
                {/* Sidebar Filters */}
                <aside className="sidebar">
                    <h3>Filters</h3>

                    {/* FICTION */}
                    <div className="filter-group">
                        <label className="filter-label">Fiction</label>
                        {[
                            "Fantasy", "Science Fiction", "Dystopian", "Horror", "Mystery / Thriller",
                            "Adventure", "Action", "Contemporary Fiction", "Historical Fiction",
                            "Classic Literature", "Literary Fiction", "Mythology"
                        ].map((f) => (
                            <div key={f} className="filter-option">
                                <input
                                    type="radio"
                                    name="genre"
                                    id={f}
                                    value={f}
                                    onChange={(e) => {
                                        api.post("/buku/byKategori", {
                                            kategori: e.target.value
                                        })
                                            .then((res) => setGenreBooks(res.data.data.slice(0, 12)))
                                            .catch((err) => console.error(err));
                                    }}
                                />
                                <label htmlFor={f}>{f}</label>
                            </div>
                        ))}
                    </div>

                    {/* NON-FICTION */}
                    <div className="filter-group">
                        <label className="filter-label">Non-Fiction</label>
                        {[
                            "Memoir / Biography", "Self-Help", "Personal Development", "Psychology",
                            "Economics", "History", "Philosophy", "Business / Entrepreneurship",
                            "Political Commentary"
                        ].map((f) => (
                            <div key={f} className="filter-option">
                                <input
                                    type="radio"
                                    name="genre"
                                    id={f}
                                    value={f}
                                    onChange={(e) => {
                                        api.post("/buku/byKategori", {
                                            kategori: e.target.value
                                        })
                                            .then((res) => setGenreBooks(res.data.data.slice(0, 12)))
                                            .catch((err) => console.error(err));
                                    }}

                                />
                                <label htmlFor={f}>{f}</label>
                            </div>
                        ))}
                    </div>

                    {/* CLEAR ALL BUTTON */}
                    <button
                        className="clear-btn"
                        onClick={() => {
                            document
                                .querySelectorAll('input[name="genre"]')
                                .forEach((r) => (r.checked = false));

                            setGenreBooks([]); // ← WAJIB
                        }}
                    >
                        Clear All Filters
                    </button>
                </aside>

                {/* Main Area */}
                <main className="main">
                    {/* Search Bar */}
                    <div className="search-container"
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        onFocus={() => query.length > 0 && setShowDropdown(true)}
                        tabIndex={0}>
                        {/* utk hide dropdown kl klik luar */}

                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title, author, or ISBN"
                            className="search-input"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowDropdown(e.target.value.length > 0);
                            }} />
                        {showDropdown && filteredBooks.length > 0 && (
                            <div className="dropdown-results">
                                {filteredBooks.map((book) => (
                                    <div
                                        key={book.id_buku}
                                        className="dropdown-item"
                                        onClick={() => navigate(`/catalog/book/${book.id_buku}`)}
                                    >
                                        <img src={book.url_foto_cover} className="dropdown-thumb" />
                                        <div>
                                            <p className="dropdown-title">{book.judul}</p>
                                            <p className="dropdown-author">{book.penulis}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sections */}

                    <BookSection title="Recommendations" books={randBooks} />
                    <div className="book-section">
                        <h2 className="section-title">Filtered</h2>
                        <div className="book-grid">
                            {genreBooks.map((b, i) => (
                                <BookCard key={i} book={b} />
                            ))}
                        </div>
                    </div>
                    {/* <BookSection title="Kategori 1" books={books1} /> */}
                    {/* <BookSection title="Kategori 2" books={books2} /> */}
                </main>
            </div>
        </div>
    );
}