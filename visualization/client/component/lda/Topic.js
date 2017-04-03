import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import fetch from 'isomorphic-fetch'

import styles from './AbsoluteTrend.css'
import Loading from '../Loading'

import { autobind } from 'react-decoration'
import { checkStatus, serverAddress } from '../../util'

const getOption = () => {
  'use strict'
}

export default class AbsoluteTrend extends React.Component {
  constructor () {
    super()
    this.state = {
      topic: []
    }
    fetch(`${serverAddress}/lda-topic`, { method: 'GET' })
      .then(checkStatus)
      .then((res) => (res.json()))
      .then((topic) => this.setState({topic}))
  }

  componentDidMount () {
    this.myChart = echarts.init(this.refs.Topic)
  }

  @autobind
  drawTopic () {
    const option = getOption(this.state)
    this.myChart.setOption(option)
  }

  render () {
    return <div
      className={styles.container}
      ref='Topic'>
      {_.isEmpty(this.state.trend) && _.isEmpty(this.state.topic)
        ? <Loading />
        : this.drawTopic()}
    </div>
  }
}