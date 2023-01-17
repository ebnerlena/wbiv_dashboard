import { PlotData, PlotRelayoutEvent } from 'plotly.js'
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import { Range } from '../../types/Range'
import './LineChart.css'

type LineChartProps = {
  id: string
  year: number
  data: any
  selection: Range | null
  updateSelection: (range: Range) => void
}

const LineChart: React.FC<LineChartProps> = ({
  id,
  year,
  data,
  selection,
  updateSelection,
}) => {
  const [dataMapping, setDataMapping] = useState<PlotData[]>([])
  const [range, setRange] = useState<Range | null>(selection)

  useEffect(() => {
    if (data && data != undefined) {
      updateYearData(data)
    }
  }, [data])

  useEffect(() => {
    if (data && data != undefined) {
      updateYearData(data)
    }
  }, [year])

  useEffect(() => {
    // console.log('new selection', selection)
    setRange(selection)
  }, [selection])

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

    let xAll: number[] = []

    let yAll: number[] = []
    let dailyAvg: number = 0

    data.forEach((entry: any, index: number) => {
      const curDate = new Date(entry[0])
      const curYear = curDate.getFullYear()
      xAll.push(entry[0])
      yAll.push(entry[1])

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
          yDailyMaxForYear.push(yDaily[maxIndex] * 100)
          yDailyAvgForYear.push((dailyAvg / 24) * 100)
          yDailyMedianForYear.push(xDaily.sort()[Math.round(xDaily.length / 2)]) // use median to ignore 0 outliers

          i = 0
          xDaily = []
          yDaily = []
          dailyAvg = 0
        }
      }
    })

    const dataMappingAvgYear = {
      x: xDailyForYear,
      y: yDailyAvgForYear,
      type: 'scatter',
      mode: 'lines',
      marker: { color: '#0377bc' }, //'#ffc632'
      name: 'Avg',
    } as PlotData

    const dataMappingMaxYear = {
      x: xMaxDailyForYear,
      y: yDailyMaxForYear,
      type: 'scatter',
      mode: 'lines',
      marker: { color: '#505050' }, //#0377bc // 213547
      name: 'Max',
    } as PlotData

    setDataMapping([dataMappingMaxYear, dataMappingAvgYear])
  }

  const updateRange = (
    xFrom: number | undefined,
    xTo: number | undefined,
    yFrom: number | undefined,
    yTo: number | undefined
  ) => {
    const newRange = {
      xAxisFrom: xFrom,
      xAxisTo: xTo,
      yAxisFrom: yFrom,
      yAxisTo: yTo,
    } as Range

    setRange(newRange)
    updateSelection({
      xAxisFrom: xFrom,
      xAxisTo: xTo,
      yAxisFrom: undefined,
      yAxisTo: undefined,
    })
  }

  return (
    <div className="linechart">
      {dataMapping.length > 0 && (
        <Plot
          divId={`linechart-${id}`}
          className="linechart__plot"
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          onRelayout={(e: PlotRelayoutEvent) => {
            if (e['dragmode']) return
            updateRange(
              e['xaxis.range[0]'],
              e['xaxis.range[1]'],
              e['yaxis.range[0]'],
              e['yaxis.range[1]']
            )
          }}
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
            title: `Daily PV Production Capacity: ${year}`,
            font: { size: 9 },
            autosize: true,
            yaxis: {
              title: 'Capacity in %',
              zeroline: false,
              range: range ? [range.yAxisFrom, range.yAxisTo] : undefined,
            },
            xaxis: {
              range: range ? [range.xAxisFrom, range.xAxisTo] : undefined,
            },
            margin: {
              l: 60,
              r: 30,
              b: 25,
              t: 60,
            },
          }}
        />
      )}
    </div>
  )
}

export default LineChart
