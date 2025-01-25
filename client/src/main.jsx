import React from "react";
import App from "./App";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create root once and store it
const root = ReactDOM.createRoot(document.getElementById("root"));

// Remove unnecessary fragment since we're only rendering one component
root.render(
    <>
        <App />
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    </>
);


// Use this to show toast messages
// toast.success('This is a success message!');
// toast.error('This is an error message!');
// toast.info('This is an informational message!');
// toast.warning('This is a warning message!');

