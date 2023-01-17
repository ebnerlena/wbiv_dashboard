# WBIV Dashboard

## Get Started

- `yarn` → Install dependencies
- `yarn dev` → Start development server
- `yarn build` → Build for production in /build dir
- `yarn start:docker` → Build and run docker image

## Requirements:

- Dashboard auf einem Screen ohne Scrollen und Zoomen (Full Browser Screen ausfüllen)
- 3 unterschiedliche Visualisierungen z.b. Scatter, Barchart, ParallelCoordinaten, DonutChart, Heatmap
- Layout egal: 2 oben 1 größer unten
- Library egal
- Backend egal
- Interaction: innerhalb jedes Plots
  - höchste Stufe wäre zwischen den Plots (Brushing und Linking)
  - globaler Filter der alle Views updaten != brushing und linking

## Data

**Renewables Ninja**: https://renewables.ninja/

> Renewables.ninja allows you to run simulations of the hourly power output from wind and solar power plants located anywhere in the world.
> We have built this tool to help make scientific-quality weather and energy data available to a wider community.

Generate wind and solar profiles from MERRA weather data – globally. Run by Stefan Pfenninger and Iain Staffell.
(Modern-Era Retrospective analysis for Research and Applications (MERRA) from NASA)
The ninja works by taking weather data from global reanalysis models and satellite observations. Our two data sources are:

- NASA [MERRA](https://gmao.gsfc.nasa.gov/reanalysis/MERRA/) reanalysi
- CM-SAF's [SARAH dataset](https://wui.cmsaf.eu/safira/action/viewDoiDetails?acronym=SARAH_V001) (Copyright 2015 EUMETSAT)

- PV Python Package Source Code - GSEE: Global Solar Energy Estimator: https://github.com/renewables-ninja/gsee

**What to do with data**:

- Line Chart with Capacity from 1990 to 2019 (ninja_pv_country_AT_merra-2_corrected)
- Bar Chart für jedes Monat Capacity (averaged?)
- Scatterplot/Heatmap with temperatur (ninja_weather_country_AT_merra-2_land_area_weighted)
- Weather Data from: https://openweathermap.org/current

## What is the solar capacity factor?

The solar capacity factor is the ratio of the actual power produced by a solar system in a particular period of time to the maximum possible power that can be produced by the system. As it is a ratio of the same quantities, it is unitless and expressed in percentages. The typical values of the solar capacity factor are between 10% and 25%. For the solar utility power plant, solar capacity is around 24.5%.

The solar capacity factor of a particular system tells how often the system is running. The higher the value of the capacity factor, the better the performance of the system. The ideal value is 100% for any system. But in the real world, the solar capacity factor never exceeds 40%.

## Präsentation

warum gehts in daten, welche insights, dashboard und interaktionen herzeigen
zsert aus user sciht dann kurz code
6min redezeit, welche daten verwendet, welche interessanten aspakte kann man durch dashbaord entdecken, patterns, muster, wie funktioniert interaction mit dashboard

## Abgabe

1. Dashboard: Screenshot of dashboard
2. Report über design approach (7 Stages) - use template

## 7 Stages

Folien Block 4 - 3

### Define a Clear Purpose

was für dashboard möcht ich machen? , welche Daten möchte ich verwenden?, in welche Richtung?
Hourly PV Daten von Österreich von 1980 - 2019 darstellen

### Know Your Audience

wer ist meine Zielgruppe? Experten? General Public - jeder
Experten

Static operational?

### Keep Visualizations Simple

- LineChart: um Jahresverlauf zu sehen
- BoxPlot: for statistical overview about data distribution per year
- HeatMap: zur Temperatur Darstellung über den Tag pro Jahr

### Choose the Right Visual

### Make Sure Your Visualisations are Inclusive

- Each plot has a hover interaction
- The linechart and heatmap get updated on the year selected in the boxplot chart

### Provide Context

### Make It Actionable

## References

- https://github.com/plotly/react-plotly.js/
- https://plotly.com/javascript/configuration-options/
