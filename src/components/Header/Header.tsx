import { useEffect, useState } from 'react'
import { END_YEAR, START_YEAR, YEAR_OFFSET } from '../../constants'
import { Weather } from '../../types/Weather'
import './Header.css'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const lat = 47.7268482486096
const lon = 13.086117279053683

function Header() {
  const [weather, setWeather] = useState<Weather | null>()

  useEffect(() => {
    if (API_KEY == undefined) return
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
            {`PV Energy Production`}{' '}
            <span title="The solar capacity factor is the ratio of the actual power produced by a solar system in a particular period of time to the maximum possible power that can be produced by the system. As it is a ratio of the same quantities, it is unitless and expressed in percentages. The typical values of the solar capacity factor are between 10% and 25%. For the solar utility power plant, solar capacity is around 24.5%. The solar capacity factor of a particular system tells how often the system is running. The higher the value of the capacity factor, the better the performance of the system. The ideal value is 100% for any system. But in the real world, the solar capacity factor never exceeds 40%.">
              Capacity
            </span>
            {` in Austria ${START_YEAR + YEAR_OFFSET} - ${END_YEAR}`}
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
