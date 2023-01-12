import { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import './BoxPlot.css'

type BoxPlotProps = {
  id: string
  year: number
  data: any
  selectYear: (year: number) => void
}

export type DataMapping = {
  x: number[]
  y: number[]
}

const BoxPlot: React.FC<BoxPlotProps> = ({ id, selectYear, year, data }) => {
  const [dataMapping, setDataMapping] = useState<any[] | null>(null)

  const updateYear = (year: number) => {
    if (!dataMapping && dataMapping != undefined) return
    selectYear(year)

    const newData = dataMapping
    newData?.map((entry: any, idx: number) => {
      if (Math.abs(1980 - year) - 1 == idx) {
        entry.marker.color = '#0377bc' // '#303030'
        return entry
      } else {
        entry.marker.color = '#ffc632'
        return entry
      }
    })
    setDataMapping(newData)
  }

  useEffect(() => {
    if (data && data != undefined) {
      updateData()
    }
  }, [data])

  const updateData = () => {
    const traces: any[] = []
    let lastYear = 0
    const years: number[] = []
    let yData: number[] = []

    data.forEach((entry: any, i: number) => {
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
          marker: { color: year == curYear ? '#0377bc' : '#ffc632' },
          type: 'box',
        }

        traces.push(trace)
      } else if (lastYear == 2019) {
        lastYear = 2020
      } else {
        yData.push(entry[1])
      }
    })

    setDataMapping(traces)
  }

  return (
    <div className="boxplot">
      {dataMapping && (
        <Plot
          divId={`boxplot-${id}`}
          className="boxplot__plot"
          useResizeHandler={true}
          // style={{ width: '100%', height: '100%' }}
          data={dataMapping}
          onClick={(e: any) => {
            console.log('selectYear')
            updateYear(e.points[0].x)
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
            // height: 320,
          }}
        />
      )}
    </div>
  )
}

export default BoxPlot
