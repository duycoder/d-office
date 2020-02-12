/**
 * @description: danh sách văn bản trình ký chưa xử lý
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict'
import React, { Component } from 'react';
import {
  AsyncStorage, ActivityIndicator, View,
  FlatList, RefreshControl, TouchableOpacity, Text as RnText,
  Image
} from 'react-native';

//redux
import { connect } from 'react-redux';
import * as vanbandenAction from '../../../redux/modules/VanBanDen/Action';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
  Container, Header, Item, Icon, Input, Body, Text,
  Content, Badge, Left, Right, Button, Fab, Title, Subtitle, Toast
} from 'native-base'
import renderIf from 'render-if';
import { List, ListItem, Icon as RNEIcon } from 'react-native-elements';

//utilities
import { formatLongText, openSideBar, emptyDataPage, appNavigate, appStoreDataAndNavigate, convertDateTimeToTitle, convertDateToString, onDownloadFile, asyncDelay, showWarningToast } from '../../../common/Utilities';
import {
  API_URL, HEADER_COLOR, LOADER_COLOR, DOKHAN_CONSTANT,
  VANBAN_CONSTANT, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE,
  Colors,
  VANBANDEN_CONSTANT,
  VANBANDI_CONSTANT, LICHTRUC_CONSTANT,
  EMPTY_STRING,
  TOAST_DURATION_TIMEOUT
} from '../../../common/SystemConstant';
import { indicatorResponsive, moderateScale, verticalScale } from '../../../assets/styles/ScaleIndicator';
import Images from '../../../common/Images';


//styles
import { ListPublishDocStyle } from '../../../assets/styles/PublishDocStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { ListNotificationStyle } from '../../../assets/styles/ListNotificationStyle';
import { MenuProvider, MenuOption, MenuOptions, MenuTrigger, Menu } from 'react-native-popup-menu';
import { HeaderMenuStyle, AlertMessageStyle } from '../../../assets/styles';
import { getFileExtensionLogo } from '../../../common/Effect';
import AlertMessage from '../../common/AlertMessage';
import { lichtrucApi } from '../../../common/Api';
import { MoreButton, GoBackButton, ColumnedListItem } from '../../common';

const api = lichtrucApi();

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
      type: LICHTRUC_CONSTANT.CHUYEN_MON,
      executing: false,
      tempKehoachId: null,

      listIds: props.extendsNavParams.listIds || props.coreNavParams.listIds || []
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

    const resultJson = await api.getList({
      pageSize,
      pageIndex,
      userId,
      type,
      query: filterValue
    });

    this.setState({
      //DONE: Filter out duongdanFile if null
      data: this.state.loadingMoreData ? [...this.state.data, ...resultJson.ListItem.filter(item => item.DuongdanFile && item.DuongdanFile.length > 0)] : resultJson.ListItem.filter(item => item.DuongdanFile && item.DuongdanFile.length > 0),
      loadingData: false,
      loadingMoreData: false,
      refreshingData: false,
    });
  }

  navigateBack = () => {
    if (this.state.listIds.length > 0) {
      this.props.updateExtendsNavParams({ listIds: [] });
    }
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

  onConfirmLichtruc = (kehoachId) => {
    this.setState({
      tempKehoachId: kehoachId
    }, () => this.refs.confirmLichtruc.showModal());
  }
  submitConfirm = async () => {
    this.refs.confirmLichtruc.closeModal();
    this.setState({
      executing: true
    });

    const {
      userId, tempKehoachId
    } = this.state;

    if (tempKehoachId !== null) {
      const resultJson = await api.approveLichtruc({
        userId,
        kehoachId: tempKehoachId
      });

      this.setState({
        executing: false
      });

      Toast.show({
        text: resultJson.Status ? "Phê duyệt thành công" : "Phê duyệt thất bại",
        type: resultJson.Status ? 'success' : 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
        duration: TOAST_DURATION_TIMEOUT,
        onClose: () => {
          if (resultJson.Status) {
            this.fetchData();
          }
        }
      });
    }
    else {
      showWarningToast('Vui lòng chọn lịch cần phê duyệt');
    }
  }

  navigateToScreen = (screenName, screenParams) => {
    this.props.updateCoreNavParams(screenParams);
    this.props.navigation.navigate(screenName);
  }

  renderItem = ({ item, index }) => {
    const colorFromNoti = (!!this.state.listIds && this.state.listIds.some(x => x == item.ID)) ? Colors.OLD_LITE_BLUE : Colors.BLACK;
    const statusTextColor = item.STATUS === LICHTRUC_CONSTANT.STATUS.DA_PHE_DUYET ? Colors.GREEN_PANTONE_364C : Colors.BLACK;
    const thoihanText = `${convertDateToString(item.TUNGAY)} - ${convertDateToString(item.DENNGAY)}`;
    return (
      <View>
        <ListItem
          containerStyle={{ borderBottomColor: Colors.GRAY }}
          onPress={() => this.navigateToScreen("ListPersonalLichtrucScreen")}
          title={
            <RnText style={[{ fontWeight: 'bold', fontSize: moderateScale(12, 1.2), flexWrap: "wrap", color: colorFromNoti }]}>
              {item.KEHOACH}
            </RnText>
          }
          subtitle={
            <View style={{ marginTop: 8 }}>
              <ColumnedListItem
                leftText='Thời hạn:'
                rightText={thoihanText}
              />
              <ColumnedListItem
                isRender={!!item.BS_TRUC_THAM_VAN}
                leftText='Bác sĩ trực tham vấn:'
                rightText={item.BS_TRUC_THAM_VAN}
              />
              <ColumnedListItem
                isRender={!!item.BS_KIEM_TRA_TRUC}
                leftText='Bác sĩ kiểm tra trực:'
                rightText={item.BS_KIEM_TRA_TRUC}
              />
              <ColumnedListItem
                leftText='Trạng thái:'
                rightText={item.TenTrangThai}
                customRightText={{ color: statusTextColor }}
              />
            </View>
          }
          rightIcon={
            <View style={{ flexDirection: 'column' }}>
              {
                (item.DuongdanFile && item.DuongdanFile.length > 0)
                  ? <TouchableOpacity style={{ flexDirection: 'column' }} onPress={() => onDownloadFile(item.TENTAILIEU, item.DuongdanFile)}>
                    <RNEIcon name='download' color={Colors.GREEN_PANTON_369C} size={verticalScale(35)} type='entypo' />
                  </TouchableOpacity>
                  : <View />
              }
              {
                (item.STATUS && item.STATUS === LICHTRUC_CONSTANT.STATUS.BAN_THAO && !!item.canPheduyet) && <TouchableOpacity style={{ flexDirection: 'column' }} onPress={() => this.onConfirmLichtruc(item.ID)}>
                  <Image source={Images.icon_phe_duyet} style={{ height: verticalScale(35), width: verticalScale(35), resizeMode: 'stretch' }} />
                  {
                    // <RNEIcon name='check-circle' color={Colors.RED_PANTONE_021C} size={verticalScale(35)} type='material' />
                  }
                </TouchableOpacity>
              }
            </View>
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
          <Header searchBar rounded style={NativeBaseStyle.container}>
            <Left style={NativeBaseStyle.left}>
              <GoBackButton onPress={() => this.navigateBack()} buttonStyle='100%' />
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
                      : <MenuOption onSelect={() => this.changeListType(LICHTRUC_CONSTANT.CHUYEN_MON)} text="Lịch trực chuyên môn" customStyles={HeaderMenuStyle.optionStyles} />
                  }
                </MenuOptions>
              </Menu>
            </Right>
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
          <AlertMessage
            ref="confirmLichtruc"
            title="XÁC NHẬN PHÊ DUYỆT KẾ HOẠCH"
            bodyText="Bạn có chắc chắn muốn phê duyệt kế hoạch này không? Sau khi phê duyệt, bạn sẽ không thể chỉnh sửa lại kế hoạch nữa."
            exitText="HỦY BỎ"
          >
            <View style={AlertMessageStyle.leftFooter}>
              <TouchableOpacity onPress={() => this.submitConfirm()} style={AlertMessageStyle.footerButton}>
                <Text style={[AlertMessageStyle.footerText, { color: Colors.RED_PANTONE_186C }]}>
                  ĐỒNG Ý
                </Text>
              </TouchableOpacity>
            </View>
          </AlertMessage>
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