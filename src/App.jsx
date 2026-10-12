import { BrowserRouter } from 'react-router-dom';
import AppRoute from './routes/AppRoute';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { CategoryProvider } from './context/CategoryContext';
import NavigationLoader from './components/NavigationLoader';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CategoryProvider>
          <CartProvider>
            <NavigationLoader />
            <AppRoute/>
          </CartProvider>
        </CategoryProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
