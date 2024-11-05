/** @format */

import React, { useState } from "react";

const Complaint = () => {
    const [complaints, setComplaints] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add new complaint to the list with a default status of "Pending"
        const newComplaint = {
            title,
            body,
            date,
            status: "Pending",
        };
        setComplaints([...complaints, newComplaint]);
        setShowForm(false);
        setTitle("");
        setBody("");
        setDate("");
    };

    const handleNewComplaint = () => {
        setShowForm(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Complaints</h1>

            {!showForm && (
                <div>
                    <button
                        onClick={handleNewComplaint}
                        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
                    >
                        New Complaint
                    </button>
                    <h2 className="text-xl font-semibold mb-4">My Complaints</h2>
                    {complaints.length > 0 ? (
                        <ul className="space-y-4">
                            {complaints.map((complaint, index) => (
                                <li key={index} className="border p-4 rounded">
                                    <p>
                                        <strong>Title:</strong> {complaint.title}
                                    </p>
                                    <p>
                                        <strong>Problem:</strong> {complaint.body}
                                    </p>
                                    <p>
                                        <strong>Date:</strong> {complaint.date}
                                    </p>
                                    <p>
                                        <strong>Status:</strong> {complaint.status}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No complaints found. Click "New Complaint" to file one.</p>
                    )}
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold">Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter complaint title"
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Problem:</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Describe your complaint"
                            className="border p-2 w-full"
                            rows="5"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block font-semibold">Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Submit Complaint
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                    >
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
};

export default Complaint;
