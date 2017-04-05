import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import moment from 'moment'

import styles from './Main.css'
import Loading from '../Loading'

import { autobind } from 'react-decoration'
import { Checkbox } from 'antd'
import { checkStatus, serverAddress } from '../../util'

const refName = 'AbsoluteTrend'

const rawDateFormat = 'YYYY-MM-DD'
const dateFormat = 'YYYY-MM'

const CheckboxGroup = Checkbox.Group

const getMaCalculator = (values) => (dayCount) => {
  const result = []
  for (let i = 0, len = values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-')
      continue
    }
    let sum = 0
    for (let j = 0; j < dayCount; j++) {
      sum += values[i - j]
    }
    result.push(sum / dayCount)
  }
  return result
}

const getOption = (trend) => {
  const calculateMA = getMaCalculator(trend.values)
  return {
    title: {
      text: '绝对趋势',
      left: 100
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['月线', 'MA3', 'MA5']
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: trend.categoryData,
      scale: true,
      boundaryGap: false,
      axisLine: {onZero: false},
      splitLine: {show: false},
      splitNumber: 20,
      min: 'dataMin',
      max: 'dataMax'
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: true
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 50,
        end: 100
      },
      {
        show: true,
        type: 'slider',
        y: '90%',
        start: 50,
        end: 100
      }
    ],
    series: [
      {
        name: '月线',
        type: 'line',
        data: calculateMA(1),
        smooth: true,
        lineStyle: {
          normal: {opacity: 0.5}
        }
      },
      {
        name: 'MA3',
        type: 'line',
        data: calculateMA(3),
        smooth: true,
        lineStyle: {
          normal: {opacity: 0.5}
        }
      },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5),
        smooth: true,
        lineStyle: {
          normal: {opacity: 0.5}
        }
      }
    ]
  }
}

const transformData = (rawData) => {
  const totalTrend = {}
  const topicTrend = []

  rawData.forEach(data => {
    const date = moment(data.date, rawDateFormat).format(dateFormat)
    totalTrend[date] = _.get(totalTrend, date, 0) + 1
    const lda = data.lda
    const topic = lda.indexOf(Math.max(...lda))
    if (_.isEmpty(topicTrend[topic])) {
      topicTrend[topic] = {}
      topicTrend[topic][date] = 1
    } else {
      topicTrend[topic][date] = _.get(topicTrend[topic], date, 0) + 1
    }
  })

  const categoryData = []
  const values = []
  const topicValues = []

  _.forIn(totalTrend, (totalAmount, date) => {
    categoryData.push(date)
    values.push(totalAmount)
    topicValues.push(topicTrend.map(topic => (
      _.get(topic, date, 0) / totalAmount
    )))
  })

  const topic = topicTrend.map((topic, index) => (`主题${index + 1}`))
  return {categoryData, topicValues, topic}
}

export default class AbsoluteTrend extends React.Component {
  constructor () {
    super()
    this.state = {
      categoryData: [],
      topicValues: [],
      checkedList: [],
      topic: [],
      indeterminate: true,
      checkAll: false
    }
    fetch(`${serverAddress}/lda-doc`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((doc) => {
        const data = transformData(doc)
        this.setState({
          ...this.state,
          categoryData: data.categoryData,
          topicValues: data.topicValues,
          checkedList: [data.topic[0]],
          topic: data.topic
        })
      }) // todo draw
  }

  isDataLoaded () {
    return !_.isEmpty(this.state.topic)
  }

  componentDidMount () {
    this.myChart = echarts.init(this.refs[refName])
  }

  @autobind
  onChange (checkedList) {
    const plainOptions = this.state.topic
    this.setState({
      ...this.state,
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length
    })
  }

  @autobind
  onCheckAllChange (e) {
    this.setState({
      ...this.state,
      checkedList: e.target.checked ? this.state.topic : [],
      indeterminate: false,
      checkAll: e.target.checked
    })
  }

  @autobind
  drawAbsoluteTrend () {
    const option = getOption(this.state.trend)
    this.myChart.setOption(option)
  }

  @autobind
  drawCheckbox () {
    return <div style={{position: 'fixed', width: 222, top: 30, right: 120}}>
      <div style={{ borderBottom: '1px solid #E9E9E9' }}>
        <Checkbox
          indeterminate={this.state.indeterminate}
          onChange={this.onCheckAllChange}
          checked={this.state.checkAll}
        >
          全选
        </Checkbox>
      </div>
      <br />
      <CheckboxGroup options={this.state.topic} value={this.state.checkedList} onChange={this.onChange} />
    </div>
  }

  render () {
    return <div
      className={styles.container}>
      <div
        className={styles.palette}
        ref={refName}
      />
      {this.isDataLoaded()
        ? this.drawCheckbox()
        : <Loading />}
    </div>
  }
}
