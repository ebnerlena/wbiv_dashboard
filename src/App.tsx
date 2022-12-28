import { useEffect, useState } from 'react'
import './App.css'
import BoxPlot from './components/BoxPlot/BoxPlot'
import Header from './components/Header/Header'
import LineChart from './components/LineChart/LineChart'
import { Weather } from './types/Weather'

const API_KEY =
  import.meta.env.VITE_OPENWEATHER_API_KEY || '9337bb0ef5347927bc31739ce233ba4f'
const lat = 47.7268482486096
const lon = 13.086117279053683

function App() {
  const [year, setYear] = useState<number>(2019)
  const [weather, setWeather] = useState<Weather | null>()

  console.log(API_KEY)

  useEffect(() => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        console.log(data)
        const weatherData = {
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          temperature: data.main.temp,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          wind: data.wind.speed,
        } as Weather

        setWeather(weatherData)
      })
  }, [])

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
