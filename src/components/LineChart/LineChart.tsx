import { parse } from 'papaparse'
import { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import './LineChart.css'

type PVData = {
  x: number[]
  y: number[]
}

const LineChart = () => {
  // line chart from 1980 to 2019

  const [data, setData] = useState<PVData | null>(null)

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

        let i = 0
        let j = 0
        let medianXDaily: number[] = []
        let avgXDaily: number = 0

        data.slice(3).forEach((entry: any) => {
          medianXDaily.push(entry[1])
          avgXDaily += entry[1]
          xDataAll.push(entry[0])
          yDataAll.push(entry[1])

          if (i == 24) {
            xDataDaily.push(entry[0])
            // yDataDaily.push(avgXDaily / 24)
            yDataDaily.push(
              medianXDaily.sort()[Math.round(medianXDaily.length / 2)]
            ) // use median to ignore 0 outliers
            i = 0
            j++
            medianXDaily = []
            avgXDaily = 0
          }
          i++
        })

        const dataMapping = {
          x: xDataDaily,
          y: yDataDaily,
        } as PVData

        console.log(dataMapping)
        setData(dataMapping)
      },
    })
  }, [])

  return (
    <div className="linechart">
      {data && (
        <Plot
          className="linchart__plot"
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
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
          }}
          layout={{
            title: 'Daily PV Production in AT from 1980 - 2019',
            font: { size: 14 },
            autosize: true,
          }}
        />
      )}
    </div>
  )
}

export default LineChart
