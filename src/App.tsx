import { parse } from 'papaparse'
import { useEffect, useState } from 'react'
import './App.css'
import BoxPlot from './components/BoxPlot/BoxPlot'
import Header from './components/Header/Header'
import HeatMap from './components/HeatMap/HeatMap'
import LineChart from './components/LineChart/LineChart'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'
import Scatterplot from './components/Scatterplot/Scatterplot'
import {
  HEADER_ROWS,
  START_YEAR,
  YEAR_DATA_ROWS,
  YEAR_OFFSET,
} from './constants'
import { Range } from './types/Range'

const App = () => {
  const [year, setYear] = useState<number>(START_YEAR)
  const [yearChartsSelection, setYearChartsSelection] = useState<Range | null>(
    null
  )
  const [capacityData, setCapacityData] = useState<any>()
  const [tempData, setTempData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    parseData()
  }, [])

  const parseData = () => {
    setLoading(true)
    parse('data/ninja_pv_country_at.csv', {
      header: false,
      download: true,
      dynamicTyping: true,
      complete: ({ data, errors }) => {
        if (errors.length > 0) {
          console.log('Error parsing pv csv data: ', errors)
          return
        }
        setCapacityData(data.slice(HEADER_ROWS + YEAR_OFFSET * YEAR_DATA_ROWS))
      },
    })

    parse('data/ninja_weather_country_at.csv', {
      header: false,
      download: true,
      dynamicTyping: true,
      complete: ({ data, errors }) => {
        if (errors.length > 0) {
          console.log('Error parsing pv csv data: ', errors)
          return
        }
        setTempData(data.slice(HEADER_ROWS + YEAR_OFFSET * YEAR_DATA_ROWS))
        setLoading(false)
      },
    })
  }

  return (
    <div className="App">
      <Header />
      {loading ? (
        <main className="content">
          <LoadingSpinner />
        </main>
      ) : (
        <main className="content">
          <div className="content__top">
            <LineChart
              id="pv-daily"
              year={year}
              data={capacityData}
              selection={yearChartsSelection}
              updateSelection={setYearChartsSelection}
            />
            {/* <Scatterplot id="pv-daily" year={year} /> */}
            <div className="content__top-right">
              <HeatMap
                id="pv-yearly"
                data={tempData}
                year={year}
                selection={yearChartsSelection}
                updateSelection={setYearChartsSelection}
              />
              <Scatterplot
                tempData={tempData}
                capacityData={capacityData}
                id="pv-daily"
                year={year}
                selection={yearChartsSelection}
                updateSelection={setYearChartsSelection}
              />
            </div>
          </div>
          <div className="content__bottom">
            {/* <BarChart id="pv-yearly" /> */}
            <BoxPlot
              data={capacityData}
              id="pv-yearly"
              selectYear={(year: number) => {
                setYear(year)
                setYearChartsSelection(null)
              }}
              year={year}
            />
          </div>
        </main>
      )}
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
