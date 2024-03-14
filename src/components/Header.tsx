import React, { ChangeEvent } from "react";
import { Link } from "react-router-dom";

import styles from "./Header.module.scss";
import expImage from "../assets/export.png";
import impImage from "../assets/import.png";
import * as NoteProvider from "../NoteProvider";

function Header() {
    const noteContext = NoteProvider.useNotes();

    function onExport() {
        const jsonData = localStorage.getItem("notes");
        const blob = new Blob([jsonData as BlobPart], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.json";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    }

    function onImport(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files === null) return;

        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            if (event.target === null || event.target.result === null) return;
            const jsonData = event.target.result.toString();
            if (jsonData === null) return;
            localStorage.setItem("notes", jsonData);
            noteContext.loadNotes();
        };

        reader.readAsText(file);
    }

    return (
        <div className={styles.header}>
            <Link to={"/GTNHNotes/"} className="link">
                GTNH Notes
            </Link>
            <div className={styles.buttons}>
                <div
                    onClick={onExport}
                    className={`clickable ${styles.expimp} ${styles.export}`}
                    title="Export"
                >
                    <img src={expImage} />
                </div>

                <div title="Import" className={`clickable ${styles.expimp} ${styles.import}`}>
                    <img src={impImage} />
                    <input
                        title="Import"
                        onChange={onImport}
                        type="file"
                        accept=".json"
                    />
                </div>
            </div>
        </div>
    );
}

export default Header;
