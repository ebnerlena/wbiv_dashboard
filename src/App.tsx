import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="header">
        <h1 className="header__title">Solar Engery</h1>
      </header>
      <main className="content">
        <div>
          <button onClick={() => setCount(count => count + 1)}>
            count is {count}
          </button>
        </div>
      </main>
      <footer className="footer">Lena Ebner - WBIV Dashboard WS 2022</footer>
    </div>
  )
}

export default App
