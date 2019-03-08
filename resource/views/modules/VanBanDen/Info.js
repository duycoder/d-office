/**
 * @description: thông tin chính văn bản xử lý
 * @author: duynn
 * @since: 09/05/2018
 */
import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'

//lib
import { List, ListItem } from 'react-native-elements'
import _ from 'lodash';
import HTMLView from 'react-native-htmlview';
//styles
import { DetailPublishDocStyle } from '../../../assets/styles/PublishDocStyle';

//common
import { convertDateToString, _readableFormat, appStoreDataAndNavigate } from '../../../common/Utilities';
import { Colors, EMPTY_STRING } from '../../../common/SystemConstant';

export default class MainInfoPublishDoc extends Component {

    constructor(props) {
        super(props);

        this.state = {
            info: this.props.info.entityVanBanDen,
            loading: false,
            events: [],
        };
    }

    componentDidMount = () => {
        this.fetchData();
    }

    fetchData = async () => {
        const { NGAYCONGTAC } = this.state.info;
        if (NGAYCONGTAC !== null) {
            this.setState({
                loading: true
            })
            const date = convertDateToString(NGAYCONGTAC);
            const day = date.split('/')[0];
            const month = date.split('/')[1];
            const year = date.split('/')[2];

            const url = `${API_URL}/api/LichCongTac/GetLichCongTacNgay/${this.props.userInfo.ID}/${month}/${year}/${day}`;

            const result = await fetch(url)
                .then((response) => response.json());

            this.setState({
                loading: false,
                events: result
            })
        }
    }

    getDetailEvent = (eventId) => {
        const targetScreenParam = {
            id: eventId
        }

        appStoreDataAndNavigate(this.props.navigator, "VanBanDenDetailScreen", new Object(), "DetailEventScreen", targetScreenParam);
    }

    render() {
        // Print out state.info
        // console.tron.log(this.state.info)
        // pre-process
        const { info, events } = this.state;

        let congtacTime = "";
        if (info.hasOwnProperty("GIO_CONGTAC") && info.hasOwnProperty("PHUT_CONGTAC")) {
            congtacTime = `${_readableFormat(info.GIO_CONGTAC)}:${_readableFormat(info.PHUT_CONGTAC)}`
        }

        let sohieu = (
            <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                {info.SOHIEU}
            </Text>
        );
        if (info.SOHIEU === null) {
            sohieu = (
                <Text style={[DetailPublishDocStyle.listItemSubTitleContainer, { color: Colors.RED_PANTONE_186C }]}>
                    Không rõ
                </Text>
            );
        }

        let trungLichHop = (
            <Text>KHÔNG</Text>
        )
        if (info.hasOwnProperty("NGAYCONGTAC") && info.NGAYCONGTAC !== null && events.length > 0) {
            let dateObj = events.filter(x => x.NGAYCONGTAC === info.NGAYCONGTAC && x.GIO_CONGTAC === info.GIO_CONGTAC && x.PHUT_CONGTAC === info.PHUT_CONGTAC);
            if (dateObj) {
                trungLichHop = (
                    <TouchableOpacity onPress={() => this.getDetailEvent(dateObj.ID)}>
                        <Text style={{ color: Colors.RED_PANTONE_186C }}>CÓ</Text>
                    </TouchableOpacity>
                )
            }
        }

        // render
        return (
            <View style={DetailPublishDocStyle.container}>
                <ScrollView>
                    <List containerStyle={DetailPublishDocStyle.listContainer}>

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    ĐƠN VỊ GỬI
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {this.props.info.nameOfDonViGui}
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
                                    {this.props.info.nameOfLoaiVanBan}
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
                                    {this.props.info.nameOfLinhVucVanBan}
                                </Text>
                            } />

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    SỐ HIỆU
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {sohieu}
                                </Text>
                            } />

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    TRÍCH YẾU
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.TRICHYEU}
                                </Text>
                            } />

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    MỨC ĐỘ QUAN TRỌNG
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {this.props.info.nameOfDoKhan}
                                </Text>
                            } />

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    ĐỘ ƯU TIÊN
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {this.props.info.nameOfDoUuTien}
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
                                    SỔ ĐI THEO SỐ
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.SODITHEOSO}
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

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    NỘI DUNG
                                </Text>
                            }
                            subtitle={
                                <HTMLView
                                    value={this.state.info.NOIDUNG || EMPTY_STRING}
                                    stylesheet={{ p: DetailPublishDocStyle.listItemSubTitleContainer }}
                                />
                            } />
                        {
                            this.state.info.hasOwnProperty("NGAYCONGTAC") &&
                            <ListItem style={DetailPublishDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                        THỜI GIAN CÔNG TÁC
                                            </Text>
                                }
                                subtitle={
                                    <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                        {convertDateToString(this.state.info.NGAYCONGTAC)} lúc {congtacTime}
                                    </Text>
                                }
                            />
                        }

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    TRÙNG LỊCH HỌP LÃNH ĐẠO
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {trungLichHop}
                                </Text>
                            } />

                    </List>
                </ScrollView>
            </View>
        );
    }
}