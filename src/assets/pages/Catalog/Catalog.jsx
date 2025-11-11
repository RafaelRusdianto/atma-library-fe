import React from "react";
import { Import, Search } from "lucide-react";
import "./Catalog.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const BookCard = ({ book }) => { //parameternya 1 buah buku
    const navigate = useNavigate();
    return (
        <div
            className="book-card"
            onClick={() => navigate(`/book/${book.id_buku}`)}
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
    const [allBooks, setAllBooks] = useState([]);//fetch all books utk search

    const [randBooks, setRecommendation] = useState([]);//fetch 8 rand books, utk fungsi setRec
    const [showDropdown, setShowDropdown] = useState(false);//utk dropdown

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/books/random") //diambil random buku dr route ini
            .then((res) => res.json())                   //ubah ke json
            .then((data) => setRecommendation(data.data)) //pake function setAllBooks utk simpen datanya di var randBooks
            .catch((err) => console.error("Error fetching books:", err));
    }, []);

    //search bar
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/buku") //diambil semua buku dr route ini
            .then((res) => res.json())           //ubah ke json
            .then((data) => setAllBooks(data.data))//pake function setAllBooks utk simpen datanya di var allBooks
            .catch((err) => console.error("Error fetching books:", err));
    }, []);
    //dropdown                          //book ini parameter yg dibawa ke const BookCard
    const filteredBooks = allBooks.filter((book) =>   //allbooks difilter (.filter(book)) sesuai dgn pencarian, trs disimpen di filteredBooks
        book.judul.toLowerCase().includes(query.toLowerCase()) ||
        book.penulis.toLowerCase().includes(query.toLowerCase()) ||
        (book.isbn && book.isbn.toLowerCase().includes(query.toLowerCase()))
    );


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
                    <div className="filter-group">
                        <label className="filter-label">Availability</label>
                        <div className="filter-option">
                            <input type="checkbox" id="available" />
                            <label htmlFor="available">Available Now</label>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Format</label>
                        {["Book", "eBook", "Journal", "Article"].map((f) => (
                            <div key={f} className="filter-option">
                                <input type="checkbox" id={f} />
                                <label htmlFor={f}>{f}</label>
                            </div>
                        ))}
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Publication Year</label>
                        <div className="year-inputs">
                            <input type="number" placeholder="From" />
                            <input type="number" placeholder="To" />
                        </div>
                    </div>
                </aside>

                {/* Main Area */}
                <main className="main">
                    {/* Search Bar */}
                    <div className="search-container"
                        onBlur={() => setShowDropdown(false)}
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
                                        onClick={() => navigate(`/book/${book.id_buku}`)}
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

                    {/* <BookSection title="Kategori 1" books={books1} /> */}
                    {/* <BookSection title="Kategori 2" books={books2} /> */}
                </main>
            </div>
        </div>
    );
}