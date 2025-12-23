import { useEffect, useState } from "react";
import "../../styles/GoogleSheet.css";
const CLASSES = [
    { id: "FYBCA", name: "FY BCA" },
    { id: "SYBCA", name: "SY BCA" },
    { id: "TYBCA", name: "TY BCA" },

    { id: "FYBCS", name: "FY BCS" },
    { id: "SYBCS", name: "SY BCS" },
    { id: "TYBCS", name: "TY BCS" },

    { id: "MSC-COMP-1", name: "MSC COMP - I" },
    { id: "MSC-COMP-2", name: "MSC COMP - II" },

    { id: "MCA-1", name: "MCA - I" },
    { id: "MCA-2", name: "MCA - II" },
];

const STORAGE_KEY = "class_google_sheets";

const GoogleSheet = ({ selectedClassId }) => {
    const [links, setLinks] = useState({});

    // Load links from localStorage
    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (stored && typeof stored === "object") {
                setLinks(stored);
            }
        } catch (err) {
            console.error("Failed to load links", err);
        }
    }, []);

    // Save links to localStorage
    const saveLinks = (updated) => {
        setLinks(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleChange = (classId, value) => {
        saveLinks({
            ...links,
            [classId]: value,
        });
    };

    const copyLink = async (classId) => {
        const link = links[classId];
        if (!link) {
            alert("No link to copy");
            return;
        }

        try {
            await navigator.clipboard.writeText(link);
            alert("Link copied to clipboard ✅");
        } catch (err) {
            alert("Failed to copy link ❌");
        }
    };

    // 🔹 Filter only selected class
    const selectedClass = CLASSES.filter(
        (cls) => cls.id === selectedClassId
    );

    if (!selectedClassId) {
        return <p>No class selected.</p>;
    }

    return (
        <div className="sheet-container">
            <div className="sheet-title">
                <p>
                    Google Sheet Link of {selectedClass[0]?.name}
                </p>
            </div>
            {selectedClass.map((cls) => (
                <div key={cls.id} className="sheet-card">
                

                    <input
                        type="url"
                        className="sheet-input"
                        placeholder="Paste Google Sheet link here"
                        value={links[cls.id] || ""}
                        onChange={(e) => handleChange(cls.id, e.target.value)}
                    />

                    <button
                        onClick={() => copyLink(cls.id)}
                        className="sheet-copy-btn"
                    >
                        Copy Link
                    </button>
                </div>
            ))}
        </div>

    );
};

export default GoogleSheet;
