import { OrderedMap } from "../utils";

import AddNote from "./AddNote";
import Note from "./Note";

import styles from "./NoteContainer.module.scss";

import { DEBUG, generateUniqueId } from "../utils";
import React from "react";
import * as NoteProvider from "../NoteProvider";

export interface Props {
    saveNote: (id: string, title: string, content: string) => void;
    removeNote: (id: string) => void;
    doMove: () => void;
    setPickup: (id: string | null) => void;
    setHover: (id: string | null) => void;
    hasPickup: () => boolean;
    hasHover: () => boolean;
}

function NoteContainer() {
    const noteContext = NoteProvider.useNotes();

    const pickupRef: React.MutableRefObject<string | null> = React.useRef(null);
    const hoverRef: React.MutableRefObject<string | null> = React.useRef(null);

    function saveNotes(data: OrderedMap) {
        localStorage.setItem("notes", data.serialize());
    }

    function moveNote(id: string, to: number) {
        const newNotes = noteContext.notes.clone();
        newNotes.move(id, to);
        noteContext.setNotes(newNotes);
        saveNotes(newNotes);
    }

    function moveNoteTo(id: string, to: string) {
        const newNotes = noteContext.notes.clone();
        newNotes.moveTo(id, to);
        noteContext.setNotes(newNotes);
        saveNotes(newNotes);
    }

    function removeNote(id: string) {
        const newNotes = noteContext.notes.clone();
        newNotes.remove(id);
        noteContext.setNotes(newNotes);

        saveNotes(newNotes);
    }

    function saveNote(id: string, title: string, content: string) {
        DEBUG("NoteContainer#saveNote", `Saving Note ${id} (${title})`);

        const newNotes = noteContext.notes.clone();
        newNotes.set(id, { title, content });
        noteContext.setNotes(newNotes);
        saveNotes(newNotes);
    }

    function addNote(title: string, content: string) {
        const id = generateUniqueId();
        DEBUG("NoteContainer#addNote", `Adding Note ${id} (${title})`);

        saveNote(id, title, content);
    }

    const props: Props = {
        saveNote,
        removeNote,
        doMove() {
            if (pickupRef.current === null) return;

            if (hoverRef.current === null) {
                pickupRef.current = null;
                return;
            }
            DEBUG(
                "NoteContainer#doMove",
                `Moving note from ${pickupRef.current} to ${hoverRef.current}`
            );
            moveNoteTo(pickupRef.current, hoverRef.current);
            pickupRef.current = null;
            hoverRef.current = null;
        },
        setPickup(v: string | null) {
            pickupRef.current = v;
        },
        setHover(v: string | null) {
            DEBUG("NoteContainer#setHover", "Hovering over " + v);
            hoverRef.current = v;
        },
        hasPickup: function (): boolean {
            return pickupRef.current !== null;
        },
        hasHover: function (): boolean {
            return hoverRef.current !== null;
        },
    };

    function createNotes() {
        const notesJSX: any[] = [];
        const notesArray = noteContext.notes.all();
        for (let i = 0; i < notesArray.length; i++) {
            const current = notesArray[i];
            const key = current.key;
            const value = current.value;
            let note: React.JSX.Element = (
                <Note
                    key={key}
                    id={key}
                    ogTitle={value.title}
                    ogContent={value.content}
                    container={props}
                />
            );
            DEBUG("NoteContainer", note.key);
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
