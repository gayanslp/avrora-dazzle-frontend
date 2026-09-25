import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoute from './routes/AppRoute'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <AppRoute/>
    </BrowserRouter>
  )
}

export default App
