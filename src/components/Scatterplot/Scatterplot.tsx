import { parse } from 'papaparse'
import { ScatterData } from 'plotly.js'
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import './Scatterplot.css'

type ScatterplotProps = {
  id: string
  year: number
}

const Scatterplot: React.FC<ScatterplotProps> = ({ id, year }) => {
  const [dataMapping, setDataMapping] = useState<ScatterData[]>([])
  const [data, setData] = useState<any>()
  const [tempData, setTempData] = useState<any>()
  const [yData, setYData] = useState<number[] | null>(null)
  const [yTempData, setYTempData] = useState<number[] | null>(null)

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

    parse('data/ninja_weather_country_at.csv', {
      header: false,
      download: true,
      dynamicTyping: true,
      complete: ({ data, errors }) => {
        if (errors.length > 0) {
          console.log('Error parsing pv csv data: ', errors)
          return
        }
        setTempData(data.slice(3))
        updateYearTempData(data)
      },
    })
  }

  useEffect(() => {
    if (data && data != undefined && tempData && tempData != undefined) {
      updateYearData(data)
      updateYearTempData(tempData)
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

    let dailyAvg: number = 0

    data.forEach((entry: any) => {
      const curDate = new Date(entry[0])
      const curYear = curDate.getFullYear()

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

    setYData(yDailyAvgForYear)
  }

  const updateYearTempData = (data: any) => {
    const myYear = year

    let i: number = 0
    let dailyAvg: number = 0
    let xDaily: number[] = []
    let yDaily: number[] = []
    let xDailyForYear: number[] = []
    let yDailyForYear: number[] = []

    data.forEach((entry: any) => {
      const curDate = new Date(entry[0])
      const curYear = curDate.getFullYear()

      if (curYear == myYear) {
        i++
        yDaily.push(entry[2])
        xDaily.push(entry[0])
        dailyAvg += entry[2]

        if (i == 24) {
          xDailyForYear.push(entry[0])
          yDailyForYear.push(dailyAvg / 24)

          i = 0
          xDaily = []
          yDaily = []
          dailyAvg = 0
        }
      }
    })

    setYTempData(yDailyForYear)
  }

  useEffect(() => {
    if (!yTempData || !yData) return

    const dataMappingYear = {
      x: yData,
      y: yTempData,
      type: 'scatter',
      mode: 'markers',
      marker: {
        color: yTempData,
        colorscale: 'RdBu',
        size: 5,
      },
      name: 'Temp',
      hovertemplate:
        ' Capacity: %{x} <br>' + ' Temperature: %{y} ' + '<extra></extra>',
    } as ScatterData

    setDataMapping([dataMappingYear])
  }, [yTempData])

  return (
    <div className="scatterplot">
      {dataMapping.length > 0 && (
        <Plot
          divId={`scatterplot-${id}`}
          className="scatterplot__plot"
          useResizeHandler={true}
          // style={{ width: '100%', height: '100%' }}
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
            title: `Daily PV Production Capacity and Temperature: ${year}`,
            font: { size: 9 },
            autosize: true,
            // height: 150,
            yaxis: {
              title: 'Avg Temperature',
              zeroline: false,
            },
            // xaxis: {
            //   title: 'Capacity 0-1',
            //   zeroline: false,
            // },
            margin: {
              l: 60,
              r: 30,
              b: 30,
              t: 50,
            },
          }}
        />
      )}
    </div>
  )
}

export default Scatterplot
