import Calculator from "./Calculator";
import Header from "./Header";
import NoteContainer from "./NoteContainer";

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
