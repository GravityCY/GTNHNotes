import React from "react";
import Header from "../components/Header";
import { NoteProvider } from "../NoteProvider";
import NoteContainer from "../components/NoteContainer";
import Calculator from "../components/Calculator";

function NotesPage() {
    return (
        <>
            <NoteProvider>
                <Header />
                <NoteContainer />
            </NoteProvider>
            <Calculator />
        </>
    );
}

export default NotesPage;
