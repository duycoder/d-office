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
  Content, Badge, Left, Right, Button, Fab, Title, Subtitle
} from 'native-base'
import renderIf from 'render-if';
import { List, ListItem, Icon as RNEIcon } from 'react-native-elements';

//utilities
import { formatLongText, openSideBar, emptyDataPage, appNavigate, appStoreDataAndNavigate, convertDateTimeToTitle, convertDateToString, onDownloadFile } from '../../../common/Utilities';
import {
  API_URL, HEADER_COLOR, LOADER_COLOR, DOKHAN_CONSTANT,
  VANBAN_CONSTANT, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE,
  Colors,
  VANBANDEN_CONSTANT,
  VANBANDI_CONSTANT, LICHTRUC_CONSTANT,
  EMPTY_STRING
} from '../../../common/SystemConstant';
import { indicatorResponsive, moderateScale, verticalScale } from '../../../assets/styles/ScaleIndicator';


//styles
import { ListPublishDocStyle } from '../../../assets/styles/PublishDocStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { ListNotificationStyle } from '../../../assets/styles/ListNotificationStyle';
import { MenuProvider, MenuOption, MenuOptions, MenuTrigger, Menu } from 'react-native-popup-menu';
import { HeaderMenuStyle } from '../../../assets/styles';
import { getFileExtensionLogo } from '../../../common/Effect';

class ListLichtruc extends Component {
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
      type: LICHTRUC_CONSTANT.CHUYEN_MON
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
      pageIndex, pageSize, userId, type, filterValue
    } = this.state;
    const url = `${API_URL}/api/Lichtruc/ListLichtruc/`;
    const headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    });
    const body = JSON.stringify({
      pageSize,
      pageIndex,
      userId,
      type,
      query: filterValue
    });

    const result = await fetch(url, {
      method: 'POST',
      headers,
      body
    });
    const resultJson = await result.json();

    this.setState({
      data: this.state.loadingMoreData ? [...this.state.data, ...resultJson.ListItem] : resultJson.ListItem,
      loadingData: false,
      loadingMoreData: false,
      refreshingData: false,
    });
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

  loadingMore() {
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
    return (
      <View>
        <ListItem
          containerStyle={{ borderBottomColor: Colors.GRAY, borderBottomWidth: 0 }}

          title={
            <RnText style={[{ fontWeight: 'bold', fontSize: moderateScale(12, 1.2), flexWrap: "wrap" }]}>
              {item.KEHOACH}
            </RnText>
          }

          subtitle={
            <View style={{ marginTop: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: "35%" }}>
                  <RnText style={{ color: Colors.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                    Thời hạn:
                </RnText>
                </View>
                <View style={{ width: "65%" }}>
                  <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                    {` ${convertDateToString(item.TUNGAY)} - ${convertDateToString(item.DENNGAY)}`}
                  </RnText>
                </View>
              </View>
              {
                item.BS_TRUC_THAM_VAN && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ width: "35%" }}>
                    <RnText style={{ color: Colors.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                      Bác sĩ trực tham vấn:
                    </RnText>
                  </View>
                  <View style={{ width: "65%" }}>
                    <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                      {' ' + item.BS_TRUC_THAM_VAN}
                    </RnText>
                  </View>
                </View>
              }
              {
                item.BS_KIEM_TRA_TRUC && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ width: "35%" }}>
                    <RnText style={{ color: Colors.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                      Bác sĩ kiểm tra trực:
                    </RnText>
                  </View>
                  <View style={{ width: "65%" }}>
                    <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                      {' ' + item.BS_KIEM_TRA_TRUC}
                    </RnText>
                  </View>
                </View>
              }

            </View>
          }
          rightIcon={
            item.DuongdanFile
              ? <TouchableOpacity style={{ flexDirection: 'column' }} onPress={() => onDownloadFile(item.TENTAILIEU, item.DuongdanFile)}>
                <RNEIcon name='download' color={Colors.GREEN_PANTON_369C} size={verticalScale(25)} type='entypo' />
              </TouchableOpacity>
              : <View />
          }
        />
      </View>
    );
  }

  changeListType = (type) => {
    this.setState({
      type
    }, () => this.fetchData());
  }

  render() {
    const screenTitle = this.state.type === LICHTRUC_CONSTANT.CHUYEN_MON ? "Lịch trực chuyên môn" : "Lịch khám chữa bệnh";
    return (
      <MenuProvider backHandler>
        <Container>
          <Header searchBar rounded style={{ backgroundColor: Colors.LITE_BLUE }}>
            <Left style={NativeBaseStyle.left}>
              <TouchableOpacity onPress={() => this.navigateBack()} style={{ width: '100%' }}>
                <RNEIcon name="ios-arrow-back" size={30} color={Colors.WHITE} type="ionicon" />
              </TouchableOpacity>
            </Left>

            <Body style={[NativeBaseStyle.body, { flex: 5 }]}>
              <Title style={NativeBaseStyle.bodyTitle}>{screenTitle.toUpperCase()}</Title>
            </Body>

            <Right style={NativeBaseStyle.right}>
              <Menu>
                <MenuTrigger children={<RNEIcon name='ios-more' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />} />
                <MenuOptions customStyles={HeaderMenuStyle.optionsStyles}>
                  {
                    this.state.type === LICHTRUC_CONSTANT.CHUYEN_MON
                      ? <MenuOption onSelect={() => this.changeListType(LICHTRUC_CONSTANT.KHAM_CHUA_BENH)} text="Lịch khám chữa bệnh" customStyles={HeaderMenuStyle.optionStyles} />
                      : <MenuOption onSelect={() => this.changeListType(LICHTRUC_CONSTANT.CHUYEN_MON)} text="Lịch trưcj chuyên môn" customStyles={HeaderMenuStyle.optionStyles} />
                  }
                </MenuOptions>
              </Menu>
            </Right>
            {
              // <Item style={{ backgroundColor: Colors.WHITE, flex: 10 }}>
              //   <Icon name='ios-search' />
              //   <Input placeholder='Tên chuyến'
              //     value={this.state.filterValue}
              //     onChangeText={(filterValue) => this.setState({ filterValue })}
              //     onSubmitEditing={() => this.onFilter()} />
              //   {
              //     this.state.filterValue !== EMPTY_STRING
              //       ? <Icon name='ios-close-circle' onPress={this.onClearFilter} />
              //       : null
              //   }
              // </Item>
            }
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
                  ListFooterComponent={() => this.state.loadingMoreData ?
                    <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
                    (
                      this.state.data && this.state.data.length >= DEFAULT_PAGE_SIZE
                        ? <Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadingMore()}>
                          <Text>TẢI THÊM</Text>
                        </Button>
                        : null
                    )
                  }
                />
              )
            }
          </Content>
        </Container>
      </MenuProvider>
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

export default connect(mapStatetoProps, mapDispatchToProps)(ListLichtruc);