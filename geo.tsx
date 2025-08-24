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
              <div class="p-2">
                <h4 class="m-0 mb-2 text-gray-800 font-semibold">${data.name}</h4>
                <p class="my-1 text-gray-600"><span class="font-medium">Country:</span> ${data.country}</p>
                <p class="my-1 text-gray-600"><span class="font-medium">Region:</span> ${data.region}</p>
                <p class="my-1 text-gray-600"><span class="font-medium">Population:</span> ${data.population}</p>
                <p class="my-1 text-gray-600"><span class="font-medium">Timezone:</span> ${data.timezone}</p>
                <p class="my-1 text-gray-600"><span class="font-medium">Description:</span> ${data.description}</p>
                <p class="my-1 text-gray-500 text-xs">Coordinates: [${data.value[1].toFixed(2)}, ${data.value[0].toFixed(2)}]</p>
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
                <div class="p-2">
                  <h4 class="m-0 mb-2 text-gray-800 font-semibold">${countryPoint.name}</h4>
                  <p class="my-1 text-gray-600"><span class="font-medium">Country:</span> ${countryPoint.country}</p>
                  <p class="my-1 text-gray-600"><span class="font-medium">Region:</span> ${countryPoint.region}</p>
                  <p class="my-1 text-gray-600"><span class="font-medium">Population:</span> ${countryPoint.population}</p>
                  <p class="my-1 text-gray-600"><span class="font-medium">Timezone:</span> ${countryPoint.timezone}</p>
                  <p class="my-1 text-gray-600"><span class="font-medium">Description:</span> ${countryPoint.description}</p>
                  <p class="my-1 text-gray-500 text-xs">Coordinates: [${countryPoint.value[1].toFixed(2)}, ${countryPoint.value[0].toFixed(2)}]</p>
                </div>
              `;
            } else {
              // Show country info from map data
              const countryInfo = params.data;
              if (countryInfo && countryInfo.capital) {
                return `
                  <div class="p-2">
                    <h4 class="m-0 mb-2 text-gray-800 font-semibold">${countryName}</h4>
                    <p class="my-1 text-gray-600"><span class="font-medium">Capital:</span> ${countryInfo.capital}</p>
                    <p class="my-1 text-gray-600"><span class="font-medium">Region:</span> ${countryInfo.region}</p>
                    <p class="my-1 text-gray-600"><span class="font-medium">Population:</span> ${countryInfo.population}</p>
                    <p class="my-1 text-gray-600"><span class="font-medium">Description:</span> ${countryInfo.description}</p>
                    <p class="my-1 text-gray-500 text-xs">No data points in this region</p>
                  </div>
                `;
              } else {
                // Show basic info for countries without any data
                return `
                  <div class="p-2">
                    <h4 class="m-0 mb-2 text-gray-800 font-semibold">${countryName}</h4>
                    <p class="my-1 text-gray-600"><span class="font-medium">Status:</span> No data available</p>
                    <p class="my-1 text-gray-500 text-xs">Click to explore this region</p>
                  </div>
                `;
              }
            }
          }
          
          return "";
        },
      },
      geo: {
        map: "world",
        roam: true,
        itemStyle: {
          areaColor: "transparent",
          borderColor: "transparent",
        },
        emphasis: {
          itemStyle: { areaColor: "transparent" },
          label: {
            show: false,
          },
        },
        label: {
          show: false,
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
          select: {
            itemStyle: {
              areaColor: "#d1e6fa", // Same as default
              borderColor: "transparent",
            },
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

  return <div ref={chartRef} className="w-full h-[600px]" />;
};

export default GeoMap;
