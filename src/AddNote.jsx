import styles from "./AddNote.module.scss";

function AddNote({onAddNote: onAddNoteCB}) {

    function handleClick() {
        onAddNoteCB("Untitled", "# Write Something!");
    }

    return (
        <div onClick={handleClick} className={["noteShape" + " " + styles.addNote]}>
            <h1>Add</h1>
        </div>
    );
}

export default AddNote;