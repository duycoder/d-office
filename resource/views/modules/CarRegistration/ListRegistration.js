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
import { formatLongText, openSideBar, emptyDataPage, appNavigate, appStoreDataAndNavigate, convertDateTimeToTitle, convertDateToString } from '../../../common/Utilities';
import {
  API_URL, HEADER_COLOR, LOADER_COLOR, DOKHAN_CONSTANT,
  VANBAN_CONSTANT, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE,
  Colors,
  VANBANDEN_CONSTANT,
  VANBANDI_CONSTANT,
  EMPTY_STRING
} from '../../../common/SystemConstant';
import { indicatorResponsive, moderateScale, scale } from '../../../assets/styles/ScaleIndicator';

//styles
import { ListPublishDocStyle } from '../../../assets/styles/PublishDocStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { ListNotificationStyle } from '../../../assets/styles/ListNotificationStyle';
import { ItemProportion } from '../../../assets/styles/ListLayoutStyles';
import { carApi } from '../../../common/Api';
import { SearchSection, AddButton, MoreButton, ColumnedListItem } from '../../common';
import GoBackButton from '../../common/GoBackButton';

class ListRegistration extends Component {
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

      // hasAuthorization: props.hasAuthorization || 0
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
      pageSize, pageIndex, userId, filterValue
    } = this.state;

    const resultJson = await carApi().getList([
      pageSize,
      pageIndex,
      `${userId}?query=${filterValue}`
    ])

    this.setState({
      data: this.state.loadingMoreData ? [...this.state.data, ...resultJson.ListItem] : resultJson.ListItem,
      loadingData: false,
      loadingMoreData: false,
      refreshingData: false,
    });
  }

  navigateToDetail = (registrationId) => {
    const navObj = this.props.navigation || this.props.navigator;
    let targetScreenParam = {
      registrationId
    }
    this.props.updateCoreNavParams(targetScreenParam);
    navObj.navigate("DetailCarRegistrationScreen");
  }
  navigateBack = () => {
    const navObj = this.props.navigation || this.props.navigator;
    navObj.goBack();
  }

  onCreateCarRegistration = () => {
    const navObj = this.props.navigation || this.props.navigator;
    navObj.navigate("CreateCarRegistrationScreen");
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
          containerStyle={{ borderBottomColor: Colors.GRAY, borderBottomWidth: .7 }}

          leftIcon={
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <RnText style={{ color: Colors.LITE_BLUE, fontWeight: "bold", fontSize: moderateScale(12, 1.05) }}>{timePart}</RnText>
              <RnText style={{ color: Colors.LITE_BLUE, fontSize: moderateScale(11, 1.02) }}>{datePart}</RnText>
            </View>
          }
          // title={
          //   <RnText style={[{ fontWeight: 'bold', fontSize: moderateScale(12, 1.2), flexWrap: "wrap" }]}>
          //     {formatLongText(item.MUCDICH, 50)}
          //   </RnText>
          // }

          subtitle={
            <View style={{ marginLeft: scale(8) }}>
              <ColumnedListItem
                isRender={!!item.TEN_CHUYENXE && !!item.TEN_XE}
                leftText='Tên chuyến:'
                rightText={`${item.TEN_CHUYENXE.split("-").shift()} - ${item.TEN_XE}`}
              />

              <ColumnedListItem
                isRender={!!item.TEN_LAIXE && !!item.DIEN_THOAI_LAI_XE}
                leftText='Lái xe:'
                rightText={`${item.TEN_LAIXE} - ${item.DIEN_THOAI_LAI_XE}`}
              />

              <ColumnedListItem
                leftText='Nội dung:'
                rightText={formatLongText(item.MUCDICH, 50)}
              />

              <ColumnedListItem
                isRender={!!item.DIEM_XUATPHAT}
                leftText='Điểm đi:'
                rightText={item.DIEM_XUATPHAT}
              />

              <ColumnedListItem
                isRender={!!item.DIEM_KETTHUC}
                leftText='Điểm đến:'
                rightText={item.DIEM_KETTHUC}
              />

              <ColumnedListItem
                isRender={!!item.NGUOIDANGKY}
                leftText='Đơn vị đề xuất:'
                rightText={item.NGUOIDANGKY}
              />

              <ColumnedListItem
                isRender={!!item.TEN_NGUOITAO_TRIP}
                leftText='Duyệt bởi:'
                rightText={`${item.TEN_NGUOITAO_TRIP} (${convertDateToString(item.NGAYTAO_TRIP)})`}
              />

              <ColumnedListItem
                leftText='Trạng thái:'
                rightText={item.TEN_TRANGTHAI}
                customRightText={{ color: item.MAU_TRANGTHAI, fontWeight: 'bold' }}
              />
            </View>
          }
          hideChevron
          rightIcon={
            <View style={{ flexDirection: 'column' }}>
              <RNEIcon name='flag' size={26} color={item.MAU_TRANGTHAI} type='material-community' />
            </View>
          }
          onPress={() => this.navigateToDetail(item.ID)}
        />
        {
          //   <View style={{ paddingBottom: 10, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', borderBottomColor: Colors.GRAY, borderBottomWidth: .7 }}>
          //     <View style={{ backgroundColor: '#eaeaea', borderRadius: 8, padding: 8, marginRight: 5 }}>
          //       <RnText style={[ListPublishDocStyle.abridgmentSub]}>
          //         <RnText style={{ fontWeight: 'bold' }}>
          //           Số người:
          // </RnText>
          //         <RnText>
          //           {' ' + item.SONGUOI}
          //         </RnText>
          //       </RnText>
          //     </View>
          //     <View style={{ backgroundColor: '#eaeaea', borderRadius: 8, padding: 8, marginRight: 5 }}>
          //       <RnText style={[ListPublishDocStyle.abridgmentSub]}>
          //         <RnText style={{ fontWeight: 'bold' }}>
          //           Trạng thái:
          // </RnText>
          //         <RnText style={{ color: item.MAU_TRANGTHAI, fontWeight: 'bold' }}>
          //           {' ' + item.TEN_TRANGTHAI}
          //         </RnText>
          //       </RnText>
          //     </View>
          //   </View>
        }
      </View>
    );
  }

  _handleFieldNameChange = fieldName => text => {
    this.setState({
      [fieldName]: text
    });
  }

  render() {
    return (
      <Container>
        <Header searchBar rounded style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} buttonStyle='100%' />
          </Left>

          <SearchSection
            filterValue={this.state.filterValue}
            placeholderText='Nội dung'
            filterFunc={this.onFilter}
            handleChangeFunc={this._handleFieldNameChange}
            clearFilterFunc={this.onClearFilter}
          />
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
        <AddButton createFunc={this.onCreateCarRegistration} />
      </Container>
    );
  }
}

const mapStatetoProps = (state) => {
  return {
    userInfo: state.userState.userInfo,
    // filterValue: state.vanbandenState.filterValue,
    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams,
    // hasAuthorization: state.navState.hasAuthorization
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // editFilterValue: (filterValue) => dispatch(vanbandenAction.editFilterValue(filterValue)),
    updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams)),
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(ListRegistration);