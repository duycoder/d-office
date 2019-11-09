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
    };
  }

  render() {
    const { info } = this.state,
      thoigianHop = `${convertDateToString(info.NGAY_HOP)} từ ${_readableFormat(info.GIO_BATDAU)}h${_readableFormat(info.PHUT_BATDAU)} đến ${_readableFormat(info.GIO_KETTHUC)}h${_readableFormat(info.PHUT_KETTHUC)}`;

    // render
    return (
      <View style={InfoStyle.container}>
        <ScrollView>
          <List containerStyle={InfoStyle.listContainer}>


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

            {
              info.TEN_NGUOICHUTRI && <ListItem style={InfoStyle.listItemContainer}
                hideChevron={true}
                title={
                  <Text style={InfoStyle.listItemTitleContainer}>
                    Người chủ trì
                          </Text>
                }
                subtitle={
                  <Text style={InfoStyle.listItemSubTitleContainer}>
                    {info.TEN_NGUOICHUTRI}
                  </Text>
                } />
            }

            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Thời gian họp
                                </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {thoigianHop}
                </Text>
              } />
            
            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Phòng họp
                                </Text>
              }
              subtitle={
                (info.TEN_PHONG && info.TEN_PHONG.length > 0)
                  ? <Text style={InfoStyle.listItemSubTitleContainer}>
                    {info.TEN_PHONG}
                  </Text>
                  : <Text style={[InfoStyle.listItemSubTitleContainer, { color: Colors.RED_PANTONE_186C, fontWeight: 'bold' }]}>
                    Chưa xếp phòng
                  </Text>
              } />
            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Thành phần tham dự
                                </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
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