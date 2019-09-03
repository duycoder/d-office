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
import { convertDateToString, asyncDelay, formatLongText } from '../../../common/Utilities';
import { Colors, API_URL } from '../../../common/SystemConstant';

export default class MainInfoSignDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: props.info.VanBanTrinhKy,
            userId: props.userId,
            docInfo: null,
            fromBrief: props.fromBrief
        }
    }

    componentWillMount() {
        const { VANBANDEN_ID } = this.props.info.VanBanTrinhKy;
        if (VANBANDEN_ID !== null) {
            this.fetchData(VANBANDEN_ID);

        }
    }

    fetchData = async (docId) => {
        const url = `${API_URL}/api/VanBanDen/GetDetail/${docId}/${this.state.userId}/0`;

        const result = await fetch(url);
        const resultJson = await result.json();

        await asyncDelay(2000);

        this.setState({
            docInfo: resultJson,
        });
    }

    getDetailDoc = (screenName, targetScreenParams) => {
        if (!this.state.fromBrief) {
            this.props.navigateToDetailDoc(screenName, targetScreenParams);
        }
    }

    render() {
        let relateDoc;
        if (this.state.docInfo && this.state.docInfo.hasOwnProperty("entityVanBanDen")) {
            const { SOHIEU, TRICHYEU, NGUOIKY, ID } = this.state.docInfo.entityVanBanDen;
            relateDoc = (
                <ListItem
                    style={DetailSignDocStyle.listItemContainer}
                    hideChevron={true}
                    title={
                        <Text style={DetailSignDocStyle.listItemTitleContainer}>
                            VĂN BẢN ĐẾN LIÊN QUAN
                        </Text>
                    }
                    subtitle={
                        <Text style={[DetailSignDocStyle.listItemSubTitleContainer, { color: this.state.fromBrief ? '#777' : '#262626' }]}>
                            <Text>{`Số hiệu: ${SOHIEU}` + "\n"}</Text>
                            <Text>{`Trích yếu: ${formatLongText(TRICHYEU, 50)}` + "\n"}</Text>
                            <Text>{`Người ký: ${NGUOIKY}`}</Text>
                        </Text>
                    }
                    onPress={
                        () => this.getDetailDoc("VanBanDenDetailScreen", { docId: ID, docType: 1, from: 'detail' })
                    }
                    containerStyle={{ backgroundColor: !this.state.fromBrief ? 'rgba(189,198,207, 0.6)' : Colors.WHITE }}
                />
            );
        }
        return (
            <View style={DetailSignDocStyle.container}>
                <ScrollView>
                    <List containerStyle={DetailSignDocStyle.listContainer}>
                        {
                            this.state.docInfo && relateDoc
                        }
                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    TRÍCH YẾU
                            </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.TRICHYEU}
                                </Text>
                            } />

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
                                    MỨC ĐỘ QUAN TRỌNG
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.props.info.STR_DOKHAN}
                                </Text>
                            } />



                        {
                            this.state.info.NGAYVANBAN && <ListItem style={DetailSignDocStyle.listItemContainer}
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
                        }

                        {
                            this.state.info.NGAYBANHANH && <ListItem style={DetailSignDocStyle.listItemContainer}
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
                        }

                        {
                            this.state.info.NGAYCOHIEULUC && <ListItem style={DetailSignDocStyle.listItemContainer}
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
                        }

                        {
                            this.state.info.NGAYHETHIEULUC && <ListItem style={DetailSignDocStyle.listItemContainer}
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
                        }

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

                        {
                            this.props.info.STR_NGUOIKY && <ListItem style={DetailSignDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                        NGƯỜI KÝ
                                    </Text>
                                }
                                subtitle={
                                    <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                        {`${this.state.info.CHUCVU || ""} ${this.props.info.STR_NGUOIKY}`}
                                    </Text>
                                } />
                        }

                        {
                            this.state.info.NOIDUNG && <ListItem style={DetailSignDocStyle.listItemContainer}
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
                        }

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

                    </List>
                </ScrollView>
            </View>
        );
    }
}