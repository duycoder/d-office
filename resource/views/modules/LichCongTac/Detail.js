import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

import {
  Container, Header, Left, Button,
  Body, Icon, Title, Content, Form,
  Tabs, Tab, TabHeading, ScrollableTab, Right, Subtitle
} from 'native-base';

import {
  Icon as RneIcon
} from 'react-native-elements';

import { Colors, API_URL } from '../../../common/SystemConstant';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { appGetDataAndNavigate, _readableFormat, convertDateToString } from '../../../common/Utilities';
import { dataLoading } from '../../../common/Effect';
import GoBackButton from '../../common/GoBackButton';
import { GridPanelStyle } from '../../../assets/styles/GridPanelStyle';
import { SideBarStyle } from '../../../assets/styles/SideBarStyle';

export default class DetailEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.navigation.state.params.id,
      data: {},
      loading: false,
    }
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

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    const { data } = this.state;

    let chutriStr = "", chutriArr = [];
    if (data.TEN_NGUOI_CHUTRI) {
      chutriArr.push(...data.TEN_NGUOI_CHUTRI.split(", "));
    }
    if (data.TEN_VAITRO_CHUTRI) {
      chutriArr.push(...data.TEN_VAITRO_CHUTRI.split(", "));
    }
    if (data.TEN_PHONGBAN_CHUTRI) {
      chutriArr.push(...data.TEN_PHONGBAN_CHUTRI.split(", "));
    }
    if (chutriArr.length > 0) {
      chutriStr = chutriArr.map(x => `- ${x}`).join("\n");
    }
    return (
      <Container style={{backgroundColor: '#f1f1f1'}}>
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              CHI TIẾT LỊCH CÔNG TÁC
            </Title>
            <Subtitle style={NativeBaseStyle.bodyTitle}>
              NGÀY {convertDateToString(data.NGAY_CONGTAC)}
            </Subtitle>
          </Body>

          <Right style={NativeBaseStyle.right}>

          </Right>
        </Header>

        <Content contentContainerStyle={{ flex: 1, backgroundColor: '#f1f1f1', paddingVertical: moderateScale(6, 1.2) }} scrollEnabled>
          <View style={[GridPanelStyle.container, { flexDirection: 'row', justifyContent: 'space-between' }]}>
            <View style={{ width: "65%" }}>
              <View style={GridPanelStyle.titleContainer}>
                <Text style={[GridPanelStyle.listItemTitle, { color: Colors.DANK_GRAY, fontSize: moderateScale(11, 0.9) }]}>Thời gian</Text>
              </View>
              <View style={{ marginTop: "0.5%" }}>
                <Text style={{ fontSize: moderateScale(12, 1.2) }}>{`${convertDateToString(data.NGAY_CONGTAC)} | ${_readableFormat(data.GIO_CONGTAC)}:${_readableFormat(data.PHUT_CONGTAC)} `}</Text>
              </View>
            </View>
            <View style={{ width: "35%" }}>
              <View style={GridPanelStyle.titleContainer}>
                <Text style={[GridPanelStyle.listItemTitle, { color: Colors.DANK_GRAY, fontSize: moderateScale(11, 0.9) }]}>Địa điểm</Text>
              </View>
              <View style={{ marginTop: "0.5%" }}>
                <Text style={{ fontSize: moderateScale(12, 1.2) }}>{data.DIADIEM}</Text>
              </View>
            </View>
          </View>

          {
            // <View style={GridPanelStyle.container}>
            //   <View style={GridPanelStyle.titleContainer}>
            //     <Text style={[GridPanelStyle.listItemTitle, { color: Colors.DANK_GRAY, fontSize: moderateScale(11, 0.9) }]}>Địa điểm</Text>
            //   </View>
            //   <View style={{ marginTop: "0.5%" }}>
            //     <Text style={{ fontSize: moderateScale(12, 1.2) }}>{data.DIADIEM}</Text>
            //   </View>
            // </View>
          }

          <View style={GridPanelStyle.container}>
            <View style={GridPanelStyle.titleContainer}>
              <Text style={[GridPanelStyle.listItemTitle, { color: Colors.DANK_GRAY, fontSize: moderateScale(11, 0.9) }]}>Người chủ trì</Text>
            </View>
            <View style={{ marginTop: "0.5%" }}>
              <Text style={{ fontSize: moderateScale(12, 1.2) }}>{chutriStr}</Text>
            </View>
          </View>

          <View style={GridPanelStyle.container}>
            <View style={GridPanelStyle.titleContainer}>
              <Text style={[GridPanelStyle.listItemTitle, { color: Colors.DANK_GRAY, fontSize: moderateScale(11, 0.9) }]}>Nội dung</Text>
            </View>
            <View style={{ marginTop: "0.5%" }}>
              <Text style={{ fontSize: moderateScale(12, 1.2) }}>{data.NOIDUNG}</Text>
            </View>
          </View>

          <View style={GridPanelStyle.container}>
            <View style={GridPanelStyle.titleContainer}>
              <Text style={[GridPanelStyle.listItemTitle, { color: Colors.DANK_GRAY, fontSize: moderateScale(11, 0.9) }]}>Chuẩn bị</Text>
            </View>
            <View style={{ marginTop: "0.5%" }}>
              <Text style={{ fontSize: moderateScale(12, 1.2) }}>{data.CHUANBI}</Text>
            </View>
          </View>

          <View style={GridPanelStyle.container}>
            <View style={GridPanelStyle.titleContainer}>
              <Text style={[GridPanelStyle.listItemTitle, { color: Colors.DANK_GRAY, fontSize: moderateScale(11, 0.9) }]}>Thành phần tham dự</Text>
            </View>
            <View style={{ marginTop: "0.5%" }}>
              <Text style={{ fontSize: moderateScale(12, 1.2) }}>{data.THANHPHAN_THAMDU}</Text>
            </View>
          </View>

        </Content>
      </Container>
    );
  }
}
