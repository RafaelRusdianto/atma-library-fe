import "./EditExistingBook.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import api from "../../../../config/api";
import Select from "react-select";

export default function EditExistingBook() {
    const navigate = useNavigate();

    //search bar
    const [showDropdown, setShowDropdown] = useState(false);
    const [query, setQuery] = useState("");//utk search
    const [filteredBooks, setFilteredBooks] = useState([]);//fetch all books utk search
    const [bookData, setBookData] = useState({
        id_buku: "",
        judul: "",
        penulis: "",
        ISBN: "",
        penerbit: "",
        tahun_terbit: "",
        url_foto_cover: "",
        deskripsi: "",
        jumlah_copy: "",
        id_kategori: ""
    });

    useEffect(() => {
        if (query.trim() === "") { //cek isinya spasi doang kaga
            setFilteredBooks([]); //klo kosong, set array kosong
            return;
        }

        api.get(`/buku/search?q=${query}`)
            .then((res) => setFilteredBooks(res.data.data))
            .catch((err) => console.error("Error searching books:", err));
    }, [query]);//inputan search

    //utk auto-fill kategori
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);

    useEffect(() => {
        api.get("/kategori")
            .then(res => {
                const list = res.data.data.map(k => ({
                    value: k.id_kategori,
                    label: k.nama_kategori
                }));
                setGenres(list);
            })
            .catch(err => console.error(err));
    }, []);

    function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            judul: title,
            penulis: author,
            deskripsi: description,
            penerbit: publisher,
            ISBN: isbn,
            tahun_terbit: year,
            url_foto_cover: coverUrl ?? null,
            id_kategori: selectedGenres.map(g => g.value),
        };

        axios.post("/api/buku/{id_buku}", payload).then(() => {
            resetForm();
            toast.success("Book added successfully!");
        }).catch(err => {
            console.error(err);

            if (err.response?.data?.errors) {
                const errorList = err.response.data.errors;

                Object.values(errorList).forEach(msgArr => {
                    toast.error(msgArr[0]);
                });
                return;
            }
            const message =
                err.response?.data?.message ||
                "Failed adding book. Please try again.";

            toast.error(message);
        });
    }

    return (
        <div className="eb-wrapper">
            <div className="eb-container">
                <h1 className="eb-title">Edit Book Entry</h1>

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
                                    onClick={() => {
                                        setBookData(book);
                                        //set auto-fill genre
                                        if (book.kategori) {
                                            setSelectedGenres(
                                                book.kategori.map(k => ({
                                                    value: k.id_kategori,
                                                    label: k.nama_kategori
                                                }))
                                            );
                                        }

                                        setShowDropdown(false);
                                    }}
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

                <p className="eb-subtitle">
                    Modify the details for <strong>{bookData.judul || "..."}</strong> and save your changes.
                </p>

                <div className="eb-layout">

                    {/* Kiri - Cover Buku */}
                    <div className="eb-cover-section">
                        <img
                            src={bookData.url_foto_cover || "/managebooks/blank-cover.avif"}
                            className="eb-cover-img"
                            alt={bookData.judul || "Book cover"}
                        />
                        <button className="eb-change-cover">Change Cover</button>
                        <button className="eb-delete-book">Delete Book</button>
                    </div>

                    {/* Kanan - Form Edit */}
                    <form className="eb-form">
                        <div className="eb-grid">

                            <div className="eb-field">
                                <label>Book Title</label>
                                <input
                                    type="text"
                                    value={bookData.judul}
                                    onChange={(e) =>
                                        setBookData({ ...bookData, judul: e.target.value })
                                    }
                                />
                            </div>

                            <div className="eb-field">
                                <label>Author(s)</label>
                                <div className="cnb-author-row">
                                    <input
                                        type="text"
                                        value={bookData.penulis}
                                        onChange={(e) =>
                                            setBookData({ ...bookData, penulis: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="eb-field">
                                <label>ISBN</label>
                                <input
                                    type="text"
                                    value={bookData.ISBN}
                                    onChange={(e) =>
                                        setBookData({ ...bookData, ISBN: e.target.value })
                                    }
                                />
                            </div>

                            <div className="eb-field">
                                <label>Publisher</label>
                                <input
                                    type="text"
                                    value={bookData.penerbit}
                                    onChange={(e) =>
                                        setBookData({ ...bookData, penerbit: e.target.value })
                                    }
                                />
                            </div>

                            <div className="eb-field">
                                <label>Publication Year</label>
                                <input
                                    type="text"
                                    value={bookData.tahun_terbit}
                                    onChange={(e) =>
                                        setBookData({ ...bookData, tahun_terbit: e.target.value })
                                    }
                                />
                            </div>

                            <div className="eb-field">
                                <label>Genre</label>

                                <Select
                                    isMulti
                                    options={genres}
                                    value={selectedGenres}
                                    onChange={setSelectedGenres}
                                    placeholder="Select genres..."
                                    className="genre-select"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            <div className="eb-field">
                                <label>Cover Image</label>
                                <input
                                    type="text"
                                    value={bookData.url_foto_cover}
                                    onChange={(e) =>
                                        setBookData({ ...bookData, url_foto_cover: e.target.value })
                                    }
                                />
                            </div>

                            <div className="eb-field">
                                <label>Add Copy</label>
                                <input type="number" value="0" />
                            </div>

                            <div className="eb-field eb-full">
                                <label>Description / Abstract</label>
                                <textarea
                                    value={bookData.deskripsi}
                                    onChange={(e) =>
                                        setBookData({ ...bookData, deskripsi: e.target.value })
                                    }
                                />
                            </div>

                        </div>

                        <div className="eb-btn-row">
                            <button type="button" className="eb-cancel" onClick={() => navigate("/managebooks")}>Cancel</button>
                            <button type="submit" className="eb-save">Save Changes</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}
