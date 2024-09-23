import { useState } from 'react'
//import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <head>
        <title>Malarcays Demo</title>
      </head>
      <body>
        <h1>Hello, world!</h1>
      </body>
    </>
  )
}

export default App
