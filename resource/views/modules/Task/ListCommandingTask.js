/**
 * @description: danh sách công việc tạo theo chỉ đạo
 * @author: annv
 * @since: 21/12/2018
 */
'use strict'
import React, { Component } from 'react';
import BaseTaskList from './BaseTaskList';

//constant
import { CONGVIEC_CONSTANT } from '../../../common/SystemConstant';

export default class ListCommandingTask extends Component {
    render() {
        return (
            <BaseTaskList taskType={CONGVIEC_CONSTANT.CUA_THUKY} navigator={this.props.navigation} />
        )
    }
}