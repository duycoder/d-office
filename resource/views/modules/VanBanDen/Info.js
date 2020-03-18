/**
 * @description: thông tin chính văn bản xử lý
 * @author: duynn
 * @since: 09/05/2018
 */
import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'

//lib
import { List } from 'react-native-elements';
import { connect } from 'react-redux';

//common
import { convertDateToString, _readableFormat } from '../../../common/Utilities';
import { Colors, API_URL } from '../../../common/SystemConstant';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';
import { InfoStyle } from '../../../assets/styles';
import AttachmentItem from '../../common/DetailCommon/AttachmentItem';
import { InfoListItem } from '../../common/DetailCommon';

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
    const { info } = this.state;

    let congtacTime = "";
    if (info.hasOwnProperty("GIO_CONGTAC") && info.hasOwnProperty("PHUT_CONGTAC")) {
      congtacTime = `${_readableFormat(info.GIO_CONGTAC)}:${_readableFormat(info.PHUT_CONGTAC)}`
    }

    let sohieu = (
      <Text style={InfoStyle.listItemSubTitleContainer}>
        {info.SOHIEU}
      </Text>
    );
    if (info.SOHIEU === null) {
      sohieu = (
        <Text style={[InfoStyle.listItemSubTitleContainer, { color: Colors.RED_PANTONE_186C }]}>
          Không rõ
        </Text>
      );
    }

    let trungLichHop = (
      <Text style={InfoStyle.listItemSubTitleContainer}>KHÔNG</Text>
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
                height: moderateScale(28, 0.82),
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

    return (
      <View style={InfoStyle.container}>
        <ScrollView>
          <List containerStyle={InfoStyle.listContainer}>
            <AttachmentItem data={this.state.ListTaiLieu} />

            <InfoListItem
              titleText='Trích yếu'
              subtitleText={this.state.info.TRICHYEU}
            />
            <InfoListItem
              titleText='Số hiệu'
              subtitleText={sohieu}
            />
            <InfoListItem
              titleText='Sổ đi theo số'
              subtitleText={this.state.info.SODITHEOSO}
            />
            <InfoListItem
              isRender={!!this.props.info.nameOfDonViGui}
              titleText='Đơn vị gửi'
              subtitleText={this.props.info.nameOfDonViGui}
            />
            <InfoListItem
              titleText='Loại văn bản'
              subtitleText={this.props.info.nameOfLoaiVanBan}
            />
            <InfoListItem
              titleText='Lĩnh vực'
              subtitleText={this.props.info.nameOfLinhVucVanBan}
            />
            <InfoListItem
              titleText='Mức độ quan trọng'
              subtitleText={this.props.info.nameOfDoKhan}
            />
            <InfoListItem
              titleText='Độ ưu tiên'
              subtitleText={this.props.info.nameOfDoUuTien}
            />
            <InfoListItem
              titleText='Số trang'
              subtitleText={this.state.info.SOTRANG}
            />
            <InfoListItem
              isRender={!!this.state.info.NGAY_HIEULUC}
              titleText='Ngày có hiệu lực'
              subtitleText={convertDateToString(this.state.info.NGAY_HIEULUC)}
            />
            <InfoListItem
              isRender={!!this.state.info.NGAYHET_HIEULUC}
              titleText='Ngày hết hiệu lực'
              subtitleText={convertDateToString(this.state.info.NGAYHET_HIEULUC)}
            />
            <InfoListItem
              isRender={!!this.state.info.NGAYHET_HIEULUC}
              titleText='Ngày hết hiệu lực'
              subtitleText={convertDateToString(this.state.info.NGAYHET_HIEULUC)}
            />
            <InfoListItem
              isRender={!!this.state.info.NGAY_VANBAN}
              titleText='Ngày văn bản'
              subtitleText={convertDateToString(this.state.info.NGAY_VANBAN)}
            />
            <InfoListItem
              isRender={!!this.state.info.NGAY_BANHANH}
              titleText='Ngày ban hành'
              subtitleText={convertDateToString(this.state.info.NGAY_BANHANH)}
            />
            <InfoListItem
              isRender={!!this.state.info.NGUOIKY}
              titleText='Người ký'
              subtitleText={`${this.state.info.CHUCVU || ""} ${this.state.info.NGUOIKY}`}
            />
            <InfoListItem
              isRender={!!this.state.info.NOIDUNG}
              titleText='Nội dung văn bản'
              subtitleText={this.state.info.NOIDUNG}
              customSubtitleNumberOfLines={0}
            />
            <InfoListItem
              isRender={this.state.info.hasOwnProperty("NGAYCONGTAC") && this.state.info.NGAYCONGTAC}
              titleText='Thời gian công tác'
              subtitleText={`${convertDateToString(this.state.info.NGAYCONGTAC)} lúc ${congtacTime}`}
            />
            <InfoListItem
              titleText='Trùng lịch công tác lãnh đạo'
              subtitleText={trungLichHop}
            />

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