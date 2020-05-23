/**
 * @description: màn hình công việc
 * @author: duynn
 * @since: 29/05/2018
 */
'use strict'
import React, { Component } from 'react';
import {
  ActivityIndicator, View, Text as RnText,
  FlatList, RefreshControl,
} from 'react-native';
import HTMLView from 'react-native-htmlview';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';

//lib
import {
  Container, Header, Left, Content,
} from 'native-base';
import { ListItem, Icon as RNEIcon } from 'react-native-elements';
import renderIf from 'render-if';

//constant
import {
  API_URL, EMPTY_STRING,
  CONGVIEC_CONSTANT,
  DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE,
  COMMON_COLOR,
  DOKHAN_CONSTANT,
  COMMON_REGEX
} from '../../../common/SystemConstant';

//utilities
import { indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { executeLoading } from '../../../common/Effect';
import { getColorCodeByProgressValue, convertDateToString, emptyDataPage, asyncDelay } from '../../../common/Utilities';

//styles
import { ListTaskStyle, DetailTaskStyle } from '../../../assets/styles/TaskStyle';
import { NativeBaseStyle } from '../../../assets/styles';
import { SearchSection, MoreButton, AddButton, GoBackButton } from '../../common';
import { taskApi } from '../../../common/Api';

class BaseTaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userInfo.ID,

      filterValue: EMPTY_STRING,
      data: [],

      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,

      executing: false,
      loadingData: false,
      refreshingData: false,
      searchingData: false,
      loadingMoreData: false,
      taskType: props.taskType || props.coreNavParams.taskType
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
    this.willFocusListener = navObj.addListener('didFocus', () => {
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
    this.willFocusListener.remove();
  }

  async fetchData() {
    const refreshingData = this.state.refreshingData;
    const loadingData = this.state.loadingData;

    const {
      userId, pageSize, pageIndex, filterValue
    } = this.state;

    let apiUrlParam = 'PersonalWork';

    const { taskType } = this.state;
    if (taskType == CONGVIEC_CONSTANT.DUOC_GIAO) {
      apiUrlParam = 'AssignedWork';
    } else if (taskType == CONGVIEC_CONSTANT.PHOIHOP_XULY) {
      apiUrlParam = 'CombinationWork';
    } else if (taskType == CONGVIEC_CONSTANT.DAGIAO_XULY) {
      apiUrlParam = 'ProcessedJob';
    } else if (taskType == CONGVIEC_CONSTANT.CHO_XACNHAN) {
      apiUrlParam = 'PendingConfirmWork'
    } else if (taskType == CONGVIEC_CONSTANT.CUA_THUKY) {
      apiUrlParam = 'CommandingWork';
    }

    const resultJson = await taskApi().getList([
      apiUrlParam,
      userId,
      pageSize,
      `${pageIndex}?query=${filterValue}`
    ]);

    this.setState({
      loadingData: false,
      refreshingData: false,
      searchingData: false,
      loadingMoreData: false,
      data: (loadingData || refreshingData) ? resultJson.ListItem : [...this.state.data, ...resultJson.ListItem]
    });
  }

  onFilter() {
    this.setState({
      loadingData: true,
      pageIndex: DEFAULT_PAGE_INDEX
    }, () => {
      this.fetchData();
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

  onLoadingMore = () => {
    this.setState({
      loadingMoreData: true,
      pageIndex: this.state.pageIndex + 1
    }, () => {
      this.fetchData();
    })
  }

  handleRefresh = () => {
    this.setState({
      refreshingData: true,
      pageIndex: DEFAULT_PAGE_INDEX
    }, () => {
      this.fetchData();
    })
  }

  navigateToDetail = async (taskId = 0) => {
    if (taskId > 0) {
      let targetScreenParam = {
        taskId,
        taskType: this.state.taskType
      }

      this.props.updateCoreNavParams(targetScreenParam);
      this.props.navigator.navigate("DetailTaskScreen");
    }
    else {
      let targetScreenParam = {
        fromScreen: "ListPersonalTaskScreen",

      }
      this.props.updateExtendsNavParams(targetScreenParam);
      this.props.navigator.navigate("CreateTaskScreen");
    }
  }

  getListSubTasks = async (index, isExpand, taskId, parentIds) => {
    if (isExpand == false) {
      this.setState({
        executing: true
      });

      const taskObj = {
        rootParentId: taskId,
        userId: this.state.userId,
        parentIds
      }

      const url = `${API_URL}/api/HscvCongViec/GetListSubTasks`;
      const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      });
      const body = JSON.stringify(taskObj);

      const result = await fetch(url, {
        method: 'post',
        headers,
        body
      });

      const resultJson = await result.json();

      //thêm đối tượng vào mảng
      this.state.data.splice((index + 1), 0, ...resultJson);

      //sửa hiển thị icon của công việc cha
      this.state.data = this.state.data.map((item) => {
        if (item.ID == taskId) {
          return { ...item, isExpand: true };
        }
        return item;
      })

      await asyncDelay();

      this.setState({
        executing: false,
        data: this.state.data
      })
    } else {
      this.state.data = this.state.data.filter(item => (item.parentIds == null || item.parentIds.indexOf(taskId) < 0));
      //sửa hiển thị icon của công việc con
      this.state.data = this.state.data.map((item) => {
        if (item.ID == taskId) {
          return { ...item, isExpand: false }
        }
        return item;
      })

      this.setState({
        data: this.state.data
      })
    }
  }

  renderItem = ({ item }) => {
    const readStateTextStyle = item.IS_READ === true ? ListTaskStyle.textRead : ListTaskStyle.textNormal,
      progressColor = getColorCodeByProgressValue(item.PHANTRAMHOANTHANH),
      progressText = `${item.PHANTRAMHOANTHANH || 0}%`;

    let progressBars = Math.floor(item.PHANTRAMHOANTHANH / 10),
      renderBars = new Array(10).fill(0);

    while (progressBars > -1) {
      renderBars[--progressBars] = 1;
    }

    const dokhanBgColor = item.DOKHAN == DOKHAN_CONSTANT.THUONG_KHAN
      ? COMMON_COLOR.RED_PANTONE_186C
      : ((item.DOKHAN == DOKHAN_CONSTANT.KHAN) ? COMMON_COLOR.RED_PANTONE_021C : COMMON_COLOR.GREEN_PANTONE_364C);

    return (
      <View>
        <ListItem
          containerStyle={{ borderBottomWidth: 0, paddingBottom: 0 }}
          title={
            <RnText style={[readStateTextStyle, { fontWeight: 'bold', fontSize: moderateScale(12, 1.2) }]}>
              {item.TENCONGVIEC}
            </RnText>
          }

          subtitle={
            <View style={{ marginTop: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: "35%" }}>
                  <RnText style={{ color: COMMON_COLOR.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                    Hạn xử lý:
                                    </RnText>
                </View>
                <View style={{ width: "65%" }}>
                  <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                    {' ' + convertDateToString(item.NGAYHOANTHANH_THEOMONGMUON)}
                  </RnText>
                </View>
              </View>
              {
                (item.NOIDUNGCONGVIEC && item.NOIDUNGCONGVIEC.length > 0) && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ width: "35%" }}>
                    <RnText style={{ color: COMMON_COLOR.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                      Nội dung:
                                        </RnText>
                  </View>
                  <View style={{ width: "65%" }}>
                    {
                      item.NOIDUNGCONGVIEC.match(COMMON_REGEX.HTML_STRIP_PATTERN)
                        ? <HTMLView
                          value={item.NOIDUNGCONGVIEC}
                          stylesheet={{ p: [DetailTaskStyle.listItemSubTitleContainer, { fontSize: moderateScale(12, 1.1), marginHorizontal: 3 }] }}
                        />
                        : <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                          {' ' + item.NOIDUNGCONGVIEC}
                        </RnText>
                    }
                  </View>
                </View>
              }
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: "35%" }}>
                  <RnText style={{ color: COMMON_COLOR.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
                    Người xử lý chính:
                                    </RnText>
                </View>
                <View style={{ width: "65%" }}>
                  {
                    (item.TEN_NGUOIXULYCHINH && item.TEN_NGUOIXULYCHINH.length > 0)
                      ? <RnText style={{ fontSize: moderateScale(12, 1.1) }}>
                        {' ' + item.TEN_NGUOIXULYCHINH}
                      </RnText>
                      : <RnText style={{ fontSize: moderateScale(12, 1.1), color: COMMON_COLOR.RED_PANTONE_186C }}>
                        {' Chưa giao việc'}
                      </RnText>
                  }
                </View>
              </View>
            </View>
          }
          rightIcon={
            <View style={{ flexDirection: 'column' }}>
              <RNEIcon name='flag' size={moderateScale(26, 0.64)} color={dokhanBgColor} type='material-community' />
              {
                item.HAS_FILE == true && <RNEIcon name='ios-attach' size={26} type='ionicon' />
              }
            </View>
          }
          onPress={() => this.navigateToDetail(item.ID)}
        />
        <View style={{ paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }}>
          <RnText style={{ fontSize: moderateScale(12, 1.1), fontWeight: 'bold', textAlign: "right" }}>{progressText}</RnText>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
            {
              renderBars.map((item, index) => {
                let bgColor = COMMON_COLOR.GRAY;
                if (!!item) {
                  bgColor = progressColor;
                }
                return (
                  <View key={index.toString()} style={[ListTaskStyle.progressBars, { backgroundColor: bgColor }]}></View>
                );
              })
            }
          </View>
        </View>
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
          <Left style={{ flex: 1 }}>
            <GoBackButton onPress={() => this.props.navigator.goBack()} buttonStyle='100%' />
          </Left>

          <SearchSection
            placeholderText='Tên công việc'
            filterFunc={this.onFilter}
            handleChangeFunc={this._handleFieldNameChange}
            filterValue={this.state.filterValue}
            clearFilterFunc={this.onClearFilter}
          />
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>
          {
            renderIf(this.state.loadingData)(
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size={indicatorResponsive} animating color={COMMON_COLOR.BLUE_PANTONE_640C} />
              </View>
            )
          }

          {
            renderIf(!this.state.loadingData)(
              <FlatList
                data={this.state.data}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={this.renderItem}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshingData}
                    onRefresh={this.handleRefresh}
                    title='Kéo để làm mới'
                    COMMON_COLOR={[COMMON_COLOR.BLUE_PANTONE_640C]}
                    tintColor={[COMMON_COLOR.BLUE_PANTONE_640C]}
                    titleColor={COMMON_COLOR.RED}
                  />
                }
                ListFooterComponent={() => (<MoreButton
                  isLoading={this.state.loadingMoreData}
                  isTrigger={this.state.data.length >= DEFAULT_PAGE_SIZE}
                  loadmoreFunc={this.onLoadingMore} />)}
                ListEmptyComponent={() => emptyDataPage()}
              />
            )
          }

          {
            executeLoading(this.state.executing)
          }

        </Content>

        <AddButton
          hasPermission={this.state.taskType === CONGVIEC_CONSTANT.CA_NHAN}
          createFunc={this.navigateToDetail}
        />
      </Container>
    )
  }
}

const mapStatetoProps = (state) => {
  return {
    userInfo: state.userState.userInfo,
    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCoreNavParams: (coreNavParams) => dispatch(navAction.updateCoreNavParams(coreNavParams)),
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(BaseTaskList);