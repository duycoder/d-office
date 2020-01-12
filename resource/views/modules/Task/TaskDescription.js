/*
* @description: mô tả công việc
* @author: duynn
* @since: 12/05/2018
*/

'use strict'
import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';

//common
import { convertDateToString, asyncDelay, formatLongText, convertDateTimeToTitle, extention, convertTimeToString, onDownloadFile } from '../../../common/Utilities';

import { DetailTaskStyle } from '../../../assets/styles/TaskStyle';
import * as util from 'lodash';

import HTMLView from 'react-native-htmlview';
import { API_URL, Colors, HTML_STRIP_PATTERN } from '../../../common/SystemConstant';

//redux
import * as navAction from '../../../redux/modules/Nav/Action';
import { getFileExtensionLogo, getFileSize } from '../../../common/Effect';
import { verticalScale } from '../../../assets/styles/ScaleIndicator';
import AttachmentItem from '../../common/AttachmentItem';
import { InfoStyle } from '../../../assets/styles';

export default class TaskDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docInfo: null,
            isArrivedDoc: false,
            attachments: null,

            userId: props.userId,
            fromBrief: props.fromBrief || false
        }
    }

    componentWillMount() {
        const { VANBANDEN_ID, VANBANDI_ID } = this.props.info.CongViec;
        if (VANBANDEN_ID !== null) {
            this.fetchData(VANBANDEN_ID, true);

        }
        if (VANBANDI_ID !== null) {
            this.fetchData(VANBANDI_ID);
        }
    }

    getDetailParent = (screenName, targetScreenParams) => {
        if (!this.state.fromBrief) {
            this.props.navigateToDetailDoc(screenName, targetScreenParams);
        }
    }

    fetchData = async (docId, isArrived = false) => {
        let url = `${API_URL}/api/VanBanDi/GetDetail/${docId}/${this.state.userId}/0`;

        if (isArrived) {
            url = `${API_URL}/api/VanBanDen/GetDetail/${docId}/${this.state.userId}/0`;
        }


        const result = await fetch(url);
        const resultJson = await result.json();

        await asyncDelay();

        this.setState({
            docInfo: resultJson,
            isArrivedDoc: isArrived
        });
    }
    fetchAttachment = async () => {
        const url = `${API_URL}/api/HscvCongViec/SearchAttachment?id=${this.state.CongViec.ID}&attQuery=`;
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        })

        const result = await fetch(url, {
            method: 'POST',
            headers
        });
        const resultJson = await result.json();

        this.setState({
            attachments: resultJson
        });
    }

    render() {
        let relateDoc;
        if (this.state.docInfo) {
            if (this.state.isArrivedDoc) {
                if (this.state.docInfo.hasOwnProperty("entityVanBanDen")) {
                    const { SOHIEU, TRICHYEU, NGUOIKY, ID } = this.state.docInfo.entityVanBanDen;
                    relateDoc = (
                        <ListItem
                            style={InfoStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={InfoStyle.listItemTitleContainer}>
                                    Văn bản đến liên quan
                                </Text>
                            }
                            subtitle={
                                <Text style={[InfoStyle.listItemSubTitleContainer, { color: this.state.fromBrief ? '#777' : '#262626' }]}>
                                    <Text>{`Số hiệu: ${SOHIEU}` + "\n"}</Text>
                                    <Text>{`Trích yếu: ${formatLongText(TRICHYEU, 50)}` + "\n"}</Text>
                                    <Text>{`Người ký: ${NGUOIKY}`}</Text>
                                </Text>
                            }
                            onPress={
                                () => this.getDetailParent("VanBanDenDetailScreen", { docId: ID, docType: 1, from: "detail" })
                            }
                            containerStyle={{ backgroundColor: this.state.fromBrief ? 'transparent' : 'rgba(189,198,207, 0.6)' }}
                        />
                    );
                }
            }
            else {
                if (this.state.docInfo.hasOwnProperty("VanBanTrinhKy")) {
                    const { TRICHYEU, ID } = this.state.docInfo.VanBanTrinhKy,
                        { STR_DOKHAN, STR_NGUOIKY, STR_DOUUTIEN } = this.state.docInfo;
                    relateDoc = (
                        <ListItem
                            style={InfoStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={InfoStyle.listItemTitleContainer}>
                                    Văn bản đi liên quan
                            </Text>
                            }
                            subtitle={
                                <Text style={[InfoStyle.listItemSubTitleContainer, { color: '#262626' }]}>
                                    <Text>{`Trích yếu: ${formatLongText(TRICHYEU, 50)}` + "\n"}</Text>
                                    <Text>{`Người ký: ${STR_NGUOIKY}` + "\n"}</Text>
                                    <Text>{`Độ khẩn: ${STR_DOKHAN}`}</Text>
                                </Text>
                            }
                            onPress={
                                () => this.getDetailParent("VanBanDiDetailScreen", { docId: ID, docType: 1, from: "detail" })
                            }
                            containerStyle={{ backgroundColor: this.state.fromBrief ? 'transparent' : 'rgba(189,198,207, 0.6)' }}
                        />
                    );
                }
            }
        }

        let ListThamgiaStr = (this.props.info.LstNguoiThamGia && this.props.info.LstNguoiThamGia.length > 0)
            ? this.props.info.LstNguoiThamGia.split(",").map(name => `- ${name}`).join("\n")
            : "N/A";

        return (
            <View style={InfoStyle.container}>
                <ScrollView>
                    <List containerStyle={InfoStyle.listContainer}>
                        {
                            this.state.docInfo && relateDoc
                        }

                        <AttachmentItem data={this.state.attachments} />

                        <ListItem style={InfoStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={InfoStyle.listItemTitleContainer}>
                                    Tên công việc
                                </Text>
                            }
                            subtitle={
                                <Text style={InfoStyle.listItemSubTitleContainer}>
                                    {this.props.info.CongViec.TENCONGVIEC}
                                </Text>
                            } />

                        <ListItem style={InfoStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={InfoStyle.listItemTitleContainer}>
                                    Ngày hoàn thành mong muốn
                                </Text>
                            }
                            subtitle={
                                <Text style={InfoStyle.listItemSubTitleContainer}>
                                    {convertDateToString(this.props.info.CongViec.NGAYHOANTHANH_THEOMONGMUON)}
                                </Text>
                            } />

                        <ListItem style={InfoStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={InfoStyle.listItemTitleContainer}>
                                    Người giao việc
                                </Text>
                            }
                            subtitle={
                                <Text style={InfoStyle.listItemSubTitleContainer}>
                                    {this.props.info.NGUOIGIAOVIEC}
                                </Text>
                            } />

                        <ListItem style={InfoStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={InfoStyle.listItemTitleContainer}>
                                    Người xử lý chính
                                </Text>
                            }
                            subtitle={
                                <Text style={InfoStyle.listItemSubTitleContainer}>
                                    {util.isEmpty(this.props.info.NGUOIXULYCHINH) ? "Chưa giao việc" : this.props.info.NGUOIXULYCHINH}
                                </Text>
                            } />
                        {
                            this.props.info.LstNguoiThamGia && this.props.info.LstNguoiThamGia.length > 0 && <ListItem style={InfoStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={InfoStyle.listItemTitleContainer}>
                                        Người tham gia
                                    </Text>
                                }
                                subtitle={
                                    <Text style={InfoStyle.listItemSubTitleContainer}>
                                        {
                                            ListThamgiaStr
                                            // util.isNull(this.props.info.LstNguoiThamGia) || util.isEmpty(this.props.info.LstNguoiThamGia) ? 'N/A' : this.props.info.LstNguoiThamGia.toString()
                                        }
                                    </Text>
                                } />
                        }

                        <ListItem style={InfoStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={InfoStyle.listItemTitleContainer}>
                                    Nội dung công việc
                                </Text>
                            }
                            subtitle={
                                (!!this.props.info.CongViec.NOIDUNGCONGVIEC && this.props.info.CongViec.NOIDUNGCONGVIEC.match(HTML_STRIP_PATTERN))
                                    ? <HTMLView
                                        value={this.props.info.CongViec.NOIDUNGCONGVIEC}
                                        stylesheet={{ p: InfoStyle.listItemSubTitleContainer }}
                                    />
                                    : <Text style={InfoStyle.listItemSubTitleContainer}>{this.props.info.CongViec.NOIDUNGCONGVIEC}</Text>
                            } />

                        {
                            // <ListItem style={InfoStyle.listItemContainer}
                            //     hideChevron={true}
                            //     title={
                            //         <Text style={InfoStyle.listItemTitleContainer}>
                            //             SỐ NGÀY NHẮC VIỆC TRƯỚC HẠN
                            //     </Text>
                            //     }
                            //     subtitle={
                            //         <Text style={InfoStyle.listItemSubTitleContainer}>
                            //             {this.props.info.CongViec.SONGAYNHACTRUOCHAN || "Không thiết lập"}
                            //         </Text>
                            //     } />
                            // <ListItem style={InfoStyle.listItemContainer}
                            //     hideChevron={true}
                            //     title={
                            //         <Text style={InfoStyle.listItemTitleContainer}>
                            //             NHẮC VIỆC BẰNG EMAIL
                            //     </Text>
                            //     }
                            //     subtitle={
                            //         <Text style={InfoStyle.listItemSubTitleContainer}>
                            //             {this.props.info.CongViec.IS_EMAIL ? 'Có' : 'Không'}
                            //         </Text>
                            //     } />
                            // <ListItem style={InfoStyle.listItemContainer}
                            //     hideChevron={true}
                            //     title={
                            //         <Text style={InfoStyle.listItemTitleContainer}>
                            //             NHẮC VIỆC BẰNG SMS
                            //     </Text>
                            //     }
                            //     subtitle={
                            //         <Text style={InfoStyle.listItemSubTitleContainer}>
                            //             {this.props.info.CongViec.IS_SMS ? 'Có' : 'Không'}
                            //         </Text>
                            //     } />
                            // <ListItem style={InfoStyle.listItemContainer}
                            //     hideChevron={true}
                            //     title={
                            //         <Text style={InfoStyle.listItemTitleContainer}>
                            //             NHẮC VIỆC BẰNG TIN THÔNG BÁO
                            //     </Text>
                            //     }
                            //     subtitle={
                            //         <Text style={InfoStyle.listItemSubTitleContainer}>
                            //             {this.props.info.CongViec.IS_POPUP ? 'Có' : 'Không'}
                            //         </Text>
                            //     } />
                        }


                        {
                            // this.props.info.CongViec.IS_HASPLAN &&
                            // <ListItem style={InfoStyle.listItemContainer}
                            //     hideChevron={true}
                            //     title={
                            //         <Text style={InfoStyle.listItemTitleContainer}>
                            //             NGÀY HOÀN THÀNH THEO KẾ HOẠCH
                            //         </Text>
                            //     }
                            //     subtitle={
                            //         <Text style={InfoStyle.listItemSubTitleContainer}>
                            //             {util.isNull(this.props.info.CongViec.NGAYKETTHUC_KEHOACH) ? "Chưa duyệt kế hoạch" : convertDateToString(this.props.info.CongViec.NGAYKETTHUC_KEHOACH)}
                            //         </Text>
                            //     }
                            // />
                        }

                        <ListItem style={InfoStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={InfoStyle.listItemTitleContainer}>
                                    Độ ưu tiên
                                </Text>
                            }
                            subtitle={
                                <Text style={InfoStyle.listItemSubTitleContainer}>
                                    {this.props.info.DOUUTIEN}
                                </Text>
                            } />

                        <ListItem style={InfoStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={InfoStyle.listItemTitleContainer}>
                                    Mức độ quan trọng
                                </Text>
                            }
                            subtitle={
                                <Text style={InfoStyle.listItemSubTitleContainer}>
                                    {this.props.info.DOKHAN}
                                </Text>
                            } />
                        <ListItem style={InfoStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={InfoStyle.listItemTitleContainer}>
                                    Trạng thái
                                </Text>
                            }
                            subtitle={
                                <Text style={InfoStyle.listItemSubTitleContainer}>
                                    {this.props.info.CongViec.PHANTRAMHOANTHANH === 100 ? `Đã hoàn thành vào ${convertDateTimeToTitle(this.props.info.CongViec.NGAYKETTHUC_THUCTE)}` : "Đang thực hiện"}
                                </Text>
                            } />

                    </List>
                </ScrollView>
            </View>
        );
    }
}