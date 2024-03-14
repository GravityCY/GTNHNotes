import React from "react";

import { setFocus } from "./Global";
import NotesPage from "./pages/NotesPage";
import TipsPage from "./pages/TipsPage";
import { Route, Routes } from "react-router-dom";

document.addEventListener("mousedown", (e) => {
    setFocus(e.target);
});

function App() {
    return (
        <>
            <Routes>
                <Route path="/GTNHNotes" element={<NotesPage />} />
                <Route path="/GTNHNotes/tips" element={<TipsPage />} />
            </Routes>
        </>
    );
}

export default App;
