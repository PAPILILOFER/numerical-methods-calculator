"use client"

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { CoefficientIteration } from '@/lib/types';

interface LineChartProps {
  iterations: CoefficientIteration[];
}

interface EChartsTooltipParam {
  axisValue: string | number;
  data: number;
  seriesName: string;
  value: number[];
  name: string;
  dataIndex: number;
  seriesIndex: number;
}

interface EChartsAxisLabelParam {
  value: number | string;
  index: number;
}

interface EChartsMarkLineParam {
  value: number;
  dataIndex: number;
  name?: string;
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
        trigger: 'axis',
        formatter: function(params: EChartsTooltipParam[]) {
          if (!Array.isArray(params) || params.length === 0) return '';
          const point = params[0];
          if (!point) return '';
          
          const x = point.axisValue;
          const y = point.data;
          return `x: ${x}<br/>y: ${y}`;
        }
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
          color: textColor,
          formatter: (value: EChartsAxisLabelParam['value']) => {
            const num = Number(value);
            return isNaN(num) ? value : num.toFixed(2);
          }
        },
        nameTextStyle: {
          color: textColor
        },
        data: [...new Set(iterations.map(it => {
          const num = Number(it.xi);
          return isNaN(num) ? it.xi : num.toFixed(2);
        }))]
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
          color: textColor,
          formatter: (value: EChartsAxisLabelParam['value']) => {
            const num = Number(value);
            return isNaN(num) ? value : num.toFixed(2);
          }
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
            label: {
              formatter: (params: EChartsMarkLineParam) => {
                const value = Number(params.value);
                return isNaN(value) ? String(params.value) : value.toFixed(2);
              }
            },
            data: iterations.map(it => {
              const xi = Number(it.xi);
              const fxi = Number(it.fxi);
              return [
                {
                  xAxis: isNaN(xi) ? it.xi : xi.toFixed(2),
                  yAxis: 0,
                  lineStyle: { type: 'dashed' }
                },
                {
                  xAxis: isNaN(xi) ? it.xi : xi.toFixed(2),
                  yAxis: isNaN(fxi) ? it.fxi : fxi.toFixed(2)
                },
                {
                  xAxis: 0,
                  yAxis: isNaN(fxi) ? it.fxi : fxi.toFixed(2)
                }
              ];
            })
          },
          label: {
            show: true,
            position: 'top',
            color: textColor,
            formatter: (params: echarts.DefaultLabelFormatterCallbackParams) => {
              if (typeof params.value === 'number') {
                return isNaN(params.value) ? '' : params.value.toFixed(2);
              }
              return '';
            }
          },
          data: [...new Set(iterations.map(it => {
            const num = Number(it.fxi);
            return isNaN(num) ? Number(it.fxi) : Number(num.toFixed(2));
          }))]
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