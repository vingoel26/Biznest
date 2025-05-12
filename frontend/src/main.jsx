import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import "./index.css"
import { ThemeProvider } from "./context/ThemeContext.jsx"
import { ListingsProvider } from "./context/ListingsContext.jsx"
import { ReviewsProvider } from "./context/ReviewsContext.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ListingsProvider>
          <ReviewsProvider>
            <App />
          </ReviewsProvider>
        </ListingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
