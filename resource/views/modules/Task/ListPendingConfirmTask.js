/**
 * @description: danh sách công việc chờ xác nhận
 * @author: duynn
 * @since: 10/05/2018
 */
'use strict'
import React, { Component } from 'react';
import BaseTaskList from './BaseTaskList';

//constant
import {
    CONGVIEC_CONSTANT,
} from '../../../common/SystemConstant';

export default class ListPendingConfirmTask extends Component {

    render() {
        return (
            <BaseTaskList taskType={CONGVIEC_CONSTANT.CHO_XACNHAN} navigator={this.props.navigation} />
        )
    }
}