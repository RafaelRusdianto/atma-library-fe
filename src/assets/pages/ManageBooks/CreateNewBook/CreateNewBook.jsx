import "./CreateNewBook.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../../../config/api";

export default function CreateNewBook() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isbn, setIsbn] = useState("");
    const [publisher, setPublisher] = useState("");
    const [year, setYear] = useState("");
    const [description, setDescription] = useState("");
    const [coverUrl, setCoverUrl] = useState("");

    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);

    function resetForm() {
        setTitle("");
        setAuthor("");
        setIsbn("");
        setPublisher("");
        setYear("");
        setDescription("");
        setCoverUrl("");
        setSelectedGenres([]);
    }

    useEffect(() => {
        axios.get("/api/kategori")
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

        axios.post("/petugas/buku", payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(() => {
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
        <div className="cnb-wrapper">
            <div className="cnb-container">

                <h1 className="cnb-title">Create New Book Entry</h1>

                <form className="cnb-form" onSubmit={handleSubmit}>
                    <div className="cnb-grid">

                        <div className="cnb-field">
                            <label>Book Title</label>
                            <input
                                type="text"
                                placeholder="e.g., The Principles of Quantum Mechanics"
                                value={title}
                                onChange={e => setTitle(e.target.value)} />
                        </div>

                        <div className="cnb-field">
                            <label>Author(s)</label>
                            <div className="cnb-author-row">
                                <input
                                    type="text"
                                    placeholder="e.g., P. A. M. Dirac"
                                    value={author}
                                    onChange={e => setAuthor(e.target.value)} />
                            </div>
                        </div>

                        <div className="cnb-field">
                            <label>ISBN</label>
                            <input
                                type="text"
                                placeholder="e.g., 978-0-19-852011-5"
                                value={isbn}
                                onChange={e => setIsbn(e.target.value)}
                            />
                        </div>

                        <div className="cnb-field">
                            <label>Publisher</label>
                            <input
                                type="text"
                                placeholder="e.g., Oxford University Press"
                                value={publisher}
                                onChange={e => setPublisher(e.target.value)}
                            />
                        </div>

                        <div className="cnb-field">
                            <label>Publication Year</label>
                            <input
                                type="text"
                                placeholder="e.g., 1930"
                                value={year}
                                onChange={e => setYear(e.target.value)}
                            />
                        </div>

                        <div className="cnb-field">
                            <label>Genre</label>

                            <Select
                                isMulti
                                options={genres}
                                value={selectedGenres}
                                onChange={setSelectedGenres}
                                placeholder="Select genres..."
                            />
                        </div>

                        <div className="cnb-field">
                            <label>Cover Image</label>
                            <input
                                type="text"
                                placeholder="e.g., https://example.com/image.jpg"
                                value={coverUrl}
                                onChange={e => setCoverUrl(e.target.value)}
                            />
                        </div>

                        <div className="cnb-field cnb-full">
                            <label>Description / Abstract</label>
                            <textarea
                                placeholder="Enter a brief summary of the book..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    <div className="cnb-btn-row">
                        <button type="button" className="cnb-cancel" onClick={() => navigate("/managebooks")}>Cancel</button>
                        <button type="submit" className="cnb-submit">Submit</button>
                    </div>
                </form>

            </div>
        </div>
    );
}
