
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { PlanProvider } from './contexts/PlanContext.tsx'
import { CartProvider } from './contexts/CartContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlanProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </PlanProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
