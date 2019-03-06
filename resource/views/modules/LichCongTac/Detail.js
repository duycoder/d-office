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

import { Colors, API_URL } from '../../../common/SystemConstant';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { appGetDataAndNavigate, _readableFormat, convertDateToString } from '../../../common/Utilities';
import { dataLoading } from '../../../common/Effect';

export default class DetailEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.navigation.state.params.id,
      data: {},
      loading: false,
    }

    this.navigateToEventList = this.navigateToEventList.bind(this);
  }


  fetchData = async () => {
    this.setState({
      loading: true
    })

    const url = `${API_URL}/api/LichCongTac/GetDetail/${this.state.id}`;
    const result = await fetch(url)
      .then((response) => response.json());
    this.setState({
      loading: false,
      data: result
    })
  }

  componentDidMount = () => {
    this.fetchData();
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
                CHI TIẾT SỰ KIỆN
              </Title>
            </TouchableOpacity>
          </Body>

          <Right style={NativeBaseStyle.right}>

          </Right>
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>
          {
            this.state.loading ? dataLoading(this.state.loading) :
              <View style={{ flex: 1 }}>
                <View style={{ padding: 10 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 15 }}>{data.TIEUDE}</Text>
                  <Text style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Thời gian: </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 14, color: Colors.DARK_GRAY }}>
                      {`${convertDateToString(data.NGAY_CONGTAC)} | ${_readableFormat(data.GIO_CONGTAC)}:${_readableFormat(data.PHUT_CONGTAC)} `}</Text>
                  </Text>
                  <Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Địa điểm: </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 14, color: Colors.DARK_GRAY }}>{data.DIADIEM}</Text>
                  </Text>
                </View>
                <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.DARK_GRAY }} />

                <View style={{ padding: 10 }}>
                  <Text style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Chủ trì: </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 14, color: Colors.DARK_GRAY }}>{data.TEN_NGUOICHUTRI}</Text>
                  </Text>
                </View>
                <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.DARK_GRAY }} />

                <View style={{ padding: 10 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 10 }}>Ghi chú: </Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 14, color: Colors.DARK_GRAY }}>{data.GHICHU}</Text>
                </View>
              </View>
          }
        </Content>
      </Container>
    );
  }
}
