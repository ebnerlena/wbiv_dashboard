import { parse } from 'papaparse'
import { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import './HeatMap.css'

type HeatMapProps = {
  id: string
  year: number
}

export type DataMapping = {
  x: number[]
  y: number[]
}

var dataStart = [
  {
    z: [
      [1, null, 30, 50, 1],
      [20, 1, 60, 80, 30],
      [30, 60, 1, -10, 20],
    ],
    x: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    y: ['Morning', 'Midday', 'Afternoon', 'Evening'],
    type: 'heatmap',
    hoverongaps: false,
  },
]

const HeatMap: React.FC<HeatMapProps> = ({ id, year }) => {
  const [data, setData] = useState<any | null>(null)
  const [dataMapping, setDataMapping] = useState<any | null>(null)
  const [ZData, setZData] = useState<number[][] | null>(null)
  const [XData, setXData] = useState<string[] | null>(null)

  useEffect(() => {
    parseData()
  }, [])

  const parseData = () => {
    parse('data/ninja_weather_country_at.csv', {
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

    const zData: number[][] = [[], [], [], []]
    let xData: string[] = []
    let i: number = 0

    data.slice(3).forEach((entry: any) => {
      const curDate = new Date(entry[0])
      const curYear = curDate.getFullYear()

      if (curYear == myYear) {
        if (i == 7) {
          zData[0].push(entry[2])
        } else if (i == 11) {
          zData[1].push(entry[2])
        } else if (i == 15) {
          zData[2].push(entry[2])
        } else if (i == 19) {
          zData[3].push(entry[2])
        } else if (i == 23) {
          i = 0
          xData.push(entry[0])
        }

        i++
      }
    })

    const newDate = dataStart
    newDate[0].z = zData
    newDate[0].x = xData

    setDataMapping(newDate)
    setZData(zData)
    setXData(xData)
  }

  return (
    <div className="heatmap">
      {dataMapping && (
        <Plot
          divId={`heatmap-${id}`}
          className="heatmap__plot"
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          data={dataMapping}
          onHover={(e: any) => {
            // selectYear(e.points[0].x)
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
              text: `Daily Temperature in °C ${year}`,
            },
            margin: {
              l: 80,
              r: 80,
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

export default HeatMap
