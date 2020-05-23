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
import { convertDateToString, _readableFormat, formatLongText } from '../../../common/Utilities';
import { COMMON_COLOR, EMPTY_STRING, API_URL } from '../../../common/SystemConstant';
import { getFileExtensionLogo, getFileSize } from '../../../common/Effect';
import { verticalScale } from '../../../assets/styles/ScaleIndicator';
import { DetailSignDocStyle } from '../../../assets/styles/SignDocStyle';
import { InfoStyle } from '../../../assets/styles';
import { InfoListItem } from '../../common/DetailCommon';

class RegistrationInfo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      info: this.props.info.entity,
      events: this.props.info.entityCalendar,
    };
  }

  getDetailEvent = (eventId = 0) => {
    this.props.navigateToEvent(eventId);
  }

  render() {
    const { info, events } = this.state;

    let relateCalendar = null;
    if (events) {
      const {
        NGAY_CONGTAC, GIO_CONGTAC, PHUT_CONGTAC, NOIDUNG, ID
      } = events;
      relateCalendar = (
        <ListItem
          style={InfoStyle.listItemContainer}
          hideChevron={true}
          title={
            <Text style={InfoStyle.listItemTitleContainer}>
              Lịch công tác liên quan
            </Text>
          }
          subtitle={
            <Text style={[InfoStyle.listItemSubTitleContainer]}>
              <Text>{`Thời gian: ${_readableFormat(GIO_CONGTAC)}:${_readableFormat(PHUT_CONGTAC)} - ${convertDateToString(NGAY_CONGTAC)}` + "\n"}</Text>
              <Text>{`Nội dung: ${formatLongText(NOIDUNG, 50)}` + "\n"}</Text>
            </Text>
          }
          onPress={
            () => this.getDetailEvent(ID)
          }
          containerStyle={{ backgroundColor: 'rgba(189,198,207, 0.6)' }}
        />
      );
    }

    // render
    return (
      <View style={InfoStyle.container}>
        <ScrollView>
          <List containerStyle={InfoStyle.listContainer}>
            {
              relateCalendar
            }

            <InfoListItem
              titleText='Tên cán bộ'
              subtitleText={info.TEN_CANBO}
            />
            <InfoListItem
              titleText='Mục đích'
              subtitleText={info.MUCDICH}
            />
            <InfoListItem
              titleText='Thời gian xuất phát'
              subtitleText={info.THOIGIAN_XUATPHAT}
            />
            <InfoListItem
              titleText='Điểm xuất phát'
              subtitleText={info.DIEM_XUATPHAT}
            />
            <InfoListItem
              titleText='Điểm kết thúc'
              subtitleText={info.DIEM_KETTHUC}
            />
            <InfoListItem
              titleText='Người đăng ký'
              subtitleText={info.NGUOIDANGKY}
            />
            <InfoListItem
              titleText='Phòng ban đăng ký'
              subtitleText={info.PHONGBAN_DANGKY}
            />
            <InfoListItem
              titleText='Số người'
              subtitleText={info.SONGUOI}
            />
            <InfoListItem
              titleText='Nội dung'
              subtitleText={info.NOIDUNG}
            />
            <InfoListItem
              isRender={info.GHICHU && info.GHICHU.length > 0}
              titleText='Ghi chú'
              subtitleText={info.GHICHU}
            />
            <InfoListItem
              titleText='Trạng thái'
              subtitleText={info.TEN_TRANGTHAI}
            />
            <InfoListItem
              isRender={!!info.LYDO_TUCHOI}
              titleText='Lý do huỷ/ từ chồi'
              subtitleText={info.LYDO_TUCHOI}
            />
          </List>
        </ScrollView>
      </View>
    );
  }
}

export default RegistrationInfo;