import React from "react";
import { Search } from "lucide-react";
import "./Catalog.css";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

const BookCard = ({ book }) => {
    const navigate = useNavigate();
    return (
        <div
            className="book-card"
            onClick={() => navigate(`/book/${book.id_buku}`)}
            style={{ cursor: "pointer" }}
        >
            <img src={book.img} alt={book.judul} className="book-image" />
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
    const [randBooks, setRecommendation] = useState([]);//variabel randBooks, utk fungsi setRec
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/books/random") //diambil dr route ini
            .then((res) => res.json())
            .then((data) => setRecommendation(data.data))
            .catch((err) => console.error("Error fetching books:", err));
    }, []);

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
                    <div className="search-container">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title, author, or keyword"
                            className="search-input"
                        />
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