/**
 * @description: thông tin chính văn bản xử lý
 * @author: duynn
 * @since: 09/05/2018
 */
import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'

//lib
import { List, ListItem } from 'react-native-elements'
import _ from 'lodash';
import HTMLView from 'react-native-htmlview';
//styles
import { DetailPublishDocStyle } from '../../../assets/styles/PublishDocStyle';

//common
import { convertDateToString } from '../../../common/Utilities';

export default class MainInfoPublishDoc extends Component {

    constructor(props) {
        super(props)

        this.state = {
            info: props.info
        }
    }


    render() {
        return (
            <View style={DetailPublishDocStyle.container}>
                <ScrollView>
                    <List containerStyle={DetailPublishDocStyle.listContainer}>
                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    SỐ/ KÝ HIỆU
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.SOHIEU}
                                </Text>
                            } />

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    SỐ TRANG
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.SOTRANG}
                                </Text>
                            } />

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    LOẠI VĂN BẢN
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.TEN_HINHTHUC}
                                </Text>
                            } />

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    LĨNH VỰC
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.TEN_LINHVUC}
                                </Text>
                            } />

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    ĐỘ KHẨN
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.TEN_DOKHAN}
                                </Text>
                            } />

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    ĐỘ MẬT
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.TEN_DOMAT}
                                </Text>
                            } />

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    NGÀY CÓ HIỆU LỰC
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {convertDateToString(this.state.info.NGAY_HIEULUC)}
                                </Text>
                            } />

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    NGÀY HẾT HIỆU LỰC
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {convertDateToString(this.state.info.NGAYHET_HIEULUC)}
                                </Text>
                            } />

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    NGÀY VĂN BẢN
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {convertDateToString(this.state.info.NGAY_VANBAN)}
                                </Text>
                            } />
                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    NGÀY BAN HÀNH
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {convertDateToString(this.state.info.NGAY_BANHANH)}
                                </Text>
                            } />
                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    NGƯỜI KÝ
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.NGUOIKY}
                                </Text>
                            } />
                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    CHỨC VỤ
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.CHUCVU}
                                </Text>
                            } />
                    </List>
                </ScrollView>
            </View>
        );
    }
}