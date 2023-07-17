import { useState } from 'react'
import logo from './assets/logo.svg'

/*
  Commit the changes to GitHub
*/

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='dark'>
      <div className='text-primary'>
        Hello world!
      </div>
      <img src={logo} height={100} width={100} />
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="bg-red-500 text-white font-bold">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
