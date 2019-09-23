import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

import {
  Container, Header, Left, Button,
  Body, Icon, Title, Content, Form,
  Tabs, Tab, TabHeading, ScrollableTab, Right, Subtitle
} from 'native-base';

import {
  Icon as RneIcon, ButtonGroup
} from 'react-native-elements';

import { connect } from 'react-redux';

import { Colors, API_URL } from '../../../common/SystemConstant';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { appGetDataAndNavigate, _readableFormat, convertDateToString } from '../../../common/Utilities';
import { dataLoading } from '../../../common/Effect';
import GoBackButton from '../../common/GoBackButton';
import { GridPanelStyle } from '../../../assets/styles/GridPanelStyle';
import { SideBarStyle } from '../../../assets/styles/SideBarStyle';
import { ButtonGroupStyle } from '../../../assets/styles/ButtonGroupStyle';
import * as navAction from '../../../redux/modules/Nav/Action';

class DetailEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.navigation.state.params.id,
      data: {},
      loading: false,
    }
  }

  componentDidMount = () => {
    this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
      if (this.props.extendsNavParams.hasOwnProperty("check")) {
        if (this.props.extendsNavParams.check === true) {
          this.fetchData();
          // this.setState({ check: true }, () => this.fetchData());
          // this.props.updateExtendsNavParams({ check: false });
        }
      }
    })
  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
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

  componentWillMount = () => {
    this.fetchData();
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  onRegistCar = () => {
    const {
      NGAY_CONGTAC, GIO_CONGTAC, PHUT_CONGTAC, NOIDUNG
    } = this.state.data;
    this.props.updateExtendsNavParams({
      lichCongtacId: this.state.id,
      originScreen: "detail",
      ngayXP: `${convertDateToString(NGAY_CONGTAC)} ${_readableFormat(GIO_CONGTAC)}:${_readableFormat(PHUT_CONGTAC)}`,
      noidungLich: NOIDUNG
    });
    this.props.navigation.navigate("CreateCarRegistrationScreen");
  }

  render() {
    const { data } = this.state;

    let chutriStr = "", chutriArr = [];
    if (data.TEN_NGUOI_CHUTRI) {
      chutriArr.push(...data.TEN_NGUOI_CHUTRI.split(", ").map(nameRole => nameRole.split(" - ").reverse().join(" ")));
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

    let actionButtons = [];
    if (!data.IS_REGISTERED_CAR) {
      actionButtons.push({
        element: () => <TouchableOpacity style={ButtonGroupStyle.button} onPress={() => this.onRegistCar()}><Text style={ButtonGroupStyle.buttonText}>ĐẶT XE</Text></TouchableOpacity>
      });
    }

    return (
      <Container style={{ backgroundColor: '#f1f1f1' }}>
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
              <Text style={[GridPanelStyle.listItemTitle, { color: Colors.DANK_GRAY, fontSize: moderateScale(11, 0.9) }]}>Chủ trì</Text>
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
        {
          actionButtons.length > 0 && <ButtonGroup
            containerStyle={ButtonGroupStyle.container}
            buttons={actionButtons}
          />
        }
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    extendsNavParams: state.navState.extendsNavParams
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailEvent);