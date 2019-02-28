/**
 * @description: thông tin chính văn bản trình ký
 * @author: duynn
 * @since: 04/05/2018
 */
import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'

//lib
import { List, ListItem } from 'react-native-elements'
import _ from 'lodash';
import HTMLView from 'react-native-htmlview';
//styles
import { DetailSignDocStyle } from '../../../assets/styles/SignDocStyle';
//common
import { convertDateToString } from '../../../common/Utilities';
import { Colors } from '../../../common/SystemConstant';

export default class MainInfoSignDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: props.info.VanBanTrinhKy
        }
    }

    render() {
        const { info } = this.state;
        let sohieu = (
            <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                {this.state.info.SOHIEU}
            </Text>
        );
        if (info.SOHIEU === null || info.SOHIEU === "") {
            sohieu = (
                <Text style={[DetailSignDocStyle.listItemSubTitleContainer, { color: Colors.RED_PANTONE_186C }]}>
                    Không rõ
                </Text>
            );
        }


        return (
            <View style={DetailSignDocStyle.container}>
                <ScrollView>
                    <List containerStyle={DetailSignDocStyle.listContainer}>
                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    LOẠI VĂN BẢN
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.props.info.STR_LOAIVANBAN}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    LĨNH VỰC
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.props.info.STR_LINHVUCVANBAN}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    TRÍCH YẾU
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.props.info.TRICHYEU}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    NGÀY TẠO
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {convertDateToString(this.state.info.CREATED_AT)}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    SỐ HIỆU
                                </Text>
                            }
                            subtitle={
                                sohieu
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    NGÀY VĂN BẢN
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {convertDateToString(this.state.info.NGAYVANBAN)}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    NGÀY BAN HÀNH
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {convertDateToString(this.state.info.NGAYBANHANH)}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    NGÀY HIỆU LỰC
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {convertDateToString(this.state.info.NGAYCOHIEULUC)}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    NGÀY HẾT HIỆU LỰC
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {convertDateToString(this.state.info.NGAYHETHIEULUC)}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    ĐỘ KHẨN
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.props.info.STR_DOKHAN}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    SỐ BẢN
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.SOBANSAO || 'N/A'}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    NGƯỜI KÝ
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.props.info.STR_NGUOIKY || 'N/A'}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    CHỨC VỤ NGƯỜI KÝ
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.CHUCVU}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    NỘI DUNG VĂN BẢN
                                </Text>
                            }
                            subtitle={
                                <HTMLView
                                    value={this.state.info.NOIDUNG}
                                    stylesheet={{ p: DetailSignDocStyle.listItemSubTitleContainer }}
                                />
                            } />
                    </List>
                </ScrollView>
            </View>
        );
    }
}