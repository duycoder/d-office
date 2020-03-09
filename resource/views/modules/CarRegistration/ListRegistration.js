/**
 * @description: danh sách lịch trình xe
 * @author: annv
 * @since: 03/09/2019
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
import { SearchSection, AddButton, MoreButton, ColumnedListItem, GoBackButton } from '../../common';
import { dataLoading } from '../../../common/Effect';

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

    let driverText = !!item.TEN_LAIXE ? item.TEN_LAIXE : EMPTY_STRING;
    if (!!item.DIEN_THOAI_LAI_XE) {
      driverText += ` - ${item.DIEN_THOAI_LAI_XE}`;
    }

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

          subtitle={
            <View style={{ marginLeft: scale(8) }}>
              <ColumnedListItem
                isRender={!!item.TEN_CHUYENXE && !!item.TEN_XE}
                leftText='Tên chuyến:'
                rightText={`${item.TEN_CHUYENXE.split("-").shift()} - ${item.TEN_XE}`}
              />

              <ColumnedListItem
                isRender={!!item.TEN_LAIXE}
                leftText='Lái xe:'
                rightText={driverText}
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
      </View>
    );
  }

  _handleFieldNameChange = fieldName => text => {
    this.setState({
      [fieldName]: text
    });
  }

  render() {
    const { loadingData, data, refreshingData, loadingMoreData, filterValue } = this.state;
    let bodyContent = dataLoading(loadingData);
    if (!loadingData) {
      bodyContent = (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshingData}
              onRefresh={this.handleRefresh}
              colors={[Colors.BLUE_PANTONE_640C]}
              tintColor={[Colors.BLUE_PANTONE_640C]}
              title='Kéo để làm mới'
              titleColor={Colors.RED}
            />
          }
          ListEmptyComponent={() => loadingData ? null : emptyDataPage()}
          ListFooterComponent={() => (<MoreButton
            isLoading={loadingMoreData}
            isTrigger={data && data.length >= DEFAULT_PAGE_SIZE}
            loadmoreFunc={this.loadingMore}
          />)}
        />
      );
    }

    return (
      <Container>
        <Header searchBar rounded style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} buttonStyle='100%' />
          </Left>

          <SearchSection
            filterValue={filterValue}
            placeholderText='Nội dung'
            filterFunc={this.onFilter}
            handleChangeFunc={this._handleFieldNameChange}
            clearFilterFunc={this.onClearFilter}
          />
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>
          {bodyContent}
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams)),
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(ListRegistration);