import { useEffect, useState } from 'react'
import { Weather } from '../../types/Weather'
import './Header.css'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const lat = 47.7268482486096
const lon = 13.086117279053683

function Header() {
  const [weather, setWeather] = useState<Weather | null>()

  useEffect(() => {
    if (true || API_KEY == undefined) return
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

    fetch(url)
      .then(r => r.json())
      .then(data => {
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
    <header className="header">
      <div className="header__left">
        <img src="/solar-panels.png" className="header__icon" />
        <div className="header__text-wrapper">
          <h1 className="header__title">Solar Engery</h1>
          <p className="header__subtitle">
            PV Energy Production Capacity in Austria 1980 - 2019
          </p>
        </div>
      </div>
      <div className="header__right">
        {weather?.icon && (
          <img
            src={`https://openweathermap.org/img/w/${weather.icon}.png`}
            className="header__icon"
          />
        )}
        {weather && (
          <div>
            {weather.temperature}°C - {weather.main}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
