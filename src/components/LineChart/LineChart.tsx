import { parse } from 'papaparse'
import { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import './LineChart.css'

type LineChartProps = {
  id: string
  year: number
}

type DataMapping = {
  date: Date
  x: number[]
  y: number[]
}

const LineChart: React.FC<LineChartProps> = ({ id, year }) => {
  // line chart from 1980 to 2019

  const [dataMappingYear, setDataMappingYear] = useState<DataMapping | null>(
    null
  )
  const [dataMapping, setDataMapping] = useState<DataMapping | null>(null)
  const [data, setData] = useState<any>()

  const [range, setRange] = useState<any>([`${year}-01-01`, `${year}-12-31`])
  const [layout, setLayout] = useState<any>({
    title: `Average PV Production Capacity ${year}`,
    font: { size: 10 },
    autosize: true,
    height: 350,
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
    xaxis: {
      autorange: true,
      range: range,
      rangeselector: {
        buttons: [
          {
            count: 1,
            label: '1m',
            step: 'month',
            stepmode: 'backward',
          },
          {
            count: 1,
            label: '1y',
            step: 'year',
            stepmode: 'backward',
          },
          {
            count: 5,
            label: '5y',
            step: 'year',
            stepmode: 'backward',
          },
          {
            count: 10,
            label: '10y',
            step: 'year',
            stepmode: 'backward',
          },
          { step: 'all' },
        ],
      },
      rangeslider: { range: ['1980-01-01', '2019-12-31'] },
      type: 'date',
    },
  })

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

    let i = 0
    let j = 0
    let medianXDaily: number[] = []
    let xDailyForYear: number[] = []
    let yDailyForYear: number[] = []

    let xDaily: number[] = []
    let yDaily: number[] = []
    let dailyAvg: number = 0

    data.slice(3).forEach((entry: any) => {
      const curDate = new Date(entry[0])
      const curYear = curDate.getFullYear()
      xDaily.push(entry[0])
      yDaily.push(entry[1])

      if (curYear == myYear) {
        medianXDaily.push(entry[1])
        dailyAvg += entry[1]

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

    const dataMappingYear = {
      x: xDailyForYear,
      y: yDailyForYear,
    } as DataMapping

    setDataMappingYear(dataMappingYear)
    setRange([`${year}-01-01`, `${year}-12-31`])

    if (!dataMapping) setDataMapping({ x: xDaily, y: yDaily } as DataMapping)
  }

  useEffect(() => {
    const oldLayout = layout
    oldLayout.range = range

    setLayout(oldLayout)
  }, [range])

  return (
    <div className="linechart">
      {dataMapping && (
        <Plot
          divId={`linechart-${id}`}
          className="linechart__plot"
          useResizeHandler={true}
          style={{ width: '45%', height: '100%' }}
          data={[
            {
              x: dataMapping.x,
              y: dataMapping.y,
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
            displaylogo: false,
          }}
          layout={layout}
        />
      )}
    </div>
  )
}

export default LineChart
