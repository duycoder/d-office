import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

import {
  Container, Header, Left, Button,
  Body, Icon, Title, Content, Form,
  Tabs, Tab, TabHeading, ScrollableTab, Right
} from 'native-base';

import {
  Icon as RneIcon
} from 'react-native-elements';

import { Colors } from '../../../common/SystemConstant';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { appGetDataAndNavigate } from '../../../common/Utilities';

export default class DetailEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      data: { id: 1, title: "Lorem Ipsum Gabana Pokemon XYZ", startTime: "14:00", endTime: "16:00", location: "802 Hinet", chutri: "DuyNT", thamgia: "AnNN, DuyNN", ghichu: "Khi di hop nho mang theo so sach va may tinh de demo cong viec" }
    }

    this.navigateToEventList = this.navigateToEventList.bind(this);
  }

  navigateToEventList() {
    appGetDataAndNavigate(this.props.navigation, 'DetailEventScreen');
    return true;
  }

  render() {
    const { data } = this.state;
    return (
      <Container>
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <Button transparent onPress={() => this.navigateToEventList()}>
              <RneIcon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
            </Button>
          </Left>

          <Body style={NativeBaseStyle.body}>
            <TouchableOpacity onPress={this.openPicker}>
              <Title style={NativeBaseStyle.bodyTitle}>
                Chi tiết sự kiện
              </Title>
            </TouchableOpacity>
          </Body>

          <Right style={NativeBaseStyle.right}>

          </Right>
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>
          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 15 }}>{data.title}</Text>
            <Text style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Thời gian: </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: Colors.DARK_GRAY }}>{`${data.startTime} đến ${data.endTime}`}</Text>
            </Text>
            <Text>
              <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Địa điểm: </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: Colors.DARK_GRAY }}>{data.location}</Text>
            </Text>
          </View>
          <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.DARK_GRAY }} />

          <View style={{ padding: 10 }}>
            <Text style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Chủ trì: </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: Colors.DARK_GRAY }}>{data.chutri}</Text>
            </Text>
            <Text>
              <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Tham gia: </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: Colors.DARK_GRAY }}>{data.thamgia}</Text>
            </Text>
          </View>
          <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.DARK_GRAY }} />

          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 10 }}>Ghi chú: </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 14, color: Colors.DARK_GRAY }}>{data.ghichu}</Text>
          </View>

        </Content>
      </Container>
    );
  }
}
