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
import { convertDateToString, formatLongText, convertDateTimeToTitle } from '../../../common/Utilities';

import util from 'lodash';

import { InfoStyle } from '../../../assets/styles';
import { InfoListItem, AttachmentItem } from '../../common/DetailCommon';
import { taskApi, vanbandenApi, vanbandiApi } from '../../../common/Api';

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
    const { userId } = this.state;
    let resultJson = {};
    if (isArrived) {
      resultJson = vanbandenApi().getDetail([
        docId,
        userId,
        0
      ]);
    }
    else {
      resultJson = vanbandiApi().getDetail([
        docId,
        userId,
        0
      ]);
    }

    this.setState({
      docInfo: resultJson,
      isArrivedDoc: isArrived
    });
  }
  fetchAttachment = async () => {
    const resultJson = await taskApi().getAttachment(`?id=${this.state.CongViec.ID}&attQuery=`);

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
            { STR_DOKHAN, STR_NGUOIKY } = this.state.docInfo;
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
    let ListThamgiaStr = 'N/A';
    const lstJoin = this.props.info.LstNguoiThamGia;
    if (lstJoin && lstJoin.length > 0) {
      if (util.isArray(lstJoin)) {
        if (lstJoin.length > 1) {
          ListThamgiaStr = lstJoin.map(name => `- ${name}`).join('\n');
        }
        else {
          ListThamgiaStr = lstJoin.toString();
        }
      }
      else if (util.isString(lstJoin)) {
        ListThamgiaStr = lstJoin.split(',').map(name => `- ${name}`).join('\n');
      }
    }

    return (
      <View style={InfoStyle.container}>
        <ScrollView>
          <List containerStyle={InfoStyle.listContainer}>
            {
              this.state.docInfo && relateDoc
            }

            <AttachmentItem data={this.state.attachments} />

            <InfoListItem
              titleText='Tên công việc'
              subtitleText={this.props.info.CongViec.TENCONGVIEC}
            />

            <InfoListItem
              titleText='Ngày hoàn thành mong muốn'
              subtitleText={convertDateToString(this.props.info.CongViec.NGAYHOANTHANH_THEOMONGMUON)}
            />

            <InfoListItem
              titleText='Người giao việc'
              subtitleText={this.props.info.NGUOIGIAOVIEC}
            />

            <InfoListItem
              titleText='Người xử lý chính'
              subtitleText={util.isEmpty(this.props.info.NGUOIXULYCHINH) ? "Chưa giao việc" : this.props.info.NGUOIXULYCHINH}
            />

            <InfoListItem
              isRender={this.props.info.LstNguoiThamGia && this.props.info.LstNguoiThamGia.length > 0}
              titleText='Người tham gia'
              subtitleText={ListThamgiaStr}
              customSubtitleNumberOfLines={0}
            />

            <InfoListItem
              isRender={!!this.props.info.CongViec.NOIDUNGCONGVIEC}
              titleText='Nội dung công việc'
              subtitleText={this.props.info.CongViec.NOIDUNGCONGVIEC}
              customSubtitleNumberOfLines={0}
            />

            <InfoListItem
              titleText='Độ ưu tiên'
              subtitleText={this.props.info.DOUUTIEN}
            />

            <InfoListItem
              titleText='Mức độ quan trọng'
              subtitleText={this.props.info.DOKHAN}
            />

            <InfoListItem
              titleText='Trạng thái'
              subtitleText={this.props.info.CongViec.PHANTRAMHOANTHANH === 100 ? `Đã hoàn thành vào ${convertDateTimeToTitle(this.props.info.CongViec.NGAYKETTHUC_THUCTE)}` : "Đang thực hiện"}
            />

          </List>
        </ScrollView>
      </View>
    );
  }
}