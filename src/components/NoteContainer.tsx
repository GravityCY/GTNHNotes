import { useEffect, useRef, useState } from "react";
import { OrderedMap } from "../utils";

import AddNote from "./AddNote";
import Note from "./Note";

import styles from "./NoteContainer.module.scss";

import { DEBUG, generateUniqueId } from "../utils";
import React from "react";

export interface Props {
    saveNote: (id: string, title: string, content: string) => void
    removeNote: (id: string) => void
    doMove: () => void
    setPickup: (id: string|null) => void
    setHover: (id: string|null) => void
    hasPickup: () => boolean
    hasHover: () => boolean
};

function NoteContainer() {
    const [notes, setNotes]: [OrderedMap, (v: OrderedMap) => void] = useState(new OrderedMap());

    const pickupRef: React.MutableRefObject<string|null> = useRef(null);
    const hoverRef: React.MutableRefObject<string|null> = useRef(null);

    function saveNotes(data: OrderedMap) {
        localStorage.setItem("notes", data.serialize());
    }

    function moveNote(id: string, to: number) {
        const newNotes = notes.clone();
        newNotes.move(id, to);
        setNotes(newNotes);
        saveNotes(newNotes);
    }

    function moveNoteTo(id: string, to: string) {
        const newNotes = notes.clone();
        newNotes.moveTo(id, to);
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

    function removeNote(id: string) {
        const newNotes = notes.clone();
        newNotes.remove(id);
        setNotes(newNotes);

        saveNotes(newNotes);
    }

    function saveNote(id: string, title: string, content: string) {
        DEBUG(`Saving Note ${id} (${title})`);

        const newNotes = notes.clone();
        newNotes.set(id, { title, content });
        setNotes(newNotes);
        saveNotes(newNotes);
    }

    function addNote(title: string, content: string) {
        const id = generateUniqueId();
        DEBUG(`Adding Note ${id} (${title})`);

        saveNote(id, title, content);
    }

    useEffect(() => {
        loadNotes();
    }, []);

    const props: Props = {
        saveNote,
        removeNote,
        doMove() {
            if (pickupRef.current === null) return;
            
            if (hoverRef.current === null) {
                pickupRef.current = null;
                return;
            }
            console.log(`Moving note from ${pickupRef.current} to ${hoverRef.current}`);
            moveNoteTo(pickupRef.current, hoverRef.current);
            pickupRef.current = null;
            hoverRef.current = null;
        },
        setPickup(v: string | null) {
            pickupRef.current = v;
        },
        setHover(v: string | null) {
            console.log("Hovering over " + v);
            hoverRef.current = v;
        },
        hasPickup: function (): boolean {
            return pickupRef.current !== null;
        },
        hasHover: function (): boolean {
            return hoverRef.current !== null;
        }
    };

    function createNotes() {
        const notesJSX: any[] = [];
        const notesArray = notes.all();
        for (let i = 0; i < notesArray.length; i++) {
            const current = notesArray[i];
            const key = current.key;
            const value = current.value;
            let note: any = (
                <Note
                    key={key}
                    id={key}
                    ogTitle={value.title}
                    ogContent={value.content}
                    container={props}
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
