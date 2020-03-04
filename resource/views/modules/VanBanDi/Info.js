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
//common
import { convertDateToString, formatLongText } from '../../../common/Utilities';
import { Colors } from '../../../common/SystemConstant';
import { InfoStyle } from '../../../assets/styles';
import AttachmentItem from '../../common/DetailCommon/AttachmentItem';
import { InfoListItem } from '../../common/DetailCommon';
import { vanbandenApi, vanbandiApi } from '../../../common/Api';

export default class MainInfoSignDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: props.info.VanBanTrinhKy,
            userId: props.userId,
            docInfo: null,
            fromBrief: props.fromBrief,
            ListTaiLieu: null
        }
    }

    componentWillMount() {
        const { VANBANDEN_ID } = this.props.info.VanBanTrinhKy;
        if (VANBANDEN_ID !== null) {
            this.fetchData(VANBANDEN_ID);
        }
        this.fetchAttachment();
    }

    fetchData = async (docId) => {
        const resultJson = await vanbandenApi().getDetail([
            docId,
            this.state.userId,
            0
        ]);

        this.setState({
            docInfo: resultJson,
        });
    }
    fetchAttachment = async () => {
        const resultJson = await vanbandiApi().getAttachment(`?id=${this.state.info.ID}&attQuery=`);

        this.setState({
            ListTaiLieu: resultJson
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
                        () => this.getDetailDoc("VanBanDenDetailScreen", { docId: ID, docType: 1, from: 'detail' })
                    }
                    containerStyle={{ backgroundColor: !this.state.fromBrief ? 'rgba(189,198,207, 0.6)' : Colors.WHITE }}
                />
            );
        }
        return (
            <View style={InfoStyle.container}>
                <ScrollView>
                    <List containerStyle={InfoStyle.listContainer}>
                        {
                            this.state.docInfo && relateDoc
                        }

                        <AttachmentItem data={this.state.ListTaiLieu} />

                        <InfoListItem
                            titleText='Trích yếu'
                            subtitleText={this.state.info.TRICHYEU}
                        />
                        <InfoListItem
                            titleText='Loại văn bản'
                            subtitleText={this.props.info.STR_LOAIVANBAN}
                        />
                        <InfoListItem
                            titleText='Lĩnh vực'
                            subtitleText={this.props.info.STR_LINHVUCVANBAN}
                        />
                        <InfoListItem
                            titleText='Mức độ quan trọng'
                            subtitleText={this.props.info.STR_DOKHAN}
                        />
                        <InfoListItem
                            isRender={!!this.state.info.NGAYVANBAN}
                            titleText='Ngày văn bản'
                            subtitleText={convertDateToString(this.state.info.NGAYVANBAN)}
                        />
                        <InfoListItem
                            isRender={!!this.state.info.NGAYBANHANH}
                            titleText='Ngày ban hành'
                            subtitleText={convertDateToString(this.state.info.NGAYBANHANH)}
                        />
                        <InfoListItem
                            isRender={!!this.state.info.NGAYCOHIEULUC}
                            titleText='Ngày hiệu lực'
                            subtitleText={convertDateToString(this.state.info.NGAYCOHIEULUC)}
                        />
                        <InfoListItem
                            isRender={!!this.state.info.NGAYHETHIEULUC}
                            titleText='Ngày hết hiệu lực'
                            subtitleText={convertDateToString(this.state.info.NGAYHETHIEULUC)}
                        />
                        <InfoListItem
                            titleText='Số bản'
                            subtitleText={this.state.info.SOBANSAO || 'N/A'}
                        />
                        <InfoListItem
                            isRender={!!this.props.info.STR_NGUOIKY}
                            titleText='Người ký'
                            subtitleText={`${this.state.info.CHUCVU || ""} ${this.props.info.STR_NGUOIKY}`}
                        />
                        <InfoListItem
                            isRender={!!this.state.info.NOIDUNG}
                            titleText='Nội dung văn bản'
                            subtitleText={this.state.info.NOIDUNG}
                        />
                        <InfoListItem
                            titleText='Ngày tạo'
                            subtitleText={convertDateToString(this.state.info.CREATED_AT)}
                        />
                    </List>
                </ScrollView>
            </View>
        );
    }
}