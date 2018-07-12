/**
 * @description: danh sách công việc được giao
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

export default class ListAssignedTask extends Component {

    render() {
        return (
            <BaseTaskList taskType={CONGVIEC_CONSTANT.DUOC_GIAO} navigator={this.props.navigation} />
        )
    }
}