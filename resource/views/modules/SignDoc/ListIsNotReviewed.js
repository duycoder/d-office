/**
 * @description: danh sách văn bản trình ký chưa xử lý
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { VANBAN_CONSTANT } from '../../../common/SystemConstant';
import BaseSignDocList from './BaseSignDocList';

export default class ListIsNotReviewed extends Component {

    render() {
        return (
            <BaseSignDocList docType={VANBAN_CONSTANT.CAN_REVIEW} navigator={this.props.navigation} />
        )
    }
}