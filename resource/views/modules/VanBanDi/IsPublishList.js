/**
 * @description: danh sách văn bản trình ký chưa xử lý
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { VANBANDI_CONSTANT } from '../../../common/SystemConstant';
import BaseList from './BaseList';

export default class IsPublishList extends Component {

    render() {
        return (
            <BaseList docType={VANBANDI_CONSTANT.DA_BANHANH} navigator={this.props.navigation} />
        )
    }
}