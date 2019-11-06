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
  VANBANDEN_CONSTANT,
  VANBANDI_CONSTANT,
  EMPTY_STRING
} from '../../../common/SystemConstant';
import { indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';


//styles
import { ListPublishDocStyle } from '../../../assets/styles/PublishDocStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { ListNotificationStyle } from '../../../assets/styles/ListNotificationStyle';
import GoBackButton from '../../common/GoBackButton';

class BaseList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: props.filterValue,
      userId: props.userInfo.ID,
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
    const navObj = this.props.navigator || this.props.navigation;
    this.didFocusListener = navObj.addListener('didFocus', () => {
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
    let apiUrlParam = 'ChuaXuLy';

    const { docType } = this.state;

    if (docType == VANBANDEN_CONSTANT.DA_XULY) {
      apiUrlParam = 'DaXuLy';
    } else if (docType == VANBANDEN_CONSTANT.THAMGIA_XULY) {
      apiUrlParam = 'ThamGiaXuLy';
    } else if (docType == VANBANDEN_CONSTANT.NOIBO_CHUAXULY) {
      apiUrlParam = 'NoiBoChuaXuLy';
    } else if (docType == VANBANDEN_CONSTANT.NOIBO_DAXULY) {
      apiUrlParam = 'NoiBoDaXuLy'
    }

    const url = `${API_URL}/api/VanBanDen/${apiUrlParam}/${this.state.userId}/${this.state.hasAuthorization}/${this.state.pageSize}/${this.state.pageIndex}?query=${this.state.filterValue}`;

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
    let currentScreenName = "VanBanDenIsNotProcessScreen";

    if (this.state.docType == VANBANDEN_CONSTANT.DA_XULY) {
      currentScreenName = "VanBanDenIsProcessScreen"
    } else if (this.state.docType == VANBANDEN_CONSTANT.NOIBO_CHUAXULY) {
      currentScreenName = "VanBanDenInternalIsNotProcessScreen"
    } else if (this.state.docType == VANBANDEN_CONSTANT.NOIBO_DAXULY) {
      currentScreenName = "VanBanDenInternalIsProcessScreen"
    }
    let targetScreenParam = {
      docId,
      docType: this.state.docType
    }
    this.props.updateCoreNavParams(targetScreenParam);
    this.props.navigator.navigate("VanBanDenDetailScreen");
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
    const readStateStyle = item.IS_READ === true ? ListPublishDocStyle.textRead : ListPublishDocStyle.textNormal,
      dokhanText = item.GIATRI_DOKHAN == DOKHAN_CONSTANT.THUONG_KHAN
        ? 'R.Q.TRỌNG'
        : ((item.GIATRI_DOKHAN == DOKHAN_CONSTANT.KHAN) ? 'Q.TRỌNG' : 'THƯỜNG'),
      dokhanBgColor = item.GIATRI_DOKHAN == DOKHAN_CONSTANT.THUONG_KHAN
        ? Colors.RED_PANTONE_186C
        : ((item.GIATRI_DOKHAN == DOKHAN_CONSTANT.KHAN) ? Colors.RED_PANTONE_021C : Colors.GREEN_PANTONE_364C);

    const loaiVanbanArr = item.TEN_HINHTHUC.split(" "),
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
            <RnText style={[readStateStyle, ListPublishDocStyle.abridgment]}>
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
                <RnText style={[readStateStyle, ListPublishDocStyle.abridgmentSub]}>
                  <RnText style={{ fontWeight: 'bold' }}>
                    Mã hiệu:
              </RnText>
                  <RnText>
                    {' ' + item.SOHIEU}
                  </RnText>
                </RnText>
              </View>
              <View style={{ backgroundColor: '#eaeaea', borderRadius: 8, padding: 8, marginRight: 5 }}>
                <RnText style={[readStateStyle, ListPublishDocStyle.abridgmentSub]}>
                  <RnText style={{ fontWeight: 'bold' }}>
                    Số theo sổ:
            </RnText>
                  <RnText>
                    {` ${item.SODITHEOSO || "N/A"} - ${item.TENSOVANBAN ? item.TENSOVANBAN.replace(/^\D+/g, '') : "N/A"}`}
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
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.props.navigator.goBack()} buttonStyle='100%' />
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
    filterValue: state.vanbandenState.filterValue,
    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams,
    hasAuthorization: state.navState.hasAuthorization
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editFilterValue: (filterValue) => dispatch(vanbandenAction.editFilterValue(filterValue)),
    updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams)),
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(BaseList);