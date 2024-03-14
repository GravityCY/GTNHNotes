import React from "react";
import { OrderedMap } from "./utils";

export interface NoteProps {
    notes: OrderedMap;
    setNotes: (v: OrderedMap) => void;
}

const NoteContext = React.createContext({} as NoteProps);
export function NoteProvider({ children }) {
    const [notes, setNotes]: [OrderedMap, (v: OrderedMap) => void] =
        React.useState(new OrderedMap());

    function loadNotes() {
        const data = localStorage.getItem("notes");
        if (data == null) return;
        const newNotes = new OrderedMap();
        newNotes.deserialize(data);
        setNotes(newNotes);
    }

    React.useEffect(() => {
        loadNotes();
    }, []);

    const props = {
        notes,
        setNotes,
    };

    return (
        <NoteContext.Provider value={props}>{children}</NoteContext.Provider>
    );
}

export default NoteContext;
