import styles from "./Header.module.scss";

function Header() {

    function onExport() {
        const jsonData = localStorage.getItem("notes");
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    }

    function onImport(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const jsonData = event.target.result;
            localStorage.setItem("notes", jsonData);
        }

        reader.readAsText(file);
    }

    return (
        <div className={styles.header}>
            <h1 className={styles.title}>GTNH Notes</h1>
            <input type="text" className={styles.search} />
            <div className={styles.buttons}>
                <img title="Export" onClick={onExport} className={["clickable" + " " + styles.export]} src="./assets/export.png" />
                <div className={["clickable" + " " + styles.import]}>
                    <input title="Import" onChange={onImport} type="file" accept=".json" />
                </div>
            </div>
        </div>
    );
}

export default Header;
