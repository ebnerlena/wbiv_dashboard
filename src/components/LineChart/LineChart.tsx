import { parse } from 'papaparse'
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import './LineChart.css'

type LineChartProps = {
  id: string
  year: number
}

type DataMapping = {
  date: Date
  x: number[]
  y: number[]
}

const LineChart: React.FC<LineChartProps> = ({ id, year }) => {
  const [dataMappingYear, setDataMappingYear] = useState<DataMapping | null>(
    null
  )
  const [dataMapping, setDataMapping] = useState<DataMapping | null>(null)
  const [data, setData] = useState<any>()

  useEffect(() => {
    parseData()
  }, [])

  const parseData = () => {
    parse('data/ninja_pv_country_at.csv', {
      header: false,
      download: true,
      dynamicTyping: true,
      complete: ({ data, errors }) => {
        if (errors.length > 0) {
          console.log('Error parsing pv csv data: ', errors)
          return
        }
        setData(data)
        updateYearData(data)
      },
    })
  }

  useEffect(() => {
    if (data && data != undefined) updateYearData(data)
  }, [year])

  const updateYearData = (data: any) => {
    const myYear = year

    let i = 0
    let j = 0
    let medianXDaily: number[] = []
    let xDailyForYear: number[] = []
    let yDailyForYear: number[] = []

    let xDaily: number[] = []
    let yDaily: number[] = []
    let dailyAvg: number = 0

    data.slice(3).forEach((entry: any) => {
      const curDate = new Date(entry[0])
      const curYear = curDate.getFullYear()
      xDaily.push(entry[0])
      yDaily.push(entry[1])

      if (curYear == myYear) {
        medianXDaily.push(entry[1])
        dailyAvg += entry[1]

        if (i == 23) {
          xDailyForYear.push(entry[0])
          //yDailyForYear.push(Math.max(...medianXDaily))
          yDailyForYear.push(dailyAvg / 24)
          // yDailyForYear.push(
          //   medianXDaily.sort()[Math.round(medianXDaily.length / 2)]
          // ) // use median to ignore 0 outliers
          i = 0
          j++
          medianXDaily = []
          dailyAvg = 0
        }
        i++
      }
    })

    const dataMappingYear = {
      x: xDailyForYear,
      y: yDailyForYear,
    } as DataMapping

    setDataMappingYear(dataMappingYear)

    if (!dataMapping) setDataMapping({ x: xDaily, y: yDaily } as DataMapping)
  }

  return (
    <div className="linechart">
      {dataMappingYear && (
        <Plot
          divId={`linechart-${id}`}
          className="linechart__plot"
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          onRelayout={e => console.log('onRelayout', e)}
          data={[
            {
              x: dataMappingYear.x,
              y: dataMappingYear.y,
              type: 'scatter',
              mode: 'lines',
              marker: { color: '#0377bc' },
            },
          ]}
          config={{
            showLink: false,
            showSendToCloud: false,
            showEditInChartStudio: false,
            showSources: false,
            responsive: true,
            scrollZoom: true,
            displaylogo: false,
            // displayModeBar: false,
            modeBarButtonsToRemove: ['toImage', 'lasso2d', 'resetScale2d'],
          }}
          layout={{
            title: `Average PV Production Capacity: ${year}`,
            font: { size: 10 },
            autosize: true,
            height: 350,
            yaxis: {
              title: 'avg capacity',
              zeroline: false,
            },
            margin: {
              l: 60,
              r: 30,
              b: 30,
              t: 80,
            },
          }}
        />
      )}
    </div>
  )
}

export default LineChart
