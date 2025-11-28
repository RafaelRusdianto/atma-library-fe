import React from "react";
import "./EditExistingBook.css";

export default function EditBook() {
    return (
        <div className="eb-wrapper">
            <div className="eb-container">

                <h1 className="eb-title">Edit Book Entry</h1>
                <p className="eb-subtitle">
                    Modify the details for <strong>"The Great Gatsby"</strong> and save your changes.
                </p>

                <div className="eb-layout">

                    {/* LEFT SIDE - COVER */}
                    <div className="eb-cover-section">
                        <img
                            src="https://i.imgur.com/EaQF7fW.png"
                            alt="Book Cover"
                            className="eb-cover-img"
                        />
                        <button className="eb-change-cover">Change Cover</button>
                        <button className="eb-delete-book">Delete Book</button>
                    </div>

                    {/* RIGHT FORM */}
                    <form className="eb-form">
                        <div className="eb-grid">

                            <div className="eb-field">
                                <label>Book Title</label>
                                <input type="text" value="The Great Gatsby" />
                            </div>

                            <div className="eb-field">
                                <label>Author(s)</label>
                                <input type="text" value="F. Scott Fitzgerald" />
                            </div>

                            <div className="eb-field">
                                <label>ISBN</label>
                                <input type="text" value="978-0743273565" />
                            </div>

                            <div className="eb-field">
                                <label>Publisher</label>
                                <input type="text" value="Charles Scribner's Sons" />
                            </div>

                            <div className="eb-field">
                                <label>Publication Date</label>
                                <input type="date" value="1925-04-10" />
                            </div>

                            <div className="eb-field">
                                <label>Genre/Category</label>
                                <select>
                                    <option>Classic</option>
                                </select>
                            </div>

                            <div className="eb-field">
                                <label>Number of Pages</label>
                                <input type="number" value="180" />
                            </div>

                            <div className="eb-field eb-full">
                                <label>Description/Synopsis</label>
                                <textarea defaultValue={`The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald...`}></textarea>
                            </div>

                            <div className="eb-field">
                                <label>Copies Available</label>
                                <input type="number" value="5" />
                            </div>

                        </div>

                        <div className="eb-btn-row">
                            <button type="button" className="eb-cancel">Cancel</button>
                            <button type="submit" className="eb-save">Save Changes</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}
