import { BrowserRouter } from 'react-router-dom'
import AppRoute from './routes/AppRoute'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoute/>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App

