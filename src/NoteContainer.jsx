import { useEffect, useState } from "react";
import AddNote from "./AddNote";
import Note from "./Note";
import styles from "./NoteContainer.module.scss";

class OrderedMap {
    constructor() {
        this.order = [];
        this.map = {};
    }

    serialize() {
        return JSON.stringify(this);
    }

    deserialize(str) {
        const data = JSON.parse(str);
        this.order = [...data.order];
        this.map = { ...data.map };
    }

    set(key, value) {
        if (value == null) {
            this.remove(key);
            return;
        }
        if (this.map[key] == null) {
            this.order.push(key);
        }
        this.map[key] = value;
    }

    get(key) {
        return this.map[key];
    }

    all() {
        return this.order.map((key) => ({
            key,
            value: this.map[key],
        }));
    }

    clone() {
        const newMap = new OrderedMap();
        newMap.order = [...this.order];
        newMap.map = { ...this.map };
        return newMap;
    }

    remove(key) {
        const index = this.order.indexOf(key);
        if (index > -1) {
            this.order.splice(index, 1);
            delete this.map[key];
        }
    }
}

function generateUniqueId() {
    // Generate a random number and append it to the current timestamp
    const randomPart = Math.random().toString(36).substr(2, 9); // Random alphanumeric string
    const timestampPart = new Date().getTime().toString(36); // Current timestamp in base36
    return `${timestampPart}-${randomPart}`;
}

function NoteContainer() {
    const [notes, setNotes] = useState(new OrderedMap());

    function saveNotes(data) {
        localStorage.setItem("notes", data.serialize());
    }

    function loadNotes() {
        const data = localStorage.getItem("notes");
        if (data == null) return;
        const newNotes = new OrderedMap();
        newNotes.deserialize(data);
        setNotes(newNotes);
    }

    function removeNote(id) {
        const newNotes = notes.clone();
        newNotes.remove(id);
        setNotes(newNotes);

        saveNotes(newNotes);
    }

    function saveNote(id, title, content) {
        console.log(`Saving Note ${id} (${title})`);

        const newNotes = notes.clone();
        newNotes.set(id, { title, content });
        setNotes(newNotes);
        saveNotes(newNotes);
    }

    function addNote(title, content) {
        const id = generateUniqueId();
        console.log(`Adding Note ${id} (${title})`);

        saveNote(id, title, content);
    }

    useEffect(() => {
        loadNotes();
    }, []);

    function createNotes() {
        const notesJSX = [];
        const notesArray = notes.all();
        for (let i = 0; i < notesArray.length; i++) {
            const current = notesArray[i];
            const key = current.key;
            const value = current.value;
            const note = (
                <Note
                    key={key}
                    id={key}
                    ogTitle={value.title}
                    ogContent={value.content}
                    onSaveCB={saveNote}
                    onDeleteCB={removeNote}
                />
            );
            notesJSX.push(note);
        }
        return notesJSX;
    }

    return (
        <div className={styles.noteContainer}>
            {createNotes()}
            <AddNote onAddNote={addNote} />
        </div>
    );
}

export default NoteContainer;
