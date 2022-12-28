import { parse } from 'papaparse'
import { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'

type BarChartProps = {
  id: string
}

export type DataMapping = {
  x: number[]
  y: number[]
}

const BarChart: React.FC<BarChartProps> = ({ id }) => {
  // bar chart from 1990 to 2019

  const [data, setData] = useState<DataMapping | null>(null)

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

        let xDataAll: number[] = []

        let lastYear = 0
        let yearlyData: number[] = []
        const years: number[] = []

        data.slice(3).forEach((entry: any, i: number) => {
          xDataAll.push(entry[1])

          const curDate = new Date(entry[0])
          const curYear = curDate.getFullYear()

          if (curYear > lastYear) {
            years.push(curYear) // save all years in array for y data
            lastYear = curYear

            if (years.length == 1) return

            yearlyData.push(Math.max(...xDataAll))
            xDataAll = []
          } else if (lastYear == 2019) {
            lastYear = 2020
          }
        })

        const dataMapping = {
          x: years,
          y: yearlyData,
        } as DataMapping

        setData(dataMapping)
      },
    })
  }, [])

  return (
    <div className="barchart">
      {data && (
        <Plot
          divId={`barchart-${id}`}
          className="barchart__plot"
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          data={[
            {
              x: data.x,
              y: data.y,
              type: 'bar',
              marker: { color: 'blue' },
            },
          ]}
          config={{
            showLink: false,
            showSendToCloud: false,
            showEditInChartStudio: false,
            showSources: false,
            responsive: true,
            displayModeBar: false,
          }}
          layout={{
            title: {
              text: 'Yearly Max PV Production in AT from 1980 - 2019',
            },

            font: { size: 10 },
            autosize: true,
            height: 350,
          }}
        />
      )}
    </div>
  )
}

export default BarChart
