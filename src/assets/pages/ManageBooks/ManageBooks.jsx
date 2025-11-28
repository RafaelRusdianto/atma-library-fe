import "./ManageBooks.css";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManageBooks() {

    const navigate = useNavigate();

    return (
        <div className="manage-wrapper">

            {/* HEADER */}
            <header className="header">
                <h1>Manage Books</h1>
                <p>Select an option to add a new book to the catalog or update an existing one.</p>
            </header>

            {/* CARD LAYOUT */}
            <div className="card-container">

                {/* CREATE NEW BOOK */}
                <div className="card">
                    <img
                        src="/managebooks/create.jpg"
                        className="card-img"
                        alt="Create New Book"
                    />

                    <h3>Create New Book</h3>
                    <p>
                        Add a new title to the library’s digital catalog. You will be asked to
                        provide details like ISBN, title, author, and publication information.
                    </p>

                    <button className="btn-primary" onClick={() => navigate("/managebooks/createnewbook")}>
                        <Plus size={18} />
                        Add New Book
                    </button>
                </div>

                {/* EDIT EXISTING BOOK */}
                <div className="card">
                    <img
                        src="/managebooks/edit.png"
                        className="card-img"
                        alt="Edit Book"
                    />

                    <h3>Edit Existing Book</h3>
                    <p>
                        Search for a book by title, author, or ISBN to update its details,
                        manage copies, or change its status.
                    </p>

                    <button className="btn-secondary" onClick={() => navigate("/managebooks/editexistingbook")}>
                        <Search size={18} />
                        Find & Edit Book
                    </button>
                </div>
            </div>
        </div>
    );
}
