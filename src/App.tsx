import React from "react";

import Calculator from "./components/Calculator";
import Header from "./components/Header";
import NoteContainer from "./components/NoteContainer";

import { setFocus } from "./Global";

document.addEventListener("mousedown", (e) => {
    setFocus(e.target);
});


function App() {
  return (
    <>
        <Header/>
        <NoteContainer />
        <Calculator />
    </>
  )
}

export default App
