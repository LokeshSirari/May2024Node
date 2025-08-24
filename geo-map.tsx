"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import worldJson from "./world.json"; // or fetch from /public

const GeoMap = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType>();

  useEffect(() => {
    if (!chartRef.current) return;

    echarts.registerMap("world", worldJson as any);

    chartInstance.current = echarts.init(chartRef.current);

    // Example points with custom data
    const points = [
      { 
        name: "Delhi", 
        value: [77.1025, 28.7041],
        population: "20.9M",
        country: "India",
        description: "Capital city of India",
        region: "South Asia",
        timezone: "IST (UTC+5:30)"
      },
      { 
        name: "New York", 
        value: [-74.006, 40.7128],
        population: "8.8M",
        country: "USA",
        description: "The Big Apple",
        region: "North America",
        timezone: "EST (UTC-5)"
      },
      { 
        name: "Tokyo", 
        value: [139.6917, 35.6895],
        population: "37.4M",
        country: "Japan",
        description: "Capital of Japan",
        region: "East Asia",
        timezone: "JST (UTC+9)"
      },
    ];

    // Additional country data for tooltips
    const countryData = {
      "China": { region: "East Asia", population: "1.4B", capital: "Beijing", description: "World's most populous country" },
      "Brazil": { region: "South America", population: "214M", capital: "Brasília", description: "Largest country in South America" },
      "Australia": { region: "Oceania", population: "25.7M", capital: "Canberra", description: "Island continent" },
      "Canada": { region: "North America", population: "38.2M", capital: "Ottawa", description: "Second largest country by area" },
      "Germany": { region: "Europe", population: "83.2M", capital: "Berlin", description: "Largest economy in Europe" },
      "France": { region: "Europe", population: "67.4M", capital: "Paris", description: "Known for culture and cuisine" },
      "United Kingdom": { region: "Europe", population: "67.2M", capital: "London", description: "Historic island nation" },
      "Russia": { region: "Europe/Asia", population: "144.1M", capital: "Moscow", description: "Largest country by area" },
      "South Africa": { region: "Africa", population: "60.6M", capital: "Pretoria", description: "Rainbow Nation" },
      "Mexico": { region: "North America", population: "128.9M", capital: "Mexico City", description: "Rich in culture and history" },
      "India": { region: "South Asia", population: "1.4B", capital: "New Delhi", description: "World's largest democracy" },
      "USA": { region: "North America", population: "331M", capital: "Washington D.C.", description: "Land of the free" },
      "Japan": { region: "East Asia", population: "125.7M", capital: "Tokyo", description: "Land of the rising sun" }
    };

    // Create map data for all countries to ensure tooltips work
    const mapData = Object.keys(countryData).map(countryName => ({
      name: countryName,
      value: 1, // Dummy value to make the country clickable
      ...countryData[countryName as keyof typeof countryData]
    }));

    const option: echarts.EChartsOption = {
      title: {
        text: "World Map with Points",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        show: true,
        confine: true,
        formatter: (params: any) => {
          // Show tooltip for scatter points
          if (params.seriesType === "scatter") {
            const data = params.data;
            return `
              <div style="padding: 8px;">
                <h4 style="margin: 0 0 8px 0; color: #333;">${data.name}</h4>
                <p style="margin: 4px 0; color: #666;"><strong>Country:</strong> ${data.country}</p>
                <p style="margin: 4px 0; color: #666;"><strong>Region:</strong> ${data.region}</p>
                <p style="margin: 4px 0; color: #666;"><strong>Population:</strong> ${data.population}</p>
                <p style="margin: 4px 0; color: #666;"><strong>Timezone:</strong> ${data.timezone}</p>
                <p style="margin: 4px 0; color: #666;"><strong>Description:</strong> ${data.description}</p>
                <p style="margin: 4px 0; color: #999; font-size: 12px;">Coordinates: [${data.value[1].toFixed(2)}, ${data.value[0].toFixed(2)}]</p>
              </div>
            `;
          }
          
          // Show tooltip for countries (map series)
          if (params.seriesType === "map") {
            const countryName = params.name;
            const countryPoint = points.find(point => point.country === countryName);
            
            if (countryPoint) {
              // Show detailed info for countries with points
              return `
                <div style="padding: 8px;">
                  <h4 style="margin: 0 0 8px 0; color: #333;">${countryPoint.name}</h4>
                  <p style="margin: 4px 0; color: #666;"><strong>Country:</strong> ${countryPoint.country}</p>
                  <p style="margin: 4px 0; color: #666;"><strong>Region:</strong> ${countryPoint.region}</p>
                  <p style="margin: 4px 0; color: #666;"><strong>Population:</strong> ${countryPoint.population}</p>
                  <p style="margin: 4px 0; color: #666;"><strong>Timezone:</strong> ${countryPoint.timezone}</p>
                  <p style="margin: 4px 0; color: #666;"><strong>Description:</strong> ${countryPoint.description}</p>
                  <p style="margin: 4px 0; color: #999; font-size: 12px;">Coordinates: [${countryPoint.value[1].toFixed(2)}, ${countryPoint.value[0].toFixed(2)}]</p>
                </div>
              `;
            } else {
              // Show country info from map data
              const countryInfo = params.data;
              if (countryInfo && countryInfo.capital) {
                return `
                  <div style="padding: 8px;">
                    <h4 style="margin: 0 0 8px 0; color: #333;">${countryName}</h4>
                    <p style="margin: 4px 0; color: #666;"><strong>Capital:</strong> ${countryInfo.capital}</p>
                    <p style="margin: 4px 0; color: #666;"><strong>Region:</strong> ${countryInfo.region}</p>
                    <p style="margin: 4px 0; color: #666;"><strong>Population:</strong> ${countryInfo.population}</p>
                    <p style="margin: 4px 0; color: #666;"><strong>Description:</strong> ${countryInfo.description}</p>
                    <p style="margin: 4px 0; color: #999; font-size: 12px;">No data points in this region</p>
                  </div>
                `;
              } else {
                // Show basic info for countries without any data
                return `
                  <div style="padding: 8px;">
                    <h4 style="margin: 0 0 8px 0; color: #333;">${countryName}</h4>
                    <p style="margin: 4px 0; color: #666;"><strong>Status:</strong> No data available</p>
                    <p style="margin: 4px 0; color: #999; font-size: 12px;">Click to explore this region</p>
                  </div>
                `;
              }
            }
          }
          
          return "";
        },
      },
      series: [
        {
          type: "map",
          map: "world",
          roam: true,
          itemStyle: {
            areaColor: "#d1e6fa",
            borderColor: "transparent",
          },
          emphasis: {
            itemStyle: { areaColor: "#a4d8f0" },
            label: {
              show: false,
            },
          },
          label: {
            show: false,
          },
          data: mapData,
        },
        {
          type: "scatter",
          coordinateSystem: "geo",
          symbolSize: 12,
          itemStyle: { color: "red" },
          data: points,
        },
      ],
    };

    chartInstance.current.setOption(option);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      chartInstance.current?.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "600px" }} />;
};

export default GeoMap;
