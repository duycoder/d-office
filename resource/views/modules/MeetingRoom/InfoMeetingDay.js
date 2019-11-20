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
import { convertDateToString, _readableFormat, formatLongText, extention, onDownloadFile, convertTimeToString } from '../../../common/Utilities';
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

  getExtension = (filePath = "") => {
    let regExtension = extention(filePath);
    let extension = regExtension ? regExtension[0] : "";
    return extension;
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

            <ListItem style={DetailPublishDocStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                  Phòng họp
                                </Text>
              }
              subtitle={
                (info.TEN_PHONG && info.TEN_PHONG.length > 0)
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
            {
              !!info.DuongdanFile && <ListItem style={DetailPublishDocStyle.listItemContainer}
                hideChevron={true}
                title={
                  <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                    Đính kèm
                  </Text>
                }
                subtitle={
                  <View>
                    <ListItem
                      key={index.toString()}
                      leftIcon={getFileExtensionLogo(getExtension(info.itemTailieu.DUONGDAN_FILE))}
                      title={info.itemTailieu.TENTAILIEU}
                      titleStyle={{
                        marginLeft: 10,
                        color: '#707070',
                        fontWeight: 'bold'
                      }}
                      subtitle={
                        getFileSize(info.itemTailieu.KICHCO) + " | " + convertDateToString(info.itemTailieu.NGAYTAO) + " " + convertTimeToString(info.itemTailieu.NGAYTAO)
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
                      onPress={() => onDownloadFile(info.itemTailieu.TENTAILIEU, info.itemTailieu.DUONGDAN_FILE, info.itemTailieu.DINHDANG_FILE)}
                    />
                  </View>
                }
              />
            }

          </List>
        </ScrollView>
      </View>
    );
  }
}


export default RegistrationInfo;