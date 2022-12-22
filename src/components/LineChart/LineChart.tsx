import { useState } from 'react'
import Plot from 'react-plotly.js'

const LineChart = () => {
  // line chart fro m1990 to 2019

  const [data, setData] = useState(null)

  return (
    <div className="linechart">
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
          },
          { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
        ]}
        config={{
          showLink: false,
          showSendToCloud: false,
          showEditInChartStudio: false,
          showSources: false,
        }}
        layout={{ width: 320, height: 240, title: 'A Fancy Plot' }}
      />
    </div>
  )
}

export default LineChart
