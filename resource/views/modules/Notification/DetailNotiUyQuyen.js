import React, { Component } from 'react';
import {
  View, Text
} from 'react-native';
import { Container, Header, Left, Right, Body, Title, Content } from 'native-base';
import { _readableFormat, convertDateToString } from '../../../common/Utilities';
import GoBackButton from '../../common/GoBackButton';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';
import { GridPanelStyle } from '../../../assets/styles/GridPanelStyle';
import { Colors, API_URL } from '../../../common/SystemConstant';
import { dataLoading } from '../../../common/Effect';

class DetailNotiUyQuyen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.navigation.state.params.id,
      data: {},
      loading: false,
    }
  }

  componentWillMount = () => {
    this.fetchData();
  }

  // componentDidMount = () => {
  //   this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
  //     if (this.props.extendsNavParams.hasOwnProperty("check")) {
  //       if (this.props.extendsNavParams.check === true) {
  //         this.fetchData();
  //       }
  //     }
  //   })
  // }

  // componentWillUnmount = () => {
  //   this.willFocusListener.remove();
  // }

  fetchData = async () => {
    this.setState({
      loading: true
    })

    const url = `${API_URL}/api/account/GetDetailNoti/${this.state.id}`;
    const result = await fetch(url)
      .then((response) => response.json());
    this.setState({
      loading: false,
      data: result
    })
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    const { data, loading } = this.state;
    return (
      <Container style={{ backgroundColor: '#f1f1f1' }}>
        <Header style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              CHI TIẾT THÔNG BÁO
            </Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
          </Right>
        </Header>

        {
          loading
            ? dataLoading(loading)
            : <Content contentContainerStyle={{ flex: 1, backgroundColor: '#f1f1f1', paddingVertical: moderateScale(6, 1.2) }} scrollEnabled>
              <View style={GridPanelStyle.container}>
                <View style={GridPanelStyle.titleContainer}>
                  <Text style={[GridPanelStyle.listItemTitle, { color: Colors.DANK_GRAY, fontSize: moderateScale(11, 0.9) }]}>Người tạo</Text>
                </View>
                <View style={{ marginTop: "0.5%" }}>
                  <Text style={{ fontSize: moderateScale(12, 1.2) }}>{data.TEN_NGUOIGUI}</Text>
                </View>
              </View>

              <View style={GridPanelStyle.container}>
                <View style={GridPanelStyle.titleContainer}>
                  <Text style={[GridPanelStyle.listItemTitle, { color: Colors.DANK_GRAY, fontSize: moderateScale(11, 0.9) }]}>Tiêu đề</Text>
                </View>
                <View style={{ marginTop: "0.5%" }}>
                  <Text style={{ fontSize: moderateScale(12, 1.2) }}>{data.TIEUDE}</Text>
                </View>
              </View>

              <View style={[GridPanelStyle.container, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View style={GridPanelStyle.titleContainer}>
                  <Text style={[GridPanelStyle.listItemTitle, { color: Colors.DANK_GRAY, fontSize: moderateScale(11, 0.9) }]}>Hạn hiển thị</Text>
                </View>
                <View style={{ marginTop: "0.5%" }}>
                  <Text style={{ fontSize: moderateScale(12, 1.2) }}>{`${convertDateToString(data.SHOW_UNTIL)}`}</Text>
                </View>
              </View>

              {
                !!data.NOIDUNG && <View style={GridPanelStyle.container}>
                  <View style={GridPanelStyle.titleContainer}>
                    <Text style={[GridPanelStyle.listItemTitle, { color: Colors.DANK_GRAY, fontSize: moderateScale(11, 0.9) }]}>Nội dung</Text>
                  </View>
                  <View style={{ marginTop: "0.5%" }}>
                    <Text style={{ fontSize: moderateScale(12, 1.2) }}>{data.NOIDUNG}</Text>
                  </View>
                </View>
              }

              <View style={[GridPanelStyle.container, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View style={GridPanelStyle.titleContainer}>
                  <Text style={[GridPanelStyle.listItemTitle, { color: Colors.DANK_GRAY, fontSize: moderateScale(11, 0.9) }]}>Ngày tạo</Text>
                </View>
                <View style={{ marginTop: "0.5%" }}>
                  <Text style={{ fontSize: moderateScale(12, 1.2) }}>{`${convertDateToString(data.NGAYTAO)}`}</Text>
                </View>
              </View>

            </Content>
        }

      </Container>
    );
  }
}

export default DetailNotiUyQuyen;