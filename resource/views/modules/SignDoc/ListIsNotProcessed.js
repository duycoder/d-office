/**
 * @description: danh sách văn bản trình ký chưa xử lý
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict'
import React, { Component } from 'react';
import BaseSignDocList from './BaseSignDocList';
import { VANBAN_CONSTANT } from '../../../common/SystemConstant';

export default class ListIsNotProcessed extends Component {
    render() {
        return (
            <BaseSignDocList docType={VANBAN_CONSTANT.CHUA_XULY} navigator={this.props.navigation} />
        )
    }
}