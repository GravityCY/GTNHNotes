import React, { ChangeEvent } from "react";

import styles from "./Header.module.scss";
import expImage from "../assets/export.png";
import { Link } from "react-router-dom";

function Header({ page }) {
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
        };

        reader.readAsText(file);
    }

    function Buttons() {
        return (
            <div className={styles.buttons}>
                <img
                    title="Export"
                    onClick={onExport}
                    className={"clickable" + " " + styles.export}
                    src={expImage}
                />
                <div className={"clickable" + " " + styles.import}>
                    <input
                        title="Import"
                        onChange={onImport}
                        type="file"
                        accept=".json"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.header}>
            <Link to={"/GTNHNotes"} className="link">
                GTNH Notes
            </Link>
            <Link to={"/GTNHNotes/tips"} className="link">
                Tips
            </Link>
            {page === "notes" && Buttons()}
        </div>
    );
}

export default Header;
