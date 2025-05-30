import React from 'react';
import ReactECharts from 'echarts-for-react';
import './TATGraphs.css';

const TATGraphs = () => {
  const monthlyOption = {
    title: { text: '', show: false },
    tooltip: { trigger: 'axis' },
    legend: {
        top: 10,
        icon: 'circle',
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 25,
        orient: 'horizontal',
        textStyle: {
          fontSize: 14,
          color: '#333',
          rich: {
            space: {
              padding: [0, 0, 0, 6] // Left padding for the text
            }
          }
        },
        formatter: function (name) {
          return `{space|${name}}`;
        },
        data: [
          { name: 'Bag (Pink)', icon: 'circle' },
          { name: 'Loose Cement', icon: 'circle' },
          { name: 'Bag (Green)', icon: 'circle' },
          { name: 'Bag (Blue)', icon: 'circle' }
        ]
    },           
    xAxis: {
      type: 'category',
      data: ['2022', '2023', '2024']
    },
    yAxis: {
        type: 'value',
        name: 'Avg. Yard TAT',
        nameLocation: 'middle',
        nameGap: 30,
        nameRotate: 90,
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#444',
          align: 'center'
        },
        axisLabel: {
          show: false  // ✅ This hides the numeric values
        },
        splitLine: {
          show: true,  // Optional: keep grid lines
          lineStyle: {
            color: '#eee'
          }
        }
    },
    series: [
      {
        name: 'Bag (Pink)',
        type: 'line',
        data: [10, 14, 18],
        color: '#ff7b89',
        smooth: true
      },
      {
        name: 'Loose Cement',
        type: 'line',
        data: [9, 11, 14],
        color: '#00b894',
        smooth: true
      },
      {
        name: 'Bag (Green)',
        type: 'line',
        data: [8, 10, 13],
        color: '#2ecc71',
        smooth: true
      },
      {
        name: 'Bag (Blue)',
        type: 'line',
        data: [6, 8, 10],
        color: '#2d3436',
        smooth: true
      }
    ]
  };

  const yearlyOption = {
    title: { text: '', show: false },
    tooltip: { trigger: 'axis' },
    legend: {
        top: 10,
        icon: 'circle',
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 25,
        orient: 'horizontal',
        textStyle: {
          fontSize: 14,
          color: '#333',
          rich: {
            space: {
              padding: [0, 0, 0, 6] // Left padding for the text
            }
          }
        },
        formatter: function (name) {
          return `{space|${name}}`;
        },
        data: [
          { name: 'Bag (Pink)', icon: 'circle' },
          { name: 'Loose Cement', icon: 'circle' },
          { name: 'Bag (Green)', icon: 'circle' },
          { name: 'Bag (Blue)', icon: 'circle' }
        ]
    },           
    xAxis: {
      type: 'category',
      data: ['2022', '2023', '2024']
    },
    yAxis: {
        type: 'value',
        name: 'Avg. Yard TAT',
        nameLocation: 'middle',
        nameGap: 30,
        nameRotate: 90,
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#444',
          align: 'center'
        },
        axisLabel: {
          show: false  // ✅ This hides the numeric values
        },
        splitLine: {
          show: true,  // Optional: keep grid lines
          lineStyle: {
            color: '#eee'
          }
        }
    },
    series: [
      {
        name: 'Bag (Pink)',
        type: 'line',
        data: [11, 15, 19],
        color: '#ff7b89',
        smooth: true
      },
      {
        name: 'Loose Cement',
        type: 'line',
        data: [9, 12, 15],
        color: '#00b894',
        smooth: true
      },
      {
        name: 'Bag (Green)',
        type: 'line',
        data: [8, 11, 14],
        color: '#2ecc71',
        smooth: true
      },
      {
        name: 'Bag (Blue)',
        type: 'line',
        data: [6, 9, 11],
        color: '#2d3436',
        smooth: true
      }
    ]
  };

  return (
    <div className="tat-container row" style={{background:"#fff"}}>
      <div className="tat-card">
      <br></br>
        <div className="tat-title">Monthly TAT Graph</div>
        <br></br>
        <ReactECharts option={monthlyOption} style={{ height: 300 }} />
      </div>
      <div className="tat-card">
      <br></br>
        <div className="tat-title">Yearly TAT Graph</div>
        <br></br>
        <ReactECharts option={yearlyOption} style={{ height: 300 }} />
      </div>
    </div>
  );
};

export default TATGraphs;
