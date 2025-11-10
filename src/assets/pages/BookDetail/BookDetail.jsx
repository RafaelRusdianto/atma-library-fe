import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./BookDetail.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function BookDetails() {
    const { id_buku } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/buku/${id_buku}`)
            .then(res => res.json())
            .then(data => setBook(data.data))
            .catch(err => console.error("Error:", err));
    }, [id_buku]);

    if (!book) return <p>Loading...</p>;

    return (
        <div className="book-detail-page">
            <h1>{book.judul}</h1>
            <img src={book.img} alt={book.judul} className="book-detail-image" />
            <p><strong>Author:</strong> {book.penulis}</p>
            <p><strong>Penerbit:</strong> {book.penerbit}</p>
            <p><strong>ISBN:</strong> {book.ISBN}</p>
            <p><strong>Tahun Terbit:</strong> {book.tahun_terbit}</p>
        </div>
    );
}


//bisa pinjem disini
//klo blm login, ke login page