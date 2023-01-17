import { PlotRelayoutEvent, ScatterData } from 'plotly.js'
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import { Range } from '../../types/Range'
import './Scatterplot.css'

type ScatterplotProps = {
  id: string
  year: number
  capacityData: any
  tempData: any
  selection: Range | null
  updateSelection: (range: Range) => void
}

const dataMappingDefault = {
  x: [0],
  y: [0],
  type: 'scatter',
  mode: 'markers',
  marker: {
    colorscale: 'RdBu',
    color: [0],
    size: 5,
  },
  showlegend: false,
  hovertemplate:
    ' Capacity: %{x}% <br>' + ' Temperature: %{y:.1f}°C ' + '<extra></extra>',
} as ScatterData

const Scatterplot: React.FC<ScatterplotProps> = ({
  id,
  year,
  selection,
  capacityData,
  tempData,
}) => {
  const [dataMapping, setDataMapping] = useState<ScatterData[]>([])
  const [xData, setXData] = useState<number[] | null>(null)
  const [xDataMax, setXDataMax] = useState<number[] | null>(null)
  const [zData, setZData] = useState<number[] | null>(null)
  const [yTempData, setYTempData] = useState<number[] | null>(null)
  const [range, setRange] = useState<Range | null>(selection)

  useEffect(() => {
    if (
      capacityData &&
      capacityData != undefined &&
      tempData &&
      tempData != undefined
    ) {
      updateYearData(capacityData)
      updateYearTempData(tempData)
      setRange(null)
    }
  }, [year])

  useEffect(() => {
    if (
      capacityData &&
      capacityData != undefined &&
      tempData &&
      tempData != undefined
    ) {
      updateYearData(capacityData)
      updateYearTempData(tempData)
    }
  }, [tempData, capacityData])

  useEffect(() => {
    if (!(selection != undefined && selection.xAxisFrom != undefined)) {
      updateData()
      return
    }

    const dataIndizesInSelection = findPointsInSelection(selection)

    if (!yTempData || !xData || !zData) return

    const notSelectedYData = yTempData.filter(
      (_, idx) => !dataIndizesInSelection.includes(idx)
    )

    const dataMappingYear = {
      ...dataMappingDefault,
      x: xData.filter((_, idx) => !dataIndizesInSelection.includes(idx)),
      y: notSelectedYData,
      marker: {
        color: 'grey',
        size: 5,
      },
    } as ScatterData

    const selectedYData = yTempData.filter((_, idx) =>
      dataIndizesInSelection.includes(idx)
    )

    const dataMappingYearSelected = {
      ...dataMappingDefault,
      x: xData.filter((_, idx) => dataIndizesInSelection.includes(idx)),
      y: selectedYData,
      marker: {
        color: selectedYData,
        colorscale: 'RdBu',
        size: 7,
      },
    } as ScatterData

    setDataMapping([dataMappingYear, dataMappingYearSelected])
  }, [selection])

  useEffect(() => {
    updateData()
  }, [yTempData])

  const updateData = () => {
    if (!yTempData || !xData) return
    const dataMappingYear = {
      ...dataMappingDefault,
      x: xData,
      y: yTempData,
      marker: {
        ...dataMappingDefault.marker,
        color: yTempData,
      },
    } as ScatterData

    setDataMapping([dataMappingYear])
  }

  const findPointsInSelection = (selection: Range) => {
    const dateSelectionFrom = new Date(selection.xAxisFrom || '')
    const dateSelectionTo = new Date(selection.xAxisTo || '')

    const dataIndizesInSelection: number[] = []
    zData?.forEach((data, idx) => {
      const date = new Date(data)

      if (date >= dateSelectionFrom && date <= dateSelectionTo)
        dataIndizesInSelection.push(idx)
    })

    return dataIndizesInSelection
  }

  const updateYearData = (data: any) => {
    const myYear = year

    let i = 0
    let xDaily: number[] = []
    let yDaily: number[] = []
    let xDailyForYear: number[] = []
    let xMaxDailyForYear: number[] = []
    let yDailyAvgForYear: number[] = []
    let xDailyMaxForYear: number[] = []
    let yDailyMedianForYear: number[] = []

    let dailyAvg: number = 0

    data.forEach((entry: any) => {
      const curDate = new Date(entry[0])
      const curYear = curDate.getFullYear()

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
          xDailyMaxForYear.push(yDaily[maxIndex] * 100)
          yDailyAvgForYear.push((dailyAvg / 24) * 100)
          yDailyMedianForYear.push(xDaily.sort()[Math.round(xDaily.length / 2)]) // use median to ignore 0 outliers

          i = 0
          xDaily = []
          yDaily = []
          dailyAvg = 0
        }
      }
    })

    setXData(xDailyMaxForYear)
    setZData(xMaxDailyForYear)
    setXDataMax(xDailyMaxForYear)
  }

  const updateYearTempData = (data: any) => {
    const myYear = year

    let i: number = 0
    let dailyAvg: number = 0
    let xDaily: number[] = []
    let yDaily: number[] = []
    let xDailyForYear: number[] = []
    let yDailyForYear: number[] = []

    data.forEach((entry: any) => {
      const curDate = new Date(entry[0])
      const curYear = curDate.getFullYear()

      if (curYear == myYear) {
        i++
        yDaily.push(entry[2])
        xDaily.push(entry[0])
        dailyAvg += entry[2]

        if (i == 24) {
          xDailyForYear.push(entry[0])
          yDailyForYear.push(dailyAvg / 24)

          i = 0
          xDaily = []
          yDaily = []
          dailyAvg = 0
        }
      }
    })

    setYTempData(yDailyForYear)
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
  }

  return (
    <div className="scatterplot">
      {dataMapping.length > 0 && (
        <Plot
          divId={`scatterplot-${id}`}
          className="scatterplot__plot"
          useResizeHandler={true}
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
            title: `Daily PV Production Capacity and Temperature: ${year}`,
            font: { size: 9 },
            autosize: true,
            yaxis: {
              title: 'Avg Temperature',
              zeroline: false,
              range: range ? [range.yAxisFrom, range.yAxisTo] : undefined,
            },
            xaxis: {
              range: range ? [range.xAxisFrom, range.xAxisTo] : undefined,
            },
            margin: {
              l: 60,
              r: 30,
              b: 30,
              t: 50,
            },
          }}
        />
      )}
    </div>
  )
}

export default Scatterplot
