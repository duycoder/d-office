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

class RegistrationInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: this.props.info.entity,
    };
  }

  render() {
    const { info } = this.state,
      thoigianHop = `${convertDateToString(info.NGAY_HOP)} từ ${_readableFormat(info.GIO_BATDAU)}h${_readableFormat(info.PHUT_BATDAU)} đến ${_readableFormat(info.GIO_KETTHUC)}h${_readableFormat(info.PHUT_KETTHUC)}`;

    // render
    return (
      <View style={DetailPublishDocStyle.container}>
        <ScrollView>
          <List containerStyle={DetailPublishDocStyle.listContainer}>


            <ListItem style={DetailPublishDocStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                  Mục đích
                </Text>
              }
              subtitle={
                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                  {info.MUCDICH}
                </Text>
              } />

            {
              info.TEN_NGUOICHUTRI && <ListItem style={DetailPublishDocStyle.listItemContainer}
                hideChevron={true}
                title={
                  <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                    Người chủ trì
                          </Text>
                }
                subtitle={
                  <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                    {info.TEN_NGUOICHUTRI}
                  </Text>
                } />
            }

            <ListItem style={DetailPublishDocStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                  Thời gian họp
                                </Text>
              }
              subtitle={
                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                  {thoigianHop}
                </Text>
              } />
            }
            <ListItem style={DetailPublishDocStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                  Phòng họp
                                </Text>
              }
              subtitle={
                info.TEN_PHONG
                  ? <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                    {info.TEN_PHONG}
                  </Text>
                  : <Text style={[DetailPublishDocStyle.listItemSubTitleContainer, { color: Colors.RED_PANTONE_186C, fontWeight: 'bold' }]}>
                    Chưa xếp phòng
                  </Text>
              } />
            <ListItem style={DetailPublishDocStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                  Thành phần tham dự
                                </Text>
              }
              subtitle={
                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                  {info.THANHPHAN_THAMDU}
                </Text>
              } />


          </List>
        </ScrollView>
      </View>
    );
  }
}


export default RegistrationInfo;