<!-- 线性图表 -->
<template>
<div>
  <div v-if="!showCard && !emptyData" :id="id" class="chart" :style="{height:chartHeight,width:chartWidth}"></div>
  <div v-else-if="!showCard && emptyData" style="text-align:center;display: table-cell;vertical-align: middle;" :style="{height:chartHeight,width:chartWidth}">
    <span >暂无数据</span>
  </div>
   <el-card v-else-if="showCard" class="box-card">
            <div slot="header" >
              <div v-html="cardTitle"></div>
              <div v-if="showCard && !emptyData" :id="id" class="chart" :style="{height:chartHeight,width:chartWidth}"></div>
              <div v-else-if="showCard && emptyData" style="text-align:center;display: table-cell;vertical-align: middle;" :style="{height:chartHeight,width:chartWidth}" >
                  <span >暂无数据</span>
              </div>
            </div>
     </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import { timeStamp } from '@/utils/date'
import _ from 'lodash'
export default {
  name: 'line-chart',
  components: {},
  data() {
    return {
      id: this.generatorOnlyId('echarts_'),
      empty_png_src: {
        line: require('@/assets/images/empty_line.png'),
        bar: require('@/assets/images/empty_bar.png'),
        pie: require('@/assets/images/empty_pie.png'),
        area: require('@/assets/images/empty_area.png')
      },
      iconSize: '150',
      chartDom: {},
      emptyData: false,
      defaultColors: [
        '#3fb1e3',
        '#6be6c1',
        '#626c91',
        '#a0a7e6',
        '#c4ebad',
        '#96dee8'
      ],
      defaultLineStyle: {
        lineStyle: {
          color: '#0087ED',
          width: 1
        }
      },
      chartWidth: '700px',
      chartHeight: '300px'
    }
  },
  props: {
    chartType: {
      type: String,
      default() {
        // 图表类型 line/bar/pie/area/rose
        return 'line'
      }
    },
    yAxisSuffix: {
      type: String,
      default() {
        return ''
      }
    },
    cardTitle: {
      type: String,
      default() {
        return ''
      }
    },
    hideLegend: {
      type: Boolean,
      default() {
        return false
      }
    },
    showCard: {
      type: Boolean,
      default() {
        return false
      }
    },
    yDate: {
      type: Boolean,
      default() {
        return false
      }
    },
    ratio: {
      type: Number,
      default: 0.4
    },
    titleText: {
      type: String,
      default() {
        // 主标题
        return ''
      }
    },
    subText: {
      type: String,
      default() {
        // 次级标题
        return ''
      }
    },
    xText: {
      type: String,
      default() {
        // 横轴文本
        return ''
      }
    },
    yText: {
      type: String,
      default() {
        // 纵轴文本
        return ''
      }
    },
    chartData: {
      type: Array,
      default() {
        // 图表数据
        return []
      }
    },
    doughnutData: {
      type: Array,
      default() {
        // 图表数据
        return []
      }
    },
    legendData: {
      type: Array,
      default() {
        // 图表数据 针对柱形
        return []
      }
    }
  },
  computed: {
    xAxisData() {
      return this.chartData.map(function(item) {
        return item[0]
      })
    },
    yAxisData() {
      return this.chartData.map(function(item) {
        return item[1]
      })
    },
    labelData() {
      return this.chartData.map(function(item) {
        return item[2]
      })
    },
    seriesData() {
      var the = this
      const _data = []
      // 循环chartData [[2018,[1,2]] 2018 2019

      // 2018 [1,2]
      // 已处理  series: [ {name: 'Forest',data:[x?]}]
      _.forEach(the.chartData, function(cData, index) {
        _.forEach(the.legendData, function(v, i) {
          // 根据legendData 元素名称获取 seriesData 中已存在的 元素 如果没有获取到则重新生成一个元素 push 否则 改变他的data 属性的值
          // 改变方式为将当前获取到的 legendData元素对应的数值 push 进去
          const chaData = the.findData(_data, v)
          const _cur_data = cData[1][i]
          if (_.isEmpty(chaData)) {
            _data.push({
              name: v,
              data: [_cur_data],
              type: 'bar',
              barGap: '0%',
              barWidth: '10'
            })
          } else {
            const _index = _.indexOf(_data, chaData)
            var __data = _.get(chaData, 'data', [])
            __data.push(_cur_data)
            _data[_index] = chaData
          }
        })
      })
      return _data
    }
  },
  methods: {
    findData(arr, v) {
      return _.find(arr, function(o) {
        return _.eq(_.get(o, 'name'), v)
      })
    },
    // 生成图表的唯一ID
    generatorOnlyId(pre) {
      return pre + Math.floor(Math.random() * 10000) + new Date().getSeconds()
    },
    // 生成渲染图表div的宽度与高度
    generatorWithAndHeight() {
      this.chartWidth = `${
        this.width ? this.width : document.body.offsetWidth * this.ratio
      }px`
      this.iconSize = `${
        this.iconSize ? this.iconSize : document.body.offsetWidth * this.ratio
      }px`
    },
    // 绘制图表
    drawChart() {
      var the = this
      this.emptyData = _.isEmpty(the.chartData) && (_.eq(the.chartType, 'pie') || _.eq(the.chartType, 'rose'))
      if (!_.isEmpty(_.get(the.chartDom, the.id))) {
        // 销毁重新生成id
        _.get(the.chartDom, the.id).dispose()
        _.unset(the.chartDom, the.id)
      }
      setTimeout(function() {
        if (
          !document.getElementById(the.id) ||
          (_.isEmpty(the.chartData) && (_.eq(the.chartType, 'pie') || _.eq(the.chartType, 'rose')))
        ) {
          return
        }
        var chart = echarts.init(document.getElementById(the.id))
        _.set(the.chartDom, the.id, chart)
        if (chart === undefined) {
          console.error(`echarts init dom id ${the.id} failed`)
          return
        }
        switch (the.chartType) {
          case 'line':
            chart.setOption(the.generatorLineOption())
            break
          case 'bar':
            chart.setOption(the.generatorBarOption())
            break
          case 'pie':
            chart.setOption(the.generatorPieOption())
            break
          case 'area':
            chart.setOption(the.generatorAreaOption())
            break
          case 'rose':
            chart.setOption(the.generatorRosePieOption())
            break
          case 'doughnut':
            chart.setOption(the.generatorDoughnutOption())
            break
          default:
            console.error(`chartType ${the.chartType} is invalid`)
            break
        }
        let work = null
        window.addEventListener('resize', function() {
          the.generatorWithAndHeight()
          if (work == null) {
            work = setTimeout(function() {
              try {
                chart.resize()
              } catch (error) {
                console.log(error)
              }
              work = null
            }, 100)
          }
        })
      }, 500)
    },
    generatorLineOption() {
      return {
        color: this.defaultColors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        title: {
          text: this.titleText,
          subtext: this.subText
        },
        xAxis: {
          type: 'category',
          data: this.xAxisData,
          axisLine: this.defaultLineStyle
        },
        grid: {
          x: 70,
          y: 30,
          x2: 100,
          y2: 20
        },
        yAxis: {
          type: 'value',
          axisLine: this.defaultLineStyle
        },
        series: [
          {
            name: this.titleText,
            data: this.yAxisData,
            type: 'line'
          }
        ]
      }
    },

    generatorAreaOption() {
      var theLabelData = this.labelData
      var the = this
      return {
        color: this.defaultColors,
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            // label
            var data =
              _.get(params[0], 'axisValue') +
              ':' +
              _.get(params[0], 'value') +
              '<br>'
            _.forEach(theLabelData[_.get(params[0], 'dataIndex')], function(
              v,
              i
            ) {
              if (!_.isEmpty(v)) {
                data += v[0] + ':' + v[1] + '<br>'
              }
            })
            return data
          },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        title: {
          text: this.titleText,
          subtext: this.subText
        },
        xAxis: {
          type: 'category',
          data: this.xAxisData,
          axisLine: this.defaultLineStyle
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: function(value, index) {
              return the.yDate ? timeStamp(_.multiply(value, 3600)) : value + the.yAxisSuffix
            }
          },
          axisLine: this.defaultLineStyle
        },
        grid: {
          x: 70,
          y: 30,
          x2: 100,
          y2: 20
        },
        series: [
          {
            name: this.titleText,
            data: this.yAxisData,
            type: 'line',
            smooth: true,
            symbolSize: 12, // 折线点圆圈的大小
            areaStyle: { normal: {}},
            itemStyle: {
              normal: { // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#A8AAFA' // 0% 处的颜色
                }, {
                  offset: 0.5, color: '#CED7FF' // 50% 处的颜色
                }, {
                  offset: 1, color: '#CBEFFF' // 100% 处的颜色
                }]
                ), // 背景渐变色
                lineStyle: { // 系列级个性化折线样式
                  width: 5,
                  type: 'solid',
                  color: '#3580FA'
                }
              }
            },
            label: {
              normal: {
                show: false,
                position: 'top',
                offset: [-10, 0]
              }
            }
          }
        ]
      }
    },
    generatorBarOption() {
      return {
        color: this.defaultColors,
        title: {
          text: this.titleText,
          subtext: this.subText,
          x: 'center'
        },
        legend: {
          x: 'center',
          data: this.legendData,
          show: !this.hideLegend
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          x: 70,
          y: 30,
          x2: 100,
          y2: 20
        },
        xAxis: [
          {
            type: 'category',
            data: this.xAxisData,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: this.defaultLineStyle
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: this.defaultLineStyle
          }
        ],
        series: this.seriesData
      }
    },
    generatorDoughnutOption() { // 环形图
      const pieData = []
      for (const index in this.xAxisData) {
        pieData.push({
          value: this.yAxisData[index],
          name: this.xAxisData[index]
        })
      }
      return {
        title: {
          text: this.titleText,
          subtext: this.subText,
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: this.xAxisData
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            abelLine: {
              normal: {
                show: false
              }
            },
            data: pieData
          }
        ]
      }
    },
    generatorPieOption() {
      const pieData = []
      for (const index in this.xAxisData) {
        pieData.push({
          value: this.yAxisData[index],
          name: this.xAxisData[index]
        })
      }
      return {
        color: this.defaultColors,
        title: {
          text: this.titleText,
          subtext: this.subText,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: this.xAxisData
        },
        series: [
          {
            name: this.titleText,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: pieData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },
    // 玫瑰饼
    generatorRosePieOption() {
      const pieData = []
      for (const index in this.xAxisData) {
        pieData.push({
          value: this.yAxisData[index],
          name: this.xAxisData[index]
        })
      }
      return {
        color: this.defaultColors,
        title: {
          text: this.titleText,
          subtext: this.subText,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          y: 'bottom',
          type: 'scroll',
          data: this.xAxisData
        },
        series: [
          {
            name: this.titleText,
            type: 'pie',
            radius: [20, 110],
            center: ['50%', '50%'],
            roseType: 'area',
            label: {
              normal: {
                formatter: '{b}：{d}%'
              }
            },
            data: pieData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  watch: {},
  mounted() {
    // 不自动去调用画图方法
    // this.drawChart()
  },
  created() {
    this.generatorWithAndHeight()
  }
}
</script>

<style scoped>
.chart {
  text-align: center;
  margin: 0 auto;
}
</style>