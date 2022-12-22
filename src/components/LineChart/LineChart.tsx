import { parse } from 'papaparse'
import { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'

const LineChart = () => {
  // line chart fro m1990 to 2019

  const [data, setData] = useState(null)

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

        // console.log(data)

        //setData(data3)
        const xData = []
        const yData = []

        data.slice(3).forEach((entry: any) => {
          xData.push(entry[0])
          yData.push(entry[1])
        })

        const dataMapping = {
          x: xData,
          y: yData,
        }
        console.log(dataMapping)
        setData(dataMapping)
      },
    })
  }, [])

  return (
    <div className="linechart">
      {data && (
        <Plot
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
          }}
          layout={{
            width: 1020,
            height: 440,
            title: 'PV Production from 1990 - 2019',
          }}
        />
      )}
    </div>
  )
}

export default LineChart
