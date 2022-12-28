import { useState } from 'react'
import './App.css'
import BoxPlot from './components/BoxPlot/BoxPlot'
import LineChart from './components/LineChart/LineChart'

function App() {
  const [year, setYear] = useState<number>(2017)
  console.log('Selected year: ', year)

  return (
    <div className="App">
      <header className="header">
        <h1 className="header__title">Solar Engery</h1>
      </header>
      <main className="content">
        <div className="content__top">
          <LineChart id="pv-daily" year={year} />
        </div>
        <div className="content__bottom">
          {/* <BarChart id="pv-yearly" /> */}
          <BoxPlot
            id="pv-yearly"
            selectYear={(year: number) => setYear(year)}
          />
        </div>
      </main>
      {/* <footer className="footer">Lena Ebner - WBIV Dashboard WS 2022</footer> */}
    </div>
  )
}

export default App
