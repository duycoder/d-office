/**
 * @description: danh sách văn bản trình ký đã review
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { VANBANDI_CONSTANT } from '../../../common/SystemConstant';
import BaseList from './BaseList';

export default class JoinProcessList extends Component {
    render() {
        return (
            <BaseList docType={VANBANDI_CONSTANT.THAMGIA_XULY} navigator={this.props.navigation} />
        )
    }
}