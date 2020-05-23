/**
 * @description: màn hình danh sách công việc con
 * @author: duynn
 * @since: 01/06/2018
 */

import React, { Component } from 'react';
import {
  ActivityIndicator, RefreshControl,
  View, Text as RnText, FlatList
} from 'react-native';

//redux
import { connect } from 'react-redux';

//lib
import {
  Container, Header, Item, Input, Icon, Title,
  Content, Left, Body, Toast, Right
} from 'native-base';
import { Icon as RneIcon, ListItem } from 'react-native-elements';
import renderIf from 'render-if';

//utilities
import {
  emptyDataPage, convertDateToString, asyncDelay
} from '../../../common/Utilities'
import { executeLoading } from '../../../common/Effect'
import {
  API_URL, DEFAULT_PAGE_INDEX,
  EMPTY_STRING, DEFAULT_PAGE_SIZE, COMMON_COLOR, TOAST_DURATION_TIMEOUT
} from '../../../common/SystemConstant';

//styles
import { scale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

import AlertMessage from "../../common/AlertMessage";

import * as navAction from '../../../redux/modules/Nav/Action';
import { MoreButton, GoBackButton, ColumnedListItem, AlertMessageButton, BubbleText } from '../../common';
import { taskApi } from '../../../common/Api';
import { ListPublishDocStyle } from '../../../assets/styles/PublishDocStyle';

class GroupSubTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userInfo.ID,
      taskId: props.coreNavParams.taskId,
      taskType: props.coreNavParams.taskType,
      data: [],
      dataItem: {},
      filterValue: EMPTY_STRING,
      pageIndex: DEFAULT_PAGE_INDEX,
      loadingMore: false,
      refreshing: false,
      searching: false,
      executing: false,

      canFinishTask: props.extendsNavParams.canFinishTask,
      canAssignTask: props.extendsNavParams.canAssignTask,

      alertIdHolder: 0,
      check: false,
      fromScreen: props.extendsNavParams.fromScreen || EMPTY_STRING,
    }
  }

  componentWillMount() {
    this.searchData();
  }

  searchData = () => {
    this.setState({
      searching: true,
      pageIndex: DEFAULT_PAGE_INDEX
    }, () => this.fetchData())
  }

  loadMoreData = () => {
    this.setState({
      loadingMore: true,
      pageIndex: this.state.pageIndex + 1
    }, () => this.fetchData())
  }

  fetchData = async () => {
    const { taskId, pageIndex, filterValue } = this.state;
    const resultJson = await taskApi().getSubTask([
      taskId,
      `${pageIndex}?query=${filterValue}`
    ]);

    this.setState({
      data: this.state.loadingMore ? [...this.state.data, ...resultJson] : resultJson,
      loadingMore: false,
      searching: false,
      refreshing: false
    })
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true,
      pageIndex: DEFAULT_PAGE_INDEX,
    }, () => {
      this.fetchData()
    })
  }

  onNavigateToAssignTask(id) {
    const targetScreenParam = {
      taskId: this.state.taskId,
      taskType: this.state.taskType,
      subTaskId: id
    }
    this.props.updateExtendsNavParams(targetScreenParam);
    this.props.navigation.navigate('AssignTaskScreen');
  }

  onConfirmCompleteTask(id) {
    this.setState({
      alertIdHolder: id
    }, () => {
      this.refs.confirm_4.showModal();
    });
  }

  onCompleteSubTask = async (id) => {
    this.refs.confirm_4.closeModal();
    this.setState({
      executing: true
    });

    const url = `${API_URL}/api/HscvCongViec/CompleteSubTask?id=${id}`;
    const headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8'
    });

    const result = await fetch(url, {
      method: 'post',
      headers
    });

    const resultJson = await result.json();

    await asyncDelay();

    this.setState({
      executing: false
    });

    Toast.show({
      text: 'Hoàn thành công việc ' + (resultJson.Status ? ' thành công' : ' không thành công'),
      type: resultJson.Status ? 'success' : 'danger',
      buttonText: "OK",
      buttonStyle: { backgroundColor: COMMON_COLOR.WHITE },
      buttonTextStyle: { color: resultJson.Status ? COMMON_COLOR.GREEN_PANTONE_364C : COMMON_COLOR.LITE_BLUE },
      duration: TOAST_DURATION_TIMEOUT,
      onClose: () => {
        if (resultJson.Status) {
          this.searchData();
        }
      }
    });
  }

  renderItem = ({ item }) => {
    const canAssign = this.state.canAssignTask && item.DAGIAOVIEC != true && !(item.TRANGTHAI_ID > 0);
    const canFinish = this.state.canFinishTask && item.DAGIAOVIEC != true && !(item.TRANGTHAI_ID > 0);

    let workerText = '', workerColor = COMMON_COLOR.BLACK;
    if (item.NGUOITHUCHIEN) {
      workerText = item.NGUOITHUCHIEN;
    } else {
      if (item.TRANGTHAI_ID > 0) {
        workerText = 'Tự thực hiện';
      } else {
        workerText = 'Chưa giao việc';
        workerColor = COMMON_COLOR.RED_PANTONE_186C;
      }
    }

    return (
      <ListItem
        containerStyle={{ borderBottomColor: COMMON_COLOR.GRAY, borderBottomWidth: .7 }}
        title={
          <RnText style={[{ fontWeight: 'bold', fontSize: moderateScale(12, 1.2), flexWrap: "wrap" }]}>
            {item.NOIDUNG}
          </RnText>
        }
        subtitle={
          <View style={{ marginLeft: scale(8) }}>
            <ColumnedListItem
              leftText='Hạn xử lý'
              rightText={convertDateToString(item.HANHOANTHANH)}
            />
            <ColumnedListItem
              leftText='Người thực hiện'
              rightText={workerText}
              customRightText={{ color: workerColor }}
            />
            <ColumnedListItem
              isRender={!!item.NGAYHOANTHANH}
              leftText='Ngày hoàn thành'
              rightText={convertDateToString(item.NGAYHOANTHANH)}
            />
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <BubbleText leftText='Độ khẩn' rightText={item.DOKHAN_TEXT} />
              <BubbleText leftText='Độ ưu tiên' rightText={item.DOUUTIEN_TEXT} />
            </View>
          </View>
        }
        rightIcon={
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {
              canAssign && <RneIcon name='check' onPress={() => this.onConfirmCompleteTask(item.ID)} size={moderateScale(35, 1.04)} color={COMMON_COLOR.GREEN_PANTON_376C} type='material-community' />
            }
            {
              canFinish && <RneIcon name='reply' onPress={() => this.onNavigateToAssignTask(item.ID)} size={moderateScale(35, 1.04)} color={COMMON_COLOR.DANK_BLUE} type='material-community' />
            }
          </View>
        }
      />
    );
  }

  componentDidMount = () => {
    this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
      if (this.props.extendsNavParams) {
        if (this.props.extendsNavParams.hasOwnProperty("check")) {
          if (this.props.extendsNavParams.check === true) {
            this.setState({ check: true }, () => this.searchData());
            this.props.updateExtendsNavParams({ check: false });
          }
        }
      }
    });
  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }

  navigateBackToDetail = () => {
    this.props.updateExtendsNavParams({ check: false });
    if (this.state.fromScreen === "createSubTask") {
      this.props.navigation.pop(2);
    }
    else {
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <Container>
        <Header searchBar style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBackToDetail()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              CÔNG VIỆC CON
                        </Title>
          </Body>
          <Right style={NativeBaseStyle.right} />
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>

          <Item>
            <Icon name='ios-search' />
            <Input
              placeholder={'Tên công việc'}
              onSubmitEditing={() => this.searchData()}
              value={this.state.filterValue}
              onChangeText={(filterValue) => this.setState({ filterValue })} />
          </Item>

          {
            renderIf(this.state.searching)(
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size={indicatorResponsive} animating color={COMMON_COLOR.BLUE_PANTONE_640C} />
              </View>
            )
          }

          {
            renderIf(!this.state.searching)(
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={this.state.data}
                renderItem={this.renderItem}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    title='Kéo để làm mới'
                    COMMON_COLOR={[COMMON_COLOR.BLUE_PANTONE_640C]}
                    tintColor={[COMMON_COLOR.BLUE_PANTONE_640C]}
                    titleColor='red'
                  />
                }
                ListEmptyComponent={() => emptyDataPage()}
                ListFooterComponent={() => (<MoreButton
                  isLoading={this.state.loadingMore}
                  isTrigger={this.state.data.length >= DEFAULT_PAGE_SIZE}
                  loadmoreFunc={this.loadMoreData}
                />)}
              />
            )
          }
        </Content>

        {
          executeLoading(this.state.executing)
        }

        <AlertMessage
          ref="confirm_4"
          title="XÁC NHẬN HOÀN THÀNH"
          bodyText="Bạn có chắc chắn đã hoàn thành công việc này?"
          exitText="HUỶ BỎ"
        >
          <AlertMessageButton btnText='ĐỒNG Ý' onPress={() => this.onCompleteSubTask(this.state.alertIdHolder)} />
        </AlertMessage>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userState.userInfo,
    coreNavParams: state.navState.coreNavParams,
    extendsNavParams: state.navState.extendsNavParams
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupSubTask);