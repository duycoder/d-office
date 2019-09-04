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

    renderItem = ({ item, index }) => {
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
        const isStartNode = index === this.state.logs.length - 1,
            isEndNode = index === 0;
        let innerIconCircleColor = Colors.GRAY,
            outerIconCircleColor = "#eaeaea";
        if (isEndNode) {
            innerIconCircleColor = Colors.MENU_BLUE;
            outerIconCircleColor = Colors.OLD_LITE_BLUE;
        }
        return (
            <View style={TimeLineStyle.container}>
                <View style={TimeLineStyle.iconSection}>
                    <View style={[TimeLineStyle.iconCircle, { backgroundColor: outerIconCircleColor }]}>
                        {
                            // <RNEIcon name={iconName} color={Colors.WHITE} type="material-community" size={moderateScale(20, 0.9)} />
                        }
                        <View style={[TimeLineStyle.innerIconCircle, { backgroundColor: innerIconCircleColor }]} />
                    </View>
                    {
                        !isStartNode && <View style={[TimeLineStyle.iconLine]} />
                    }
                </View>

                <View style={TimeLineStyle.infoSection}>
                    <View style={TimeLineStyle.infoHeader}>
                        <Text style={TimeLineStyle.infoText}>
                            {util.capitalize(stepName)}
                        </Text>
                        <Text style={TimeLineStyle.infoTimeline}>
                            {`${convertDateToString(item.create_at)} ${convertTimeToString(item.create_at)}`}
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

                                        <View style={[TimeLineStyle.infoDetailValue, { flexDirection: 'row', alignItems: 'center' }]}>
                                            <Text style={TimeLineStyle.infoDetailValueText}>
                                                {item.TenNguoiNhan}
                                            </Text>
                                            {
                                                item.IsDaNhan && <View style={{ backgroundColor: Colors.OLD_LITE_BLUE, borderRadius: 8, padding: 8, marginLeft: 5 }}>
                                                    <Text style={{ color: Colors.WHITE, fontSize: moderateScale(10, .8) }}>Đã nhận</Text>
                                                </View>
                                            }
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
                                                item.LstThamGia.map((name) => (
                                                    <Text style={TimeLineStyle.infoDetailValueText}>
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
        );
    }

    render() {
        return (
            <Container>
                <Content contentContainerStyle={{ paddingVertical: 20 }}>
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