/**
 * @description: danh sách văn bản trình ký chưa xử lý
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict'
import React, { Component } from 'react';
import {
  AsyncStorage, ActivityIndicator, View,
  FlatList, RefreshControl, TouchableOpacity, Text as RnText
} from 'react-native';

//redux
import { connect } from 'react-redux';
import * as vanbandenAction from '../../../redux/modules/VanBanDen/Action';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
  Container, Header, Item, Icon, Input, Body, Text,
  Content, Badge, Left, Right, Button, Fab
} from 'native-base'
import renderIf from 'render-if';
import { List, ListItem, Icon as RNEIcon } from 'react-native-elements';

//utilities
import { formatLongText, openSideBar, emptyDataPage, appNavigate, appStoreDataAndNavigate, convertDateTimeToTitle } from '../../../common/Utilities';
import {
  API_URL, HEADER_COLOR, LOADER_COLOR, DOKHAN_CONSTANT,
  VANBAN_CONSTANT, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE,
  Colors,
  VANBANDEN_CONSTANT,
  VANBANDI_CONSTANT,
  EMPTY_STRING
} from '../../../common/SystemConstant';
import { indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';


//styles
import { ListPublishDocStyle } from '../../../assets/styles/PublishDocStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { ListNotificationStyle } from '../../../assets/styles/ListNotificationStyle';
import { tripApi } from '../../../common/Api';
import { MoreButton } from '../../common';

class ListTrip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: EMPTY_STRING,
      userId: props.userInfo.ID,
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
      loadingData: false,
      loadingMoreData: false,
      refreshingData: false,
      data: [],
    }
  }

  componentWillMount() {
    this.setState({
      loadingData: true
    }, () => {
      this.fetchData();
    })
  }

  componentDidMount = () => {
    let currentNavObj = this.props.navigation || this.props.navigator;

    this.didFocusListener = currentNavObj.addListener('didFocus', () => {
      if (this.props.extendsNavParams.hasOwnProperty("check")) {
        if (this.props.extendsNavParams.check === true) {
          this.setState({
            loadingData: true
          }, () => {
            this.fetchData();
          });
          this.props.updateExtendsNavParams({ check: false });
        }
      }
    });
  }

  componentWillUnmount = () => {
    this.didFocusListener.remove();
  }

  async fetchData() {
    const {
      pageIndex, pageSize, userId, filterValue
    } = this.state;

    const resultJson = await tripApi().getList([
      pageIndex,
      pageSize,
      `${userId}?query=${filterValue}`
    ]);

    this.setState({
      data: this.state.loadingMoreData ? [...this.state.data, ...resultJson.ListItem] : resultJson.ListItem,
      loadingData: false,
      loadingMoreData: false,
      refreshingData: false,
    });
  }

  navigateToDetail = (tripId) => {
    const navObj = this.props.navigation || this.props.navigator;
    let targetScreenParam = {
      tripId
    }
    this.props.updateCoreNavParams(targetScreenParam);
    navObj.navigate("DetailTripScreen");
  }
  navigateBack = () => {
    const navObj = this.props.navigation || this.props.navigator;
    navObj.goBack();
  }

  onFilter = () => {
    this.setState({
      loadingData: true,
      pageIndex: DEFAULT_PAGE_INDEX
    }, () => {
      this.fetchData()
    })
  }

  loadingMore = () => {
    this.setState({
      loadingMoreData: true,
      pageIndex: this.state.pageIndex + 1,
    }, () => {
      this.fetchData()
    })
  }

  handleRefresh = () => {
    this.setState({
      refreshingData: true,
      pageIndex: DEFAULT_PAGE_INDEX,
    }, () => {
      this.fetchData()
    })
  }

  onClearFilter = () => {
    this.setState({
      loadingData: true,
      pageIndex: DEFAULT_PAGE_INDEX,
      filterValue: EMPTY_STRING
    }, () => {
      this.fetchData()
    })
  }

  renderItem = ({ item, index }) => {
    const thoigianXP = item.THOIGIAN_XUATPHAT.split(" "),
      timePart = thoigianXP[1],
      datePart = thoigianXP[0];


    //   dokhanText = item.GIATRI_DOKHAN == DOKHAN_CONSTANT.THUONG_KHAN
    //     ? 'R.Q.TRỌNG'
    //     : ((item.GIATRI_DOKHAN == DOKHAN_CONSTANT.KHAN) ? 'Q.TRỌNG' : 'THƯỜNG'),
    //   dokhanBgColor = item.GIATRI_DOKHAN == DOKHAN_CONSTANT.THUONG_KHAN
    //     ? Colors.RED_PANTONE_186C
    //     : ((item.GIATRI_DOKHAN == DOKHAN_CONSTANT.KHAN) ? Colors.RED_PANTONE_021C : Colors.GREEN_PANTONE_364C);

    return (
      <View>
        <ListItem
          containerStyle={{ borderBottomColor: Colors.GRAY, borderBottomWidth: 0 }}

          title={
            <RnText style={[{ fontWeight: 'bold', fontSize: moderateScale(12, 1.2), flexWrap: "wrap" }]}>
              {item.TEN_CHUYEN}
            </RnText>
          }

          subtitle={
            <View style={{ marginTop: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: "35%" }}>
                  <RnText style={{ color: Colors.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                    Mục đích:
                </RnText>
                </View>
                <View style={{ width: "65%" }}>
                  <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                    {item.MUCDICH}
                  </RnText>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: "35%" }}>
                  <RnText style={{ color: Colors.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                    Thời gian xuất phát:
              </RnText>
                </View>
                <View style={{ width: "65%" }}>
                  <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                    {[timePart, datePart].join(" - ")}
                  </RnText>
                </View>
              </View>
            </View>
          }
          rightIcon={
            <View style={{ flexDirection: 'column' }}>
              <RNEIcon name='flag' size={26} color={item.MAU_TRANGTHAI} type='material-community' />
            </View>
          }
          onPress={() => this.navigateToDetail(item.ID)}
        />
        <View style={{ paddingBottom: 10, paddingLeft: 10, paddingRight: 10, flexDirection: 'row' }}>
          <View style={{ backgroundColor: '#eaeaea', borderRadius: 8, padding: 8, marginRight: 5 }}>
            <RnText style={[ListPublishDocStyle.abridgmentSub]}>
              <RnText style={{ fontWeight: 'bold' }}>Tên xe:</RnText>
              <RnText>
                {' ' + item.TENXE}
              </RnText>
            </RnText>
          </View>
          <View style={{ backgroundColor: '#eaeaea', borderRadius: 8, padding: 8, marginRight: 5 }}>
            <RnText style={[ListPublishDocStyle.abridgmentSub]}>
              <RnText style={{ fontWeight: 'bold' }}>Trạng thái:</RnText>
              <RnText style={{ color: item.MAU_TRANGTHAI, fontWeight: 'bold' }}>
                {' ' + item.TEN_TRANGTHAI}
              </RnText>
            </RnText>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <Container>
        <Header searchBar rounded style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <TouchableOpacity onPress={() => this.navigateBack()} style={{ width: '100%' }}>
              <RNEIcon name="ios-arrow-back" size={30} color={Colors.WHITE} type="ionicon" />
            </TouchableOpacity>
          </Left>

          <Item style={{ backgroundColor: Colors.WHITE, flex: 10 }}>
            <Icon name='ios-search' />
            <Input placeholder='Tên chuyến'
              value={this.state.filterValue}
              onChangeText={(filterValue) => this.setState({ filterValue })}
              onSubmitEditing={() => this.onFilter()} />
            {
              this.state.filterValue !== EMPTY_STRING
                ? <Icon name='ios-close-circle' onPress={this.onClearFilter} />
                : null
            }
          </Item>
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>
          {
            renderIf(this.state.loadingData)(
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
              </View>
            )
          }

          {
            renderIf(!this.state.loadingData)(
              <FlatList
                data={this.state.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItem}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshingData}
                    onRefresh={this.handleRefresh}
                    colors={[Colors.BLUE_PANTONE_640C]}
                    tintColor={[Colors.BLUE_PANTONE_640C]}
                    title='Kéo để làm mới'
                    titleColor={Colors.RED}
                  />
                }
                ListEmptyComponent={() =>
                  this.state.loadingData ? null : emptyDataPage()
                }
                ListFooterComponent={() => (<MoreButton
                  isLoading={this.state.loadingMoreData}
                  isTrigger={this.state.data && this.state.data.length >= DEFAULT_PAGE_SIZE}
                  loadmoreFunc={this.loadingMore}
                />)}
              />
            )
          }
        </Content>
      </Container>
    );
  }
}

const mapStatetoProps = (state) => {
  return {
    userInfo: state.userState.userInfo,
    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams)),
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(ListTrip);