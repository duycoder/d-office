/**
 * @description: thông tin chính văn bản xử lý
 * @author: duynn
 * @since: 09/05/2018
 */
import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'

//lib
import { List, ListItem } from 'react-native-elements';
import HTMLView from 'react-native-htmlview';
import { connect } from 'react-redux';
//styles
import { DetailPublishDocStyle } from '../../../assets/styles/PublishDocStyle';

//common
import { convertDateToString, _readableFormat, appStoreDataAndNavigate } from '../../../common/Utilities';
import { Colors, EMPTY_STRING, API_URL } from '../../../common/SystemConstant';

class MainInfoPublishDoc extends Component {

    constructor(props) {
        super(props);

        this.state = {
            info: this.props.info.entityVanBanDen,
            loading: false,
            events: null,
            hasAuthorization: props.hasAuthorization || 0
        };
    }

    componentWillMount = () => {
        this.fetchData();
    }

    fetchData = async () => {
        const { NGAYCONGTAC } = this.state.info;
        if (NGAYCONGTAC !== null) {
            this.setState({
                loading: true
            })
            const date = convertDateToString(NGAYCONGTAC);
            const dateSplit = date.split("/");
            const day = dateSplit[0];
            const month = dateSplit[1];
            const year = dateSplit[2];

            const url = `${API_URL}/api/LichCongTac/GetLichCongTacNgay/${this.props.userInfo.ID}/${month}/${year}/${day}`;

            const result = await fetch(url)
                .then((response) => response.json());
            this.setState({
                loading: false,
                events: result
            })
        }
    }

    getDetailEvent = () => {
        let eventId = 0;
        if (this.state.events) {
            eventId = this.state.events.ID;            
        }
        this.props.navigateToEvent(eventId);
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

        let trungLichHop = null;
        if (!this.props.info.isDuplicateCalendar) {
            trungLichHop = (
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: Colors.RED_PANTONE_186C }}>CÓ</Text>
                    </View>
                    {
                        this.state.hasAuthorization === 0 &&
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={{
                                backgroundColor: Colors.RED_PANTONE_186C,
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 30,
                                borderRadius: 5
                            }}
                                onPress={() => this.getDetailEvent()}>
                                <Text style={{ color: Colors.WHITE, fontWeight: 'bold' }}>
                                    CHI TIẾT
                            </Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            )
        } else {
            trungLichHop = (
                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>KHÔNG</Text>
            )
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
                                    TRÙNG LỊCH CÔNG TÁC LÃNH ĐẠO
                                </Text>
                            }
                            subtitle={trungLichHop} />

                    </List>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userState.userInfo
    }
}

export default connect(mapStateToProps)(MainInfoPublishDoc);