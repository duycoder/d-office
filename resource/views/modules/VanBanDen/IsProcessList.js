/**
 * @author:duynn
 * @description: danh sách văn bản đến đã xử lý
 * @since:22/01/2019
 */
import React, { Component } from 'react'
import { VANBANDEN_CONSTANT } from '../../../common/SystemConstant'
import BaseList from './BaseList';
export default class IsProcessList extends Component {
    render() {
        return (
            <BaseList docType={VANBANDEN_CONSTANT.DA_XULY} navigator={this.props.navigation} />
        )
    }
}
