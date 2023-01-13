import { PlotRelayoutEvent } from 'plotly.js'
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import { Range } from '../../types/Range'
import './HeatMap.css'

type HeatMapProps = {
  id: string
  year: number
  data: any
  selection: Range | null
  updateSelection: (range: Range) => void
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
    colorscale: 'RdBu',
    hoverongaps: false,
    hovertemplate:
      ' Daytime: %{y}<br>' +
      ' Date: %{x} <br><br>' +
      ' Temperature: %{z} ' +
      '<extra></extra>',
  },
]

const HeatMap: React.FC<HeatMapProps> = ({
  id,
  year,
  data,
  selection,
  updateSelection,
}) => {
  const [dataMapping, setDataMapping] = useState<any | null>(null)
  const [range, setRange] = useState<Range | null>(selection)

  useEffect(() => {
    if (data && data != undefined) updateYearData(data)
  }, [data])

  useEffect(() => {
    if (data && data != undefined) updateYearData(data)
  }, [year])

  useEffect(() => {
    setRange(selection)
  }, [selection])

  const updateYearData = (data: any) => {
    const myYear = year

    const zData: number[][] = [[], [], [], []]
    let xData: string[] = []
    let i: number = 0

    data.forEach((entry: any) => {
      const curDate = new Date(entry[0])
      const curYear = curDate.getFullYear()

      if (curYear == myYear) {
        i++
        if (i == 8) {
          zData[0].push(entry[2])
        } else if (i == 11) {
          zData[1].push(entry[2])
        } else if (i == 15) {
          zData[2].push(entry[2])
        } else if (i == 19) {
          zData[3].push(entry[2])
        } else if (i == 24) {
          i = 0
          xData.push(entry[0])
        }
      }
    })

    const newData = dataStart
    newData[0].z = zData
    newData[0].x = xData

    setDataMapping(newData)
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
    <div className="heatmap">
      {dataMapping && (
        <Plot
          divId={`heatmap-${id}`}
          className="heatmap__plot"
          useResizeHandler={true}
          // style={{ width: '100%', height: '100%' }}
          data={dataMapping}
          onRelayout={(e: PlotRelayoutEvent) => {
            if (e['dragmode']) return
            updateRange(
              e['xaxis.range[0]'],
              e['xaxis.range[1]'],
              e['yaxis.range[0]'],
              e['yaxis.range[1]']
            )
          }}
          config={{
            showLink: false,
            showSendToCloud: false,
            showEditInChartStudio: false,
            showSources: false,
            responsive: true,
            displayModeBar: true,
            editable: false,
            scrollZoom: true,
            modeBarButtonsToRemove: ['toImage', 'lasso2d', 'resetScale2d'],
            displaylogo: false,
          }}
          layout={{
            title: {
              text: `Daily Temperature in °C: ${year}`,
            },
            margin: {
              l: 80,
              r: 80,
              b: 30,
              t: 60,
            },
            yaxis: {
              range: range ? [range.yAxisFrom, range.yAxisTo] : undefined,
            },
            xaxis: {
              range: range ? [range.xAxisFrom, range.xAxisTo] : undefined,
            },
            showlegend: false,
            font: { size: 9 },
            autosize: true,
            // height: 320,
          }}
        />
      )}
    </div>
  )
}

export default HeatMap
