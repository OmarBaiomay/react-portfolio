import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'owl.carousel/dist/assets/owl.carousel.css'; {/* this line */}
import 'owl.carousel/dist/assets/owl.theme.default.css'; {/* this line */}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
