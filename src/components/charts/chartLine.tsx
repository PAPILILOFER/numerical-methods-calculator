"use client"

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { CoefficientIteration } from '@/lib/types';

interface LineChartProps {
  iterations: CoefficientIteration[];
}

export default function LineChart({ iterations }: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Get theme colors
    const textColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-foreground').trim();

    // Initialize chart
    chartInstanceRef.current = echarts.init(chartRef.current);
    
    const option = {
      title: {
        text: 'Gráfica de la Función',
        left: 'center',
        textStyle: {
          color: textColor
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {
            iconStyle: {
              borderColor: textColor
            }
          }
        }
      },
      xAxis: {
        type: 'category',
        name: 'x',
        nameLocation: 'middle',
        nameGap: 25,
        boundaryGap: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: textColor,
            width: 2
          }
        },
        axisLabel: {
          color: textColor
        },
        nameTextStyle: {
          color: textColor
        },
        data: [...new Set(iterations.map(it => Number(it.xi).toString()))]
      },
      yAxis: {
        type: 'value',
        name: 'y',
        nameLocation: 'middle',
        nameGap: 40,
        axisLine: {
          show: true,
          lineStyle: {
            color: textColor,
            width: 2
          }
        },
        axisLabel: {
          color: textColor
        },
        nameTextStyle: {
          color: textColor
        },
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: 'f(x)',
          type: 'line',
          smooth: false,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#5470c6'
          },
          lineStyle: {
            color: '#5470c6',
            width: 2
          },
          markLine: {
            symbol: ['none', 'none'],
            lineStyle: {
              type: 'dashed',
              color: textColor,
              opacity: 0.5
            },
            data: iterations.map(it => ([
              {
                xAxis: Number(it.xi),
                yAxis: 0,
                lineStyle: { type: 'dashed' }
              },
              {
                xAxis: Number(it.xi),
                yAxis: Number(it.fxi)
              },
              {
                xAxis: 0,
                yAxis: Number(it.fxi)
              }
            ]))
          },
          label: {
            show: true,
            position: 'top',
            color: textColor,
            formatter: (params: echarts.DefaultLabelFormatterCallbackParams) => 
              typeof params.value === 'number' ? params.value.toString() : ''
          },
          data: [...new Set(iterations.map(it => Number(it.fxi)))]
        }
      ]
    };

    chartInstanceRef.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
      }
    };
  }, [iterations]);

  return (
    <div className="w-full h-[400px] min-h-[300px] max-h-[600px]" ref={chartRef} />
  );
}