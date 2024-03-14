import React from "react";
import Header from "../components/Header";
import { NoteProvider } from "../NoteProvider";
import NoteContainer from "../components/NoteContainer";
import Calculator from "../components/Calculator";

function NotesPage() {
    return (
        <>
            <Header page="notes" />
            <NoteProvider>
                <NoteContainer />
            </NoteProvider>
            <Calculator />
        </>
    );
}

export default NotesPage;
