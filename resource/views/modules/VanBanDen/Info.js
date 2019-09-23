/**
 * @description: thông tin chính văn bản xử lý
 * @author: duynn
 * @since: 09/05/2018
 */
import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'

//lib
import { List, ListItem, Icon } from 'react-native-elements';
import HTMLView from 'react-native-htmlview';
import { connect } from 'react-redux';
//styles
import { DetailPublishDocStyle } from '../../../assets/styles/PublishDocStyle';

//common
import { convertDateToString, _readableFormat, appStoreDataAndNavigate, extention, convertTimeToString, onDownloadFile } from '../../../common/Utilities';
import { Colors, EMPTY_STRING, API_URL } from '../../../common/SystemConstant';
import { getFileExtensionLogo, getFileSize } from '../../../common/Effect';
import { verticalScale } from '../../../assets/styles/ScaleIndicator';

class MainInfoPublishDoc extends Component {

    constructor(props) {
        super(props);

        this.state = {
            info: this.props.info.entityVanBanDen,
            loading: false,
            events: null,
            hasAuthorization: props.hasAuthorization || 0,
            ListTaiLieu: null,
        };
    }

    componentWillMount = () => {
        this.fetchData();
        this.fetchAttachment();
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
    fetchAttachment = async () => {
        this.setState({
            loading: true
        });
        const url = `${API_URL}/api/VanBanDen/SearchAttachment?id=${this.state.info.ID}&attQuery=`;
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        });

        const result = await fetch(url, {
            method: 'POST',
            headers
        });

        const resultJson = await result.json();

        this.setState({
            loading: false,
            ListTaiLieu: resultJson
        });
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

        let trungLichHop = (
            <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>KHÔNG</Text>
        );
        if (this.props.info.isDuplicateCalendar) {
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
        }

        // render
        return (
            <View style={DetailPublishDocStyle.container}>
                <ScrollView>
                    <List containerStyle={DetailPublishDocStyle.listContainer}>

                        {
                            this.state.ListTaiLieu && this.state.ListTaiLieu.length > 0
                                ? <ListItem style={DetailPublishDocStyle.listItemContainer}
                                    hideChevron={true}
                                    title={
                                        <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                            Đính kèm
                                        </Text>
                                    }
                                    subtitle={
                                        <View>
                                            {
                                                this.state.ListTaiLieu.map((item, index) => {
                                                    let regExtension = extention(item.DUONGDAN_FILE);
                                                    let extension = regExtension ? regExtension[0] : "";
                                                    return (
                                                        <ListItem
                                                            key={index.toString()}
                                                            leftIcon={getFileExtensionLogo(extension)}
                                                            title={item.TENTAILIEU}
                                                            titleStyle={{
                                                                marginLeft: 10,
                                                                color: '#707070',
                                                                fontWeight: 'bold'
                                                            }}
                                                            subtitle={
                                                                getFileSize(item.KICHCO) + " | " + convertDateToString(item.NGAYTAO) + " " + convertTimeToString(item.NGAYTAO)
                                                            }
                                                            subtitleStyle={{
                                                                fontWeight: 'normal',
                                                                color: '#707070',
                                                                marginLeft: 10,
                                                            }}
                                                            rightIcon={
                                                                <Icon name='download' color={Colors.GREEN_PANTON_369C} size={verticalScale(25)} type='entypo' />
                                                            }
                                                            containerStyle={{ borderBottomWidth: 0 }}
                                                            onPress={() => onDownloadFile(item.TENTAILIEU, item.DUONGDAN_FILE, item.DINHDANG_FILE)}
                                                        />
                                                    );
                                                })
                                            }
                                        </View>
                                    }
                                />
                                : null
                        }

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    Trích yếu
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
                                    Số hiệu
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
                                    Sổ đi theo số
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
                                    Đơn vị gửi
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
                                    Loại văn bản
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
                                    Lĩnh vực
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
                                    Mức độ quan trọng
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
                                    Độ ưu tiên
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
                                    Số trang
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.SOTRANG}
                                </Text>
                            } />


                        {
                            this.state.info.NGAY_HIEULUC && <ListItem style={DetailPublishDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                        Ngày có hiệu lực
                                </Text>
                                }
                                subtitle={
                                    <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                        {convertDateToString(this.state.info.NGAY_HIEULUC)}
                                    </Text>
                                } />
                        }

                        {
                            this.state.info.NGAYHET_HIEULUC && <ListItem style={DetailPublishDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                        Ngày hết hiệu lực
                                    </Text>
                                }
                                subtitle={
                                    <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                        {convertDateToString(this.state.info.NGAYHET_HIEULUC)}
                                    </Text>
                                } />
                        }
                        {
                            this.state.info.NGAYHET_HIEULUC && <ListItem style={DetailPublishDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                        Ngày hết hiệu lực
                                </Text>
                                }
                                subtitle={
                                    <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                        {convertDateToString(this.state.info.NGAYHET_HIEULUC)}
                                    </Text>
                                } />
                        }
                        {
                            this.state.info.NGAY_VANBAN && <ListItem style={DetailPublishDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                        Ngày văn bản
                                </Text>
                                }
                                subtitle={
                                    <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                        {convertDateToString(this.state.info.NGAY_VANBAN)}
                                    </Text>
                                } />
                        }
                        {
                            this.state.info.NGAY_BANHANH && <ListItem style={DetailPublishDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                        Ngày ban hành
                                </Text>
                                }
                                subtitle={
                                    <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                        {convertDateToString(this.state.info.NGAY_BANHANH)}
                                    </Text>
                                } />
                        }
                        {
                            (this.state.info.NGUOIKY && this.state.info.NGUOIKY.length > 0) && <ListItem style={DetailPublishDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                        Người ký
                                </Text>
                                }
                                subtitle={
                                    <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                                        {`${this.state.info.CHUCVU || ""} ${this.state.info.NGUOIKY}`}
                                    </Text>
                                } />
                        }

                        <ListItem style={DetailPublishDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                    Nội dung
                                </Text>
                            }
                            subtitle={
                                <HTMLView
                                    value={this.state.info.NOIDUNG || EMPTY_STRING}
                                    stylesheet={{ p: DetailPublishDocStyle.listItemSubTitleContainer }}
                                />
                            } />
                        {
                            this.state.info.hasOwnProperty("NGAYCONGTAC") && <ListItem style={DetailPublishDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                                        Thời gian công tác
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
                                    Trùng lịch công tác lãnh đạo
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