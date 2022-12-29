import { parse } from 'papaparse'
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import './LineChart.css'

type LineChartProps = {
  id: string
  year: number
}

type DataMapping = {
  x: number[]
  y: number[]
  type: string
  mode: string
  marker: { color: string }
  name: string
}

const LineChart: React.FC<LineChartProps> = ({ id, year }) => {
  const [dataMapping, setDataMapping] = useState<DataMapping[]>([])
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
        setData(data.slice(3))
        updateYearData(data)
      },
    })
  }

  useEffect(() => {
    if (data && data != undefined) {
      updateYearData(data)
    }
  }, [year])

  const updateYearData = (data: any) => {
    const myYear = year

    let i = 0
    let xDaily: number[] = []
    let yDaily: number[] = []
    let xDailyForYear: number[] = []
    let xMaxDailyForYear: number[] = []
    let yDailyAvgForYear: number[] = []
    let yDailyMaxForYear: number[] = []
    let yDailyMedianForYear: number[] = []

    let xAll: number[] = []

    let yAll: number[] = []
    let dailyAvg: number = 0

    data.forEach((entry: any, index: number) => {
      const curDate = new Date(entry[0])
      const curYear = curDate.getFullYear()
      xAll.push(entry[0])
      yAll.push(entry[1])

      if (curYear == myYear) {
        i++
        yDaily.push(entry[1])
        xDaily.push(entry[0])
        dailyAvg += entry[1]

        if (i == 24) {
          xDailyForYear.push(entry[0])
          const max = Math.max(...yDaily)
          const maxIndex = yDaily.findIndex(value => value == max)

          xMaxDailyForYear.push(xDaily[maxIndex])
          yDailyMaxForYear.push(yDaily[maxIndex])
          yDailyAvgForYear.push(dailyAvg / 24)
          yDailyMedianForYear.push(xDaily.sort()[Math.round(xDaily.length / 2)]) // use median to ignore 0 outliers

          i = 0
          xDaily = []
          yDaily = []
          dailyAvg = 0
        }
      }
    })

    const dataMappingAvgYear = {
      x: xDailyForYear,
      y: yDailyAvgForYear,
      type: 'scatter',
      mode: 'lines',
      marker: { color: '#303030' }, //'#ffc632'
      name: 'Avg',
    } as DataMapping

    // const dataMappingMaxYear = {
    //   x: xMaxDailyForYear,
    //   y: yDailyMaxForYear,
    //   type: 'scatter',
    //   mode: 'lines',
    //   marker: { color: '#505050' }, //#0377bc // 213547
    //   name: 'Max',
    // } as DataMapping

    setDataMapping([dataMappingAvgYear])
  }

  return (
    <div className="linechart">
      {dataMapping.length > 0 && (
        <Plot
          divId={`linechart-${id}`}
          className="linechart__plot"
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          onRelayout={e => console.log('onRelayout', e)}
          data={dataMapping as any}
          config={{
            showLink: false,
            showSendToCloud: false,
            showEditInChartStudio: false,
            showSources: false,
            responsive: true,
            scrollZoom: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['toImage', 'lasso2d', 'resetScale2d'],
          }}
          layout={{
            title: `Daily PV Production Capacity: ${year}`,
            font: { size: 9 },
            autosize: true,

            yaxis: {
              title: 'Capacity',
              zeroline: false,
            },
            margin: {
              l: 60,
              r: 30,
              b: 25,
              t: 60,
            },
          }}
        />
      )}
    </div>
  )
}

export default LineChart
