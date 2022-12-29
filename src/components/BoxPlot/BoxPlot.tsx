import { parse } from 'papaparse'
import { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import './BoxPlot.css'

type BoxPlotProps = {
  id: string
  year: number
  selectYear: (year: number) => void
}

export type DataMapping = {
  x: number[]
  y: number[]
}

const BoxPlot: React.FC<BoxPlotProps> = ({ id, selectYear, year }) => {
  const [data, setData] = useState<any[] | null>(null)

  useEffect(() => {
    if (!data) return

    const newData = data
    newData.map((entry: any, idx: number) => {
      if (Math.abs(1980 - year) - 1 == idx) {
        entry.marker.color = '#303030'
        return entry
      } else {
        entry.marker.color = '#ffc632'
        return entry
      }
    })
    setData(newData)
  }, [year])

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

        const traces: any[] = []
        let lastYear = 0
        const years: number[] = []
        let yData: number[] = []

        data.slice(3).forEach((entry: any, i: number) => {
          const curDate = new Date(entry[0])
          const curYear = curDate.getFullYear()
          let lastYData = []
          if (curYear > lastYear) {
            lastYData = yData
            yData = []
            yData.push(entry[1])

            years.push(curYear) // save all years in array for y data
            lastYear = curYear

            if (years.length == 1) return

            var trace = {
              y: lastYData.filter(d => d != 0),
              x: curYear,
              name: curYear,
              marker: { color: year == curYear ? '#303030' : '#ffc632' },
              type: 'box',
            }

            traces.push(trace)
          } else if (lastYear == 2019) {
            lastYear = 2020
          } else {
            yData.push(entry[1])
          }
        })

        setData(traces)
      },
    })
  }, [])

  return (
    <div className="boxplot">
      {data && (
        <Plot
          divId={`boxplot-${id}`}
          className="boxplot__plot"
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          data={data}
          onClick={(e: any) => {
            selectYear(e.points[0].x)
          }}
          config={{
            showLink: false,
            showSendToCloud: false,
            showEditInChartStudio: false,
            showSources: false,
            responsive: true,
            displayModeBar: false,
            editable: false,
            scrollZoom: false,
          }}
          layout={{
            title: {
              text: 'Yearly PV Production Capacity w/ 0',
            },
            margin: {
              l: 30,
              r: 30,
              b: 30,
              t: 50,
            },
            showlegend: false,
            font: { size: 10 },
            autosize: true,
            height: 320,
          }}
        />
      )}
    </div>
  )
}

export default BoxPlot
