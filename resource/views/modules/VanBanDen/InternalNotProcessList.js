/**
 * @author:duynn
 * @description: danh sách văn bản đến nội bộ chưa xử lý
 * @since: 22/01/2019
 */
import React, { Component } from 'react'
import BaseList from './BaseList';
import { VANBANDEN_CONSTANT } from '../../../common/SystemConstant';
export default class InternalNotProcessList extends Component {
  render() {
    return (
      <BaseList docType={VANBANDEN_CONSTANT.NOIBO_CHUAXULY} navigator={this.props.navigation} />
    )
  }
}