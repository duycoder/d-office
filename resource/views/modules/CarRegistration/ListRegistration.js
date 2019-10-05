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
import { ItemProportion } from '../../../assets/styles/ListLayoutStyles';

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
    const url = `${API_URL}/api/CarRegistration/ListCarRegistration/${this.state.pageSize}/${this.state.pageIndex}/${this.state.userId}?query=${this.state.filterValue}`;

    const result = await fetch(url);
    const resultJson = await result.json();

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
            <View style={{ marginLeft: 8 }}>
              {
                // <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                //   <View style={ItemProportion.leftPart}>
                //     <RnText style={{ color: Colors.VERY_DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                //       Thời gian xuất phát:
                //   </RnText>
                //   </View>
                //   <View style={ItemProportion.rightPart}>
                //     <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                //       {' ' + [timePart, datePart].join(" - ")}
                //     </RnText>
                //   </View>
                // </View>
              }
              {
                (!!item.TEN_CHUYENXE && !!item.TEN_XE) && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={ItemProportion.leftPart}>
                    <RnText style={{ color: Colors.VERY_DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                      Tên chuyến:
                    </RnText>
                  </View>
                  <View style={ItemProportion.rightPart}>
                    <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                      {`${item.TEN_CHUYENXE.split("-").shift()} - ${item.TEN_XE}`}
                    </RnText>
                  </View>
                </View>
              }

              {
                (!!item.TEN_LAIXE && !!item.DIEN_THOAI_LAI_XE) && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={ItemProportion.leftPart}>
                    <RnText style={{ color: Colors.VERY_DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                      Lái xe:
                    </RnText>
                  </View>
                  <View style={ItemProportion.rightPart}>
                    <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                      {`${item.TEN_LAIXE} - ${item.DIEN_THOAI_LAI_XE}`}
                    </RnText>
                  </View>
                </View>
              }

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={ItemProportion.leftPart}>
                  <RnText style={{ color: Colors.VERY_DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                    Nội dung:
                </RnText>
                </View>
                <View style={ItemProportion.rightPart}>
                  <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                    {formatLongText(item.MUCDICH, 50)}
                  </RnText>
                </View>
              </View>
              {
                item.DIEM_XUATPHAT && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={ItemProportion.leftPart}>
                    <RnText style={{ color: Colors.VERY_DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                      Điểm đi:
                </RnText>
                  </View>
                  <View style={ItemProportion.rightPart}>
                    <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                      {item.DIEM_XUATPHAT}
                    </RnText>
                  </View>
                </View>
              }
              {
                item.DIEM_KETTHUC && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={ItemProportion.leftPart}>
                    <RnText style={{ color: Colors.VERY_DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                      Điểm đến:
                    </RnText>
                  </View>
                  <View style={ItemProportion.rightPart}>
                    <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                      {item.DIEM_KETTHUC}
                    </RnText>
                  </View>
                </View>
              }

              {
                !!item.TEN_DONVI_DEXUAT && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={ItemProportion.leftPart}>
                    <RnText style={{ color: Colors.VERY_DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                      Đơn vị đề xuất:
                    </RnText>
                  </View>
                  <View style={ItemProportion.rightPart}>
                    <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                      {item.NGUOIDANGKY}
                    </RnText>
                  </View>
                </View>
              }

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={ItemProportion.leftPart}>
                  <RnText style={{ color: Colors.VERY_DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                    Trạng thái:
                  </RnText>
                </View>
                <View style={ItemProportion.rightPart}>
                  <RnText style={{ fontSize: moderateScale(12, 1.1), color: item.MAU_TRANGTHAI, fontWeight: 'bold' }}>
                    {item.TEN_TRANGTHAI}
                  </RnText>
                </View>
              </View>
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

  render() {
    return (
      <Container>
        <Header searchBar rounded style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <TouchableOpacity onPress={() => this.navigateBack()} style={{ width: '100%' }}>
              <RNEIcon name="ios-arrow-back" size={30} color={Colors.WHITE} type="ionicon" />
            </TouchableOpacity>
          </Left>

          <Item style={{ backgroundColor: Colors.WHITE, flex: 10 }}>
            <Icon name='ios-search' />
            <Input placeholder='Nội dung'
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
        <Fab
          active={true}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: Colors.MENU_BLUE }}
          position="bottomRight"
          onPress={() => this.onCreateCarRegistration()}>
          <Icon name="add" />
        </Fab>
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