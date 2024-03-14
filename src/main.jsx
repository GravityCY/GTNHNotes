import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

import './main.scss'

import { DEBUG } from './utils.tsx'
import { BrowserRouter} from 'react-router-dom'

setInterval(() => {
    const current = localStorage.getItem("notes");
    let backups = localStorage.getItem("backups");
    if (backups !== null) { 
        backups = JSON.parse(backups);
    } else { 
        backups = []; 
    }
    if (backups[backups.length - 1] === current) {
        DEBUG("main#setInterval", "Same");
        return;
    } else {
        DEBUG("main#setInterval", "new")
    }

    backups.push(current);
    if (backups.length > 10) {
        backups.shift();
    }
    localStorage.setItem("backups", JSON.stringify(backups));
}, 1000 * 10);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </React.StrictMode>,
)
