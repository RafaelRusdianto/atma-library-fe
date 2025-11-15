import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Peminjaman.css";

export default function Peminjaman() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/buku/${id}`)
            .then((res) => res.json())
            .then((data) => setBook(data.data))
            .catch(() => toast.error("Failed to load book data"));
    }, [id]);

    if (!book) return <p className="loading">Loading borrowing details...</p>;

    return (
        <div className="peminjaman-container">

        </div>
    );
}