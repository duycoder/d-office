/**
 * @description: thông tin chuyến xe
 * @author: annv
 * @since: 26/10/2019
 */
import React, { Component } from 'react'
import { View, Text, ScrollView, Linking } from 'react-native'

//lib
import { List, ListItem } from 'react-native-elements';
import { InfoStyle } from '../../../assets/styles';
import { InfoListItem } from '../../common/DetailCommon';

class TripInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: props.info.entity
    };
  }

  render() {
    const { info } = this.state;
    return (
      <View style={InfoStyle.container}>
        <ScrollView>
          <List containerStyle={InfoStyle.listContainer}>
            <InfoListItem
              titleText='Tên chuyến'
              subtitleText={info.TEN_CHUYEN}
            />
            <InfoListItem
              titleText='Tên xe'
              subtitleText={info.TENXE}
            />
            <ListItem style={InfoStyle.listItemContainer}
              onPress={() => Linking.openURL(`tel:${info.DIENTHOAI_LAIXE}`)}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Điện thoại lái xe
                    </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {info.DIENTHOAI_LAIXE}
                </Text>
              } />
            <InfoListItem
              titleText='Tên lái xe'
              subtitleText={info.TEN_LAIXE}
            />
            <InfoListItem
              isRender={!!info.GHICHU}
              titleText='Ghi chú'
              subtitleText={info.GHICHU}
            />
          </List>
        </ScrollView>
      </View>
    );
  }
}

export default TripInfo;