import { parse } from 'papaparse'
import { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'

type LineChartProps = {
  id: string
  year: number
}

type DataMapping = {
  x: number[]
  y: number[]
}

const LineChart: React.FC<LineChartProps> = ({ id, year }) => {
  // line chart from 1980 to 2019

  const [data, setData] = useState<DataMapping | null>(null)
  const [yearData, setYearData] = useState<DataMapping | null>(null)

  useEffect(() => {
    parse('data/ninja_pv_country_at.csv', {
      header: false,
      download: true,
      dynamicTyping: true,
      complete: ({ data, errors }) => {
        if (errors.length > 0) {
          console.log('Error parsing pv csv data: ', errors)
          return
        }

        const xDataAll: number[] = []
        const yDataAll: number[] = []

        const xDataDaily: number[] = []
        const yDataDaily: number[] = []

        const myYear = year

        let i = 0
        let j = 0
        let medianXDaily: number[] = []
        let xDailyForYear: number[] = []
        let yDailyForYear: number[] = []
        let dailyAvg: number = 0

        data.slice(3).forEach((entry: any) => {
          const curDate = new Date(entry[0])
          const curYear = curDate.getFullYear()
          xDataAll.push(entry[0])
          yDataAll.push(entry[1])

          if (curYear == myYear) {
            medianXDaily.push(entry[1])
            dailyAvg += entry[1]
            // yDailyForYear.push(entry[1])
            // xDailyForYear.push(entry[0])

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

        const dataMapping = {
          x: xDailyForYear,
          y: yDailyForYear,
        } as DataMapping

        setData(dataMapping)
      },
    })
  }, [])

  return (
    <div className="linechart">
      {data && (
        <Plot
          divId={`linechart-${id}`}
          className="linechart__plot"
          useResizeHandler={true}
          style={{ width: '45%', height: '100%' }}
          data={[
            {
              x: data.x,
              y: data.y,
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'black' },
            },
          ]}
          config={{
            showLink: false,
            showSendToCloud: false,
            showEditInChartStudio: false,
            showSources: false,
            responsive: true,
            scrollZoom: true,
          }}
          layout={{
            title: 'Yearly AVG PV Production Capacity',
            font: { size: 10 },
            autosize: true,
            height: 400,
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
