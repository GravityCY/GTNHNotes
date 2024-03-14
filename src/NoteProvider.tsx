import React from "react";
import { DEBUG, OrderedMap } from "./utils";

export interface NoteProps {
    notes: OrderedMap;
    setNotes: (v: OrderedMap) => void;
    loadNotes: () => void;
}

const NoteContext = React.createContext({} as NoteProps);

export function NoteProvider({ children }) {
    const [notes, setNotes]: [OrderedMap, (v: OrderedMap) => void] =
        React.useState(new OrderedMap());


    function loadNotes() {
        DEBUG("NoteProvider#loadNotes", "Loading Notes...");
        const data = localStorage.getItem("notes");
        if (data === null) return;
        const newNotes = new OrderedMap();
        newNotes.deserialize(data);
        setNotes(newNotes);
    }

    React.useEffect(() => {
        DEBUG("NoteProvider#useEffect", "Loading Notes for the first time...");
        loadNotes();
    }, []);

    const ctx: NoteProps = {
        notes,
        setNotes,
        loadNotes
    };

    return (
        <NoteContext.Provider value={ctx}>{children}</NoteContext.Provider>
    );
}

export const useNotes = () => React.useContext(NoteContext);