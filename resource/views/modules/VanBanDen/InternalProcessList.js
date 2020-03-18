/**
 * @author:duynn
 * @description: danh sách văn bản đến nội bộ đã xử lý
 * @since:22/01/2019
 */
import React, { Component } from 'react'
import { VANBANDEN_CONSTANT } from '../../../common/SystemConstant';
import BaseList from './BaseList';

export default class InternalProcessList extends Component {
  render() {
    return (
      <BaseList docType={VANBANDEN_CONSTANT.NOIBO_DAXULY} navigator={this.props.navigation} />
    )
  }
}
