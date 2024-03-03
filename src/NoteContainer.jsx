import { useEffect, useState } from "react";
import AddNote from "./AddNote";
import Note from "./Note";
import styles from "./NoteContainer.module.scss";

import { DEBUG, generateUniqueId, traverse } from "./utils";

class OrderedMap {
    constructor() {
        this.order = [];
        this.map = {};
    }

    size() {
        return this.order.length;
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

    move(key, newIndex) {
        const prevIndex = this.order.indexOf(key);
        const high = newIndex > prevIndex;
        let temp = this.order[newIndex];
        this.order[newIndex] = key;
        for (let i = high ? newIndex - 1 : newIndex + 1; high ? i >= prevIndex : i <= prevIndex; high ? i-- : i++) {
            let prev = this.order[i];
            this.order[i] = temp;
            temp = prev;
        }
    }

    index(key) {
        return this.order.indexOf(key);
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


function NoteContainer() {
    const [notes, setNotes] = useState(new OrderedMap());

    function saveNotes(data) {
        localStorage.setItem("notes", data.serialize());
    }

    function moveNote(id, to) {
        const newNotes = notes.clone();
        newNotes.move(id, to);
        setNotes(newNotes);
        saveNotes(newNotes);
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
        DEBUG(`Saving Note ${id} (${title})`);

        const newNotes = notes.clone();
        newNotes.set(id, { title, content });
        setNotes(newNotes);
        saveNotes(newNotes);
    }

    function addNote(title, content) {
        const id = generateUniqueId();
        DEBUG(`Adding Note ${id} (${title})`);

        saveNote(id, title, content);
    }

    useEffect(() => {
        loadNotes();
    }, []);

    useEffect(() => {

        function onMouseMove(e) {
            window.clientX = e.clientX;
            window.clientY = e.clientY;
        }

        function onKeyDown(e) {
            if (e.keyCode !== 37 && e.keyCode !== 39) return;
            const element = document.elementFromPoint(window.clientX, window.clientY);
            if (element == null) return;
            const found = traverse(element, (element) => element && element.dataset.id);
            const id = found.dataset.id;
            const index = notes.index(id);
            DEBUG(`Index of ${id}: ${index}`);
            if (e.key === "ArrowLeft" && index !== 0) {
                DEBUG(`Moving Note ${id} to ${index - 1}`);
                moveNote(id, index - 1);
            } else if (e.key === "ArrowRight" && index !== notes.size() - 1) {
                DEBUG(`Moving Note ${id} to ${index + 1}`);
                moveNote(id, index + 1);
            }
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("mousemove", onMouseMove);
        }
    }, [notes])

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
                    onReorderCB={moveNote}
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
