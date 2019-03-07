/**
 * @description: lịch sử xử lý văn bản trình ký
 * @author: duynn
 * @since: 04/05/2018
 */
'use strict'
import React, { Component } from 'react';

import { View, Text, RefreshControl, FlatList, StyleSheet } from 'react-native';

//lib
import { Container, Header, Content, Icon } from 'native-base';
import { Icon as RNEIcon } from 'react-native-elements';
import * as util from 'lodash';
import renderIf from 'render-if';
import HTMLView from 'react-native-htmlview';

//utilities
import { convertDateTimeToString, emptyDataPage, convertTimeToString, convertDateToString } from '../../../common/Utilities';
import { LOADER_COLOR, Colors } from '../../../common/SystemConstant';
import { verticalScale, moderateScale, scale } from '../../../assets/styles/ScaleIndicator';
import { HistoryStyle, TimeLineStyle } from '../../../assets/styles/HistoryStyle';

export default class TimelineSignDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: props.info.lstLog
        }
    }

    keyExtractor = (item, index) => item.ID.toString()

    renderItem = ({ item }) => {
        let identifyBackground = TimeLineStyle.initState;
        let identifyColor = TimeLineStyle.initStateText;
        let iconName = 'plus-circle-outline';
        let stepName = 'KHỞI TẠO'
        let message = 'KHỞI TẠO'
        if (item.step != null) {
            message = item.MESSAGE;
            if (item.IS_RETURN) {
                identifyBackground = TimeLineStyle.backState;
                identifyColor = TimeLineStyle.backStateText;
                iconName = 'arrow-left-drop-circle-outline';
                stepName = 'TRẢ VỀ';
            } else {
                identifyBackground = TimeLineStyle.fowardState;
                identifyColor = TimeLineStyle.fowardStateText;
                iconName = 'arrow-right-drop-circle-outline';
                stepName = util.toUpper(item.step.NAME);
            }
        }
        return (
            <View style={TimeLineStyle.container}>
                <View style={TimeLineStyle.timeSection}>
                    <Text style={TimeLineStyle.timeSectionDate}>
                        {convertDateToString(item.create_at)}
                    </Text>
                    <Text style={TimeLineStyle.timeSectionHour}>
                        {convertTimeToString(item.create_at)}
                    </Text>
                </View>

                <View style={TimeLineStyle.iconSection}>
                    <View style={[TimeLineStyle.iconCircle, identifyBackground]}>
                        <RNEIcon name={iconName} color={Colors.WHITE} type="material-community" size={moderateScale(20, 0.9)} />
                    </View>

                    <View style={[TimeLineStyle.iconLine, identifyBackground]}>
                    </View>
                </View>

                <View style={TimeLineStyle.infoSection}>
                    <View style={TimeLineStyle.infoHeader}>
                        <Text style={[TimeLineStyle.infoText, identifyColor]}>
                            {stepName}
                        </Text>
                    </View>
                    <View style={TimeLineStyle.infoDetail}>
                        <View style={TimeLineStyle.infoDetailRow}>
                            <View style={TimeLineStyle.infoDetailLabel}>
                                <Text style={TimeLineStyle.infoDetailLabelText}>
                                    Người xử lý
                                </Text>
                            </View>

                            <View style={TimeLineStyle.infoDetailValue}>
                                <Text style={TimeLineStyle.infoDetailValueText}>
                                    {item.TenNguoiXuLy}
                                </Text>
                            </View>
                        </View>

                        {
                            renderIf(item.step != null)(
                                <View>
                                    <View style={TimeLineStyle.infoDetailRow}>
                                        <View style={TimeLineStyle.infoDetailLabel}>
                                            <Text style={TimeLineStyle.infoDetailLabelText}>
                                                Người nhận
                                            </Text>
                                        </View>

                                        <View style={TimeLineStyle.infoDetailValue}>
                                            <Text style={TimeLineStyle.infoDetailValueText}>
                                                {item.TenNguoiNhan} {renderIf(item.IsDaNhan)(<Text style={TimeLineStyle.infoDetailValueNote}>(Đã nhận)</Text>)}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    <View style={TimeLineStyle.infoDetailRow}>
                                        <View style={TimeLineStyle.infoDetailLabel}>
                                            <Text style={TimeLineStyle.infoDetailLabelText}>
                                                Người tham gia
                                            </Text>
                                        </View>

                                        <View style={TimeLineStyle.infoDetailValue}>
                                            {
                                                item.LstThamGia.map((name, index) => (
                                                    <Text style={TimeLineStyle.infoDetailValueText} key={index.toString()}>
                                                        - {name}
                                                    </Text>
                                                ))
                                            }
                                        </View>
                                    </View>
                                </View>
                            )
                        }
                        <View style={TimeLineStyle.infoDetailRow}>
                            <View style={TimeLineStyle.infoDetailLabel}>
                                <Text style={TimeLineStyle.infoDetailLabelText}>
                                    Nội dung
                                </Text>
                            </View>

                            <View style={TimeLineStyle.infoDetailValue}>
                                <Text style={TimeLineStyle.infoDetailValueText}>
                                    {message}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <Container>
                <Content>
                    <FlatList
                        data={this.state.logs}
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtractor}
                        ListEmptyComponent={emptyDataPage}
                    />
                </Content>
            </Container>
        );
    }
}