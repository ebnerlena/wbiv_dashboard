import { parse } from 'papaparse'
import { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'

type BoxPlotProps = {
  id: string
  selectYear: (year: number) => void
}

export type DataMapping = {
  x: number[]
  y: number[]
}

const BoxPlot: React.FC<BoxPlotProps> = ({ id, selectYear }) => {
  // bar chart from 1990 to 2019

  const [data, setData] = useState<any | null>(null)

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
              marker: { color: '#ffc632' },
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
          onHover={(e: any) => {
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
          }}
          layout={{
            title: {
              text: 'Yearly PV Production w/ 0',
            },
            margin: {
              l: 50,
              r: 50,
              b: 30,
              t: 50,
            },
            // paper_bgcolor: 'rgb(243, 243, 243)',
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
