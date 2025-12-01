import "./EditExistingBook.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import api from "../../../../config/api";
import Select from "react-select";
import Swal from "sweetalert2";

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

    //fungsi utk save edit
    function handleSave(e) {
        e.preventDefault();
        if (!bookData.judul || !bookData.penulis) {
            toast.error("Title and Author cannot be empty!");
            return;
        }

        const payload = {
            judul: bookData.judul,
            penulis: bookData.penulis,
            deskripsi: bookData.deskripsi,
            penerbit: bookData.penerbit,
            ISBN: bookData.ISBN,
            tahun_terbit: bookData.tahun_terbit,
            url_foto_cover: bookData.url_foto_cover ?? null,
            id_kategori: selectedGenres.map(g => g.value),
        };

        api.post(`/petugas/buku/${bookData.id_buku}`, payload).then(() => {
            toast.success("Book changes saved!");
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
                "Failed saving changes. Please try again.";

            toast.error(message);
        });
    }
    //fungsi utk delete buku
    const handleDeleteBook = async () => {
        if (!bookData.id_buku) return;

        try {
            //tampilkan konfirmasi
            const result = await Swal.fire({
                title: `Hapus buku "${bookData.judul}"?`,
                text: "Tindakan ini tidak dapat dibatalkan. Anda yakin ingin melanjutkan?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ya, hapus",
                cancelButtonText: "Batal",
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                reverseButtons: true,
            });

            if (!result.isConfirmed) return;

            //request delete ke backend
            const res = await api.delete(`/petugas/buku/${bookData.id_buku}`);
            console.log("DELETE RESPONSE:", res.data);

            toast.success("Buku berhasil dihapus!");

            //tampilkan Swal sukses
            await Swal.fire({
                title: "Buku terhapus",
                text: `Buku "${bookData.judul}" berhasil dihapus.`,
                icon: "success",
                confirmButtonText: "OK",
            });

            //reset form n redirect
            setBookData({
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
            setSelectedGenres([]);
            navigate("/managebooks");

        } catch (err) {
            console.error("Error deleting book:", err);
            const msg = err?.response?.data?.message || "Gagal menghapus buku. Silakan coba lagi.";
            toast.error(msg);

            await Swal.fire({
                title: "Gagal menghapus buku",
                text: msg,
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    //utk add/delete copybuku
    const [copyCount, setCopyCount] = useState(0);


    // handle increment decrement
    const handleIncreaseCopy = () => {
        setCopyCount(prev => prev + 1);
    };


    const handleDecreaseCopy = () => {
        setCopyCount(prev => (prev > 0 ? prev - 1 : 0));
    };
    //add copybuku
    const addCopyToDB = async () => {
        if (!bookData.id_buku) {
            toast.error("Pilih buku dulu!");
            return;
        }

        try {
            const payload = {
                id_buku: bookData.id_buku,
                rak: "A1",
                status: "tersedia"
            };

            const res = await api.post("/petugas/copyBuku", payload);

            toast.success("Copy berhasil ditambahkan!");
            fetchCopyCount();
        } catch (err) {
            console.error("COPY ERROR:", err);
            console.log("FULL ERROR RESPONSE:", err.response);
            console.log("ERROR STATUS:", err.response?.status);
            console.log("ERROR DATA:", err.response?.data);
            toast.error("Gagal menambah copy.");
        }
    };
    //delete copybuku
    const deleteLatestCopy = async () => {
        try {
            // ambil copy list utk buku ini
            const res = await api.get(`/copyBuku`);
            const list = res.data.data.filter(c => c.id_buku === bookData.id_buku);

            if (list.length === 0) {
                toast.error("Tidak ada copy untuk dihapus.");
                return;
            }

            const latestCopy = list[list.length - 1]; // ambil copy terakhir

            await api.delete(`/petugas/copyBuku/${latestCopy.id_buku_copy}`);

            toast.success("Copy buku berhasil dihapus!");
            fetchCopyCount();

        } catch (err) {
            console.error(err);
            toast.error("Gagal menghapus copy.");
        }
    };

    useEffect(() => {
        fetchCopyCount();
    }, [bookData.id_buku]);

    const fetchCopyCount = async () => {
        if (!bookData.id_buku) return;

        try {
            const res = await api.get(`/petugas/copyBuku/count/${bookData.id_buku}`);

            setCopyCount(res.data.data.copy_count);
        } catch (err) {
            console.error("COUNT ERROR:", err);
            setCopyCount(0);
        }
    };

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
                                        const selected = book;

                                        setBookData(selected);

                                        // auto-fill genre
                                        if (selected.kategori) {
                                            setSelectedGenres(
                                                selected.kategori.map(k => ({
                                                    value: k.id_kategori,
                                                    label: k.nama_kategori
                                                }))
                                            );
                                        }

                                        // ⬅️ panggil setelah state ke-update
                                        setTimeout(() => {
                                            fetchCopyCount();
                                        }, 0);

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
                        <button type="button" className="eb-delete-book" onClick={handleDeleteBook}>
                            Delete Book
                        </button>
                    </div>

                    {/* Kanan - Form Edit */}
                    <form className="eb-form" onSubmit={handleSave}>
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
                                <label>Cover Image URL</label>
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
                                <div className="addcopy-wrapper">
                                    <button type="button" className="addcopy-btn" onClick={deleteLatestCopy}>-</button>
                                    <input
                                        type="number"
                                        value={copyCount}
                                        readOnly
                                        className="addcopy-input"
                                    />
                                    <button type="button" className="addcopy-btn" onClick={addCopyToDB}>+</button>
                                </div>
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
