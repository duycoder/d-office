/**
 * @description: danh sách văn bản trình ký chưa xử lý
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict'
import React, { Component } from 'react';
import BaseList from './BaseList';
import { VANBANDI_CONSTANT } from '../../../common/SystemConstant';

export default class IsProcessList extends Component {
    render() {
        return (
            <BaseList docType={VANBANDI_CONSTANT.DA_XULY} navigator={this.props.navigation} />
        )
    }
}