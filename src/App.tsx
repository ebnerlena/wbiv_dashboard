import { useState } from 'react'
import './App.css'
import BoxPlot from './components/BoxPlot/BoxPlot'
import Header from './components/Header/Header'
import LineChart from './components/LineChart/LineChart'

function App() {
  const [year, setYear] = useState<number>(2019)

  return (
    <div className="App">
      <Header />
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
      <footer className="footer">
        <div>Lena Ebner - WBIV Dashboard WS 2022</div>
        <div>
          Data:
          <a href="https://renewables.ninja"> https://renewables.ninja</a>
        </div>
      </footer>
    </div>
  )
}

export default App
