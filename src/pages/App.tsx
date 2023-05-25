
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './login'
import FeedPage from './feedPage'
import { Signup } from './signup'

function App() {
  console.log("here")
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<FeedPage />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
