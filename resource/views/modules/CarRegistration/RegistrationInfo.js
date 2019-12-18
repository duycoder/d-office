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
import { Colors, EMPTY_STRING, API_URL } from '../../../common/SystemConstant';
import { getFileExtensionLogo, getFileSize } from '../../../common/Effect';
import { verticalScale } from '../../../assets/styles/ScaleIndicator';
import { DetailSignDocStyle } from '../../../assets/styles/SignDocStyle';
import { InfoStyle } from '../../../assets/styles';

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

            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Tên cán bộ
                        </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {info.TEN_CANBO}
                </Text>
              } />
            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Mục đích
                </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {info.MUCDICH}
                </Text>
              } />

            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Thời gian xuất phát
                                </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {info.THOIGIAN_XUATPHAT}
                </Text>
              } />
            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Điểm xuất phát
                                </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {info.DIEM_XUATPHAT}
                </Text>
              } />
            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Điểm kết thúc
                                </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {info.DIEM_KETTHUC}
                </Text>
              } />
            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Người đăng ký
                                </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {info.NGUOIDANGKY}
                </Text>
              } />
            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Phòng ban đăng ký
                                </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {info.PHONGBAN_DANGKY}
                </Text>
              } />

            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Số người
                </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {info.SONGUOI}
                </Text>
              } />

            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Nội dung
                </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {info.NOIDUNG}
                </Text>
              } />

            {
              (info.GHICHU && info.GHICHU.length > 0) && <ListItem style={InfoStyle.listItemContainer}
                hideChevron={true}
                title={
                  <Text style={InfoStyle.listItemTitleContainer}>
                    Ghi chú
                </Text>
                }
                subtitle={
                  <Text style={InfoStyle.listItemSubTitleContainer}>
                    {info.GHICHU}
                  </Text>
                } />
            }

            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Trạng thái
                </Text>
              }
              subtitle={
                <Text style={[InfoStyle.listItemSubTitleContainer, { color: info.MAU_TRANGTHAI + "" }]}>
                  {info.TEN_TRANGTHAI}
                </Text>
              } />

            {
              !!info.LYDO_TUCHOI && <ListItem style={InfoStyle.listItemContainer}
                hideChevron={true}
                title={
                  <Text style={InfoStyle.listItemTitleContainer}>
                    Lý do huỷ/ từ chồi
                  </Text>
                }
                subtitle={
                  <Text style={InfoStyle.listItemSubTitleContainer}>
                    {info.LYDO_TUCHOI}
                  </Text>
                } />
            }

          </List>
        </ScrollView>
      </View>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     userInfo: state.userState.userInfo
//   }
// }

// export default connect(mapStateToProps)(RegistrationInfo);

export default RegistrationInfo;