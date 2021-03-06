/**
 * @description: thông tin chính văn bản xử lý
 * @author: duynn
 * @since: 09/05/2018
 */
import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'

//lib
import { List } from 'react-native-elements';

//common
import { convertDateToString, _readableFormat, extention } from '../../../common/Utilities';
import { Colors, EMPTY_STRING } from '../../../common/SystemConstant';
import { InfoStyle } from '../../../assets/styles';
import { InfoListItem, AttachmentItem } from '../../common/DetailCommon';

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
    let thanhphanThamduText = !!info.THANHPHAN_THAMDU ? info.THANHPHAN_THAMDU : EMPTY_STRING;
    let numberOfLinesForThamdu = 10;
    if (!!thanhphanThamduText) {
      if (thanhphanThamduText.indexOf(',') > -1) {
        const arrayThamdu = thanhphanThamduText.split(',');
        numberOfLinesForThamdu = arrayThamdu.length;
        thanhphanThamduText = arrayThamdu.map(x => `- ${x.trim()}`).join('\n');
      }
    }

    // render
    return (
      <View style={InfoStyle.container}>
        <ScrollView>
          <List containerStyle={InfoStyle.listContainer}>
            <InfoListItem
              titleText='Mục đích'
              subtitleText={info.MUCDICH}
            />
            <InfoListItem
              isRender={info.TEN_NGUOICHUTRI}
              titleText='Người chủ trì'
              subtitleText={info.TEN_NGUOICHUTRI}
            />
            <InfoListItem
              titleText='Thời gian họp'
              subtitleText={thoigianHop}
            />
            <InfoListItem
              titleText='Phòng họp'
              subtitleText={info.TEN_PHONG || 'Chưa xếp phòng'}
              customSubtitleText={!!info.TEN_PHONG ? {} : { color: Colors.RED_PANTONE_186C, fontWeight: 'bold' }}
            />
            <InfoListItem
              isRender={!!info.THANHPHAN_THAMDU}
              titleText='Thành phần tham dự'
              subtitleText={thanhphanThamduText}
              customSubtitleNumberOfLines={0}
            />
            <AttachmentItem data={!!info.DuongdanFile ? [info.DuongdanFile] : []} />
          </List>
        </ScrollView>
      </View>
    );
  }
}


export default RegistrationInfo;