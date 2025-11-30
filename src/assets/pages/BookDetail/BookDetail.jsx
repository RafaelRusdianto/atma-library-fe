import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./BookDetail.css";
import api from "../../../config/api";
import Swal from "sweetalert2";


export default function BookDetail() {
    const navigate = useNavigate();
    const { id } = useParams(); // get book id from route
    const [book, setBook] = useState(null);

    useEffect(() => {
        api.get(`/buku/${id}`).then((res)=>{
            setBook(res.data.data);
            console.log("BOOK DETAIL: ", res.data.data);
        })
        .catch((err)=>{
            console.error("Error fetching book details:", err);
        })
    }, [id]);

    if (!book) return <p className="loading">Loading book details...</p>;

    const handleBorrow = async () => {
        try {
            const res = await api.post("member/detailPeminjaman", {
            id_buku: id, // BKU0001
            });

            console.log("ADD TO DRAFT RESPONSE:", res.data);

            // SweetAlert success
            Swal.fire({
            icon: "success",
            title: "Book Added!",
            text: "The book has been successfully added to your borrow draft.",
            confirmButtonColor: "#2563eb",
            });

            // TIDAK navigate, tetap di halaman ini
        } catch (err) {
            console.error("Error adding book to draft:", err);

            Swal.fire({
            icon: "error",
            title: "Error",
            text:
                err?.response?.data?.message ||
                "Failed to add this book to your borrow draft.",
            confirmButtonColor: "#dc2626",
            });
        }
        };


    return (
        < div className="book-detail-container" >
            <div className="breadcrumb">
                <Link to="/catalog">Catalog</Link> /{" "}
                /{" "}
                <span className="title">{book.judul}</span>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td className="book-detail-td">
                            {/* Title */}
                            <h1 className="book-title-detail">{book.judul}</h1>
                            <div className="book-header">
                                <div className="book-info">
                                    <p className="book-author">By {book.penulis}</p>
                                    <p className="book-status">Available</p>
                                    {/* NANTI GANTI AVAILABILITY LEWAT QUERY */}
                                </div>
                            </div>

                            {/* Book Details */}
                            <section className="details-section">
                                <h2>Book Details</h2>
                                <table className="details-table">
                                    <tbody>
                                        <tr>
                                            <td className="label">Author</td>
                                            <td className="book-detail-value">{book.penulis}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">Publisher</td>
                                            <td className="book-detail-value">{book.penerbit || "Unknown"}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">Publication Date</td>
                                            <td className="book-detail-value">{book.tahun_terbit || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">ISBN</td>
                                            <td className="book-detail-value">{book.ISBN || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">Stok</td>
                                            <td className="book-detail-value">{book.stok || "-"}</td>
                                            {/* HITUNG LEWAT QUERY COPY BUKU */}
                                        </tr>
                                    </tbody>
                                </table>
                            </section>
                            {/* Abstract */}
                            <section className="abstract-section">
                                <h2>Abstract</h2>
                                <p>
                                    {book.deskripsi ||
                                        "No abstract available. This book’s description will appear here when provided."}
                                </p>
                            </section>
                        </td>
                        <td className="book-cover-td">
                            <div className="book-cover">
                                <img
                                    src={book.url_foto_cover}
                                    alt={book.judul}
                                    className="book-cover-img"
                                />
                            </div>
                            <div className="btn-section">
                                {/* button-nya nanti deactivate kalo stok == 0 */}
                                <button
                                    type="button"
                                    className="btn-pinjam"
                                   onClick={handleBorrow}
                                >
                                    Borrow
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div >
    );
}