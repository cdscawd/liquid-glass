import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DemoShowcase } from './demo/DemoShowcase'
import { Test } from './pages/Test'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DemoShowcase />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
