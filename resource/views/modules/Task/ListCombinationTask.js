/**
 * @description: danh sách công việc phối hợp
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


export default class ListCombinationTask extends Component {

    render() {
        return (
            <BaseTaskList taskType={CONGVIEC_CONSTANT.PHOIHOP_XULY} navigator={this.props.navigation} />
        )
    }
}