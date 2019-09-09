/**
 * @description: danh sách văn bản trình ký chưa xử lý
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict'
import React, { Component } from 'react';
import {
  AsyncStorage, ActivityIndicator, View,
  FlatList, RefreshControl, TouchableOpacity, Text as RnText, StatusBar
} from 'react-native';

//redux
import { connect } from 'react-redux';
import * as vanbandiAction from '../../../redux/modules/VanBanDi/Action';
import * as navAction from '../../../redux/modules/Nav/Action';
//lib
import {
  Container, Header, Item, Icon, Input, Body, Text,
  Content, Badge, Left, Right, Button
} from 'native-base'
import renderIf from 'render-if';
import { List, ListItem, Icon as RNEIcon } from 'react-native-elements';

//utilities
import { formatLongText, openSideBar, emptyDataPage, appNavigate, appStoreDataAndNavigate, convertDateTimeToTitle } from '../../../common/Utilities';
import {
  API_URL, HEADER_COLOR, LOADER_COLOR, DOKHAN_CONSTANT,
  VANBAN_CONSTANT, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE,
  Colors,
  VANBANDI_CONSTANT,
  EMPTY_STRING
} from '../../../common/SystemConstant';
import { indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';


//styles
import { ListSignDocStyle } from '../../../assets/styles/SignDocStyle';
import { ListPublishDocStyle } from '../../../assets/styles/PublishDocStyle';
import { ListNotificationStyle } from '../../../assets/styles/ListNotificationStyle';

class BaseList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: this.props.filterValue,
      userId: this.props.userInfo.ID,
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
      docType: props.docType || props.coreNavParams.docType,
      loadingData: false,
      loadingMoreData: false,
      refreshingData: false,
      data: [],
      hasAuthorization: props.hasAuthorization || 0
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
    this.willFocusListener = this.props.navigator.addListener('didFocus', () => {
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
    })
  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }

  async fetchData() {
    let apiUrlParam = 'ChuaXuLy';

    const { docType } = this.state;

    if (docType == VANBANDI_CONSTANT.DA_XULY) {
      apiUrlParam = 'DaXuLy';
    } else if (docType == VANBANDI_CONSTANT.THAMGIA_XULY) {
      apiUrlParam = 'ThamGiaXuLy';
    } else if (docType == VANBANDI_CONSTANT.DA_BANHANH) {
      apiUrlParam = 'DaBanHanh';
    }

    const url = `${API_URL}/api/VanBanDi/${apiUrlParam}/${this.state.userId}/${this.state.hasAuthorization}/${this.state.pageSize}/${this.state.pageIndex}?query=${this.state.filterValue}`;

    const result = await fetch(url);
    const resultJson = await result.json();

    this.setState({
      data: this.state.loadingMoreData ? [...this.state.data, ...resultJson.ListItem] : resultJson.ListItem,
      loadingData: false,
      loadingMoreData: false,
      refreshingData: false,
    });
  }

  navigateToDocDetail = (docId) => {
    let currentScreenName = "VanBanDiIsNotProcessScreen";

    if (this.state.docType == VANBANDI_CONSTANT.DA_XULY) {
      currentScreenName = "VanBanDiIsProcessScreen"
    } else if (this.state.docType == VANBANDI_CONSTANT.THAMGIA_XULY) {
      currentScreenName = "VanBanDiJoinProcessScreen"
    } else if (this.state.docType == VANBANDI_CONSTANT.DA_BANHANH) {
      currentScreenName = "VanBanDiIsPublishScreen"
    }

    let targetScreenParam = {
      docId,
      docType: this.state.docType
    }

    this.props.updateCoreNavParams(targetScreenParam);
    this.props.navigator.navigate("VanBanDiDetailScreen");

    // appStoreDataAndNavigate(this.props.navigator, currentScreenName, new Object(), "VanBanDiDetailScreen", targetScreenParam);
  }

  onFilter = () => {
    this.setState({
      loadingData: true,
      pageIndex: DEFAULT_PAGE_INDEX
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

  renderItem = ({ item, index }) => {
    const dokhanBgColor = item.GIATRI_DOKHAN == DOKHAN_CONSTANT.THUONG_KHAN
      ? Colors.RED_PANTONE_186C
      : ((item.GIATRI_DOKHAN == DOKHAN_CONSTANT.KHAN) ? Colors.RED_PANTONE_021C : Colors.GREEN_PANTONE_364C);
    const loaiVanbanArr = item.TEN_LOAIVANBAN.split(" "),
      loaiVanbanStr = loaiVanbanArr.map(x => x.charAt(0).toUpperCase()).join("");
    
    return (
      <View>
        <ListItem
          containerStyle={{ borderBottomColor: Colors.GRAY, borderBottomWidth: .5 }}
          leftIcon={
            <View style={{ alignSelf: 'flex-start', justifyContent: 'center', flexDirection: 'column' }}>
              <View style={[ListNotificationStyle.leftTitleCircle, { backgroundColor: dokhanBgColor, width: 36, height: 36, borderRadius: 18 }]}>
                <RnText style={ListNotificationStyle.leftTitleText}>{loaiVanbanStr}</RnText>
              </View>
              {
                item.HAS_FILE && <RNEIcon name='ios-attach' size={26} type='ionicon' containerStyle={{ marginRight: 8, marginTop: 2 }} />
              }
            </View>
          }

          title={
            <RnText style={[ListPublishDocStyle.abridgment]}>
              <RnText style={{ fontWeight: 'bold' }}>
                Trích yếu:
              </RnText>
              <RnText>
                {' ' + formatLongText(item.TRICHYEU, 50)}
              </RnText>
            </RnText>
          }

          subtitle={
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View style={{ backgroundColor: '#eaeaea', borderRadius: 8, padding: 8, marginRight: 5 }}>
                <RnText style={[ListPublishDocStyle.abridgmentSub]}>
                  <RnText style={{ fontWeight: 'bold' }}>
                    Loại văn bản:
                  </RnText>
                  <RnText>
                    {` ${item.TEN_LOAIVANBAN}`}
                  </RnText>
                </RnText>
              </View>
              <View style={{ backgroundColor: '#eaeaea', borderRadius: 8, padding: 8, marginRight: 5 }}>
                <RnText style={[ListPublishDocStyle.abridgmentSub]}>
                  <RnText style={{ fontWeight: 'bold' }}>
                    Lĩnh vực:
                  </RnText>
                  <RnText>
                    {` ${item.TEN_LINHVUC}`}
                  </RnText>
                </RnText>
              </View>
            </View>
          }
          rightIcon={
            <View style={{ flexDirection: 'column' }}>
              <RnText style={[ListNotificationStyle.rightTitleText, { fontSize: moderateScale(9, .8) }]}>
                {convertDateTimeToTitle(item.Update_At, true)}
              </RnText>
              <RNEIcon name='flag' size={26} color={dokhanBgColor} type='material-community' />
            </View>
          }
          onPress={() => this.navigateToDocDetail(item.ID)}
        />
      </View>
    );
  }

  render() {
    return (
      <Container>
        <Header searchBar rounded style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.props.navigator.goBack()} style={{ width: '100%' }}>
              <RNEIcon name="ios-arrow-back" size={30} color={Colors.WHITE} type="ionicon" />
            </TouchableOpacity>
          </Left>

          <Item style={{ backgroundColor: Colors.WHITE, flex: 10 }}>
            <Icon name='ios-search' />
            <Input placeholder='Mã hiệu, trích yếu'
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
                ListFooterComponent={() => this.state.loadingMoreData ?
                  <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
                  (
                    this.state.data && this.state.data.length >= DEFAULT_PAGE_SIZE ?
                      <Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadingMore()}>
                        <Text>
                          TẢI THÊM
                        </Text>
                      </Button>
                      : null
                  )
                }
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
    filterValue: state.vanbandiState.filterValue,
    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams,
    hasAuthorization: state.navState.hasAuthorization
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editFilterValue: (filterValue) => dispatch(vanbandiAction.editFilterValue(filterValue)),
    updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams)),
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(BaseList);