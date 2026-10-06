import { BrowserRouter } from 'react-router-dom';
import AppRoute from './routes/AppRoute';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <AppRoute/>
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
