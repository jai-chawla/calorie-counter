import { useState } from 'react'
import CalorieCounter from './components/CalorieCounter'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <CalorieCounter/>
    </>
  )
}

export default App
