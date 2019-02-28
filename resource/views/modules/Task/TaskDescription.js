/*
* @description: mô tả công việc
* @author: duynn
* @since: 12/05/2018
*/

'use strict'
import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';

//common
import { convertDateToString } from '../../../common/Utilities';

import { DetailTaskStyle } from '../../../assets/styles/TaskStyle';
import * as util from 'lodash';

import HTMLView from 'react-native-htmlview';

export default class TaskDescription extends Component {
    constructor(props) {
        super(props);
    }

    

    render() {
        return (
            <View style={DetailTaskStyle.container}>
                <ScrollView>
                    <List containerStyle={DetailTaskStyle.listContainer}>
                        <ListItem style={DetailTaskStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailTaskStyle.listItemTitleContainer}>
                                    TÊN CÔNG VIỆC
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailTaskStyle.listItemSubTitleContainer}>
                                    {this.props.info.CongViec.TENCONGVIEC}
                                </Text>
                            } />

                        <ListItem style={DetailTaskStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailTaskStyle.listItemTitleContainer}>
                                    NGƯỜI GIAO VIỆC
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailTaskStyle.listItemSubTitleContainer}>
                                    {this.props.info.NGUOIGIAOVIEC}
                                </Text>
                            } />

                        <ListItem style={DetailTaskStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailTaskStyle.listItemTitleContainer}>
                                    NGƯỜI XỬ LÝ CHÍNH
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailTaskStyle.listItemSubTitleContainer}>
                                    {this.props.info.NGUOIXULYCHINH}
                                </Text>
                            } />
                        <ListItem style={DetailTaskStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailTaskStyle.listItemTitleContainer}>
                                    NGƯỜI THAM GIA
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailTaskStyle.listItemSubTitleContainer}>
                                    {util.isNull(this.props.info.LstNguoiThamGia) || util.isEmpty(this.props.info.LstNguoiThamGia) ? 'N/A' : this.props.info.LstNguoiThamGia.toString()}
                                </Text>
                            } />
                        <ListItem style={DetailTaskStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailTaskStyle.listItemTitleContainer}>
                                    SỐ NGÀY NHẮC VIỆC TRƯỚC HẠN
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailTaskStyle.listItemSubTitleContainer}>
                                    {this.props.info.CongViec.SONGAYNHACTRUOCHAN}
                                </Text>
                            } />
                        <ListItem style={DetailTaskStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailTaskStyle.listItemTitleContainer}>
                                    NHẮC VIỆC BẰNG EMAIL
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailTaskStyle.listItemSubTitleContainer}>
                                    {this.props.info.CongViec.IS_EMAIL ? 'Có' : 'Không'}
                                </Text>
                            } />
                        <ListItem style={DetailTaskStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailTaskStyle.listItemTitleContainer}>
                                    NHẮC VIỆC BẰNG SMS
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailTaskStyle.listItemSubTitleContainer}>
                                    {this.props.info.CongViec.IS_SMS ? 'Có' : 'Không'}
                                </Text>
                            } />
                        <ListItem style={DetailTaskStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailTaskStyle.listItemTitleContainer}>
                                    NHẮC VIỆC BẰNG TIN THÔNG BÁO
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailTaskStyle.listItemSubTitleContainer}>
                                    {this.props.info.CongViec.IS_POPUP ? 'Có' : 'Không'}
                                </Text>
                            } />
                        <ListItem style={DetailTaskStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailTaskStyle.listItemTitleContainer}>
                                    NGÀY HOÀN THÀNH MONG MUỐN
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailTaskStyle.listItemSubTitleContainer}>
                                    {convertDateToString(this.props.info.CongViec.NGAYHOANTHANH_THEOMONGMUON)}
                                </Text>
                            } />

                        <ListItem style={DetailTaskStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailTaskStyle.listItemTitleContainer}>
                                    ĐỘ ƯU TIÊN
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailTaskStyle.listItemSubTitleContainer}>
                                    {this.props.info.DOUUTIEN}
                                </Text>
                            } />

                        <ListItem style={DetailTaskStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailTaskStyle.listItemTitleContainer}>
                                    MỨC ĐỘ QUAN TRỌNG
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailTaskStyle.listItemSubTitleContainer}>
                                    {this.props.info.DOKHAN}
                                </Text>
                            } />
                        <ListItem style={DetailTaskStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailTaskStyle.listItemTitleContainer}>
                                    TRẠNG THÁI
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailTaskStyle.listItemSubTitleContainer}>
                                    Đang thực hiện
                                </Text>
                            } />

                        <ListItem style={DetailTaskStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailTaskStyle.listItemTitleContainer}>
                                    NỘI DUNG CÔNG VIỆC
                                </Text>
                            }
                            subtitle={
                                <HTMLView
                                    value={this.props.info.CongViec.NOIDUNGCONGVIEC}
                                />
                            } />
                    </List>
                </ScrollView>
            </View>
        );
    }
}
