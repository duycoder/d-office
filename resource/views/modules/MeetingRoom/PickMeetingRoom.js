/**
 * @description: màn hình trình xử lý văn bản
 * @author: duynn
 * @since: 16/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { ActivityIndicator, View, Text as RnText, FlatList } from 'react-native';

//utilites
import {
  API_URL, HEADER_COLOR, LOADER_COLOR, LOADMORE_COLOR, EMPTY_STRING,
  DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, WORKFLOW_PROCESS_TYPE, Colors,
  MODULE_CONSTANT,
  TOAST_DURATION_TIMEOUT
} from '../../../common/SystemConstant';
import { asyncDelay, emptyDataPage, backHandlerConfig, appGetDataAndNavigate, formatMessage } from '../../../common/Utilities';
import { verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';
import * as util from 'lodash';
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//effect
import { dataLoading, executeLoading } from '../../../common/Effect';

//redux
import { connect } from 'react-redux';
import * as workflowAction from '../../../redux/modules/Workflow/Action';
import * as navAction from '../../../redux/modules/Nav/Action';


//lib
import {
  Container, Header, Left, Button, Content, Title,
  Tabs, Tab, TabHeading, ScrollableTab, Text, Icon,
  Form, Textarea, Body, Item, Input, Right, Toast,
  Label, ListItem, CheckBox
} from 'native-base';
import renderIf from 'render-if';
import { Icon as RneIcon } from 'react-native-elements';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//views
import GoBackButton from '../../common/GoBackButton';
import { meetingRoomApi } from '../../../common/Api';
import { MoreButton, HeaderRightButton } from '../../common';

const MeetingRoomApi = meetingRoomApi();

class PickMeetingRoom extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: props.userInfo.ID,
      lichhopId: props.extendsNavParams.lichhopId || 0,

      executing: false,
      loadingData: false,

      rooms: [],

      phonghopId: props.extendsNavParams.phonghopId || 0,
      phonghopName: props.extendsNavParams.phonghopName || EMPTY_STRING,

      roomFilterValue: EMPTY_STRING,

      roomPageIndex: DEFAULT_PAGE_INDEX,
      roomPageSize: DEFAULT_PAGE_SIZE,

      //hiệu ứng
      searchingInRoom: false,
      loadingMoreInRoom: false,

      startHour: props.extendsNavParams.startHour || 0,
      startMinute: props.extendsNavParams.startMinute || 0,
      endHour: props.extendsNavParams.endHour || 0,
      endMinute: props.extendsNavParams.endMinute || 0,
      currentDate: props.extendsNavParams.currentDate || EMPTY_STRING,

      fromScreen: props.extendsNavParams.fromScreen || "detailMeetingDay", // createMeetingDay OR detailMeetingDay
    };
  }

  componentDidMount = () => {
    this.fetchData();
  }

  async fetchData() {
    this.setState({
      loadingData: true
    });

    const {
      roomPageIndex, roomPageSize, roomFilterValue, lichhopId,
      startHour, startMinute, endHour, endMinute, userId, currentDate
    } = this.state;

    const resultJson = await MeetingRoomApi.getRooms({
      pageIndex: roomPageIndex,
      pageSize: roomPageSize,
      query: roomFilterValue,
      meetingCalendarId: lichhopId,
      startHour,
      startMinute,
      endHour,
      endMinute,
      userId,
      currentDate
    });

    this.setState({
      loadingData: false,
      rooms: resultJson.Params || [],
    })
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  preSaveRoom = () => {
    const {
      fromScreen,
      phonghopName, phonghopId
    } = this.state;

    if (fromScreen === "detailMeetingDay") {
      this.saveRoom();
    }
    else {
      this.props.updateExtendsNavParams({
        phonghopName,
        phonghopId
      });
      this.navigateBack();
    }
  }

  saveRoom = async () => {
    //validate
    const {
      rooms, phonghopId, lichhopId, userId
    } = this.state;
    if (rooms.length > 0) {
      if (phonghopId === 0) {
        Toast.show({
          text: 'Vui lòng chọn phòng họp',
          type: 'danger',
          buttonText: "OK",
          buttonStyle: { backgroundColor: Colors.WHITE },
          buttonTextStyle: { color: Colors.LITE_BLUE },
        });
      }
      else {
        this.setState({
          executing: true
        });

        const resultJson = await MeetingRoomApi.saveRoom({
          userId,
          meetingCalendarId: lichhopId,
          meetingRoomId: phonghopId
        });

        this.setState({
          executing: false
        })

        Toast.show({
          text: 'Đặt phòng họp ' + resultJson.Status ? 'thành công' : 'thất bại',
          type: resultJson.Status ? 'success' : 'danger',
          buttonText: "OK",
          buttonStyle: { backgroundColor: Colors.WHITE },
          buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.RED_PANTONE_186C },
          duration: TOAST_DURATION_TIMEOUT,
          onClose: () => {
            if (resultJson.Status) {
              this.props.updateExtendsNavParams({ check: true });
              this.navigateBack();
            }
          }
        });
      }
    }
  }

  filtlerRooms = async () => {
    const {
      roomPageIndex, roomPageSize, roomFilterValue, lichhopId,
      startHour, startMinute, endHour, endMinute, currentDate, userId
    } = this.state;

    const resultJson = await MeetingRoomApi.getRooms({
      pageIndex: roomPageIndex,
      pageSize: roomPageSize,
      query: roomFilterValue,
      meetingCalendarId: lichhopId,
      startHour,
      startMinute,
      endHour,
      endMinute,
      userId,
      currentDate
    });

    this.setState({
      searchingInRoom: false,
      loadingMoreInRoom: false,
      rooms: this.state.searchingInRoom ? (resultJson.Params || []) : [...this.state.rooms, ...(resultJson.Params || [])]
    })
  }

  onFilter = () => {
    this.setState({
      phonghopId: 0,
      searchingInRoom: true,
      roomPageIndex: DEFAULT_PAGE_INDEX
    }, () => this.filtlerRooms());
  }
  onClearFilter = () => {
    this.setState({
      loadingData: true,
      pageIndex: DEFAULT_PAGE_INDEX,
      roomFilterValue: EMPTY_STRING
    }, () => {
      this.fetchData()
    });
  }

  loadingMore = () => {
    this.setState({
      loadingMoreInRoom: true,
      roomPageIndex: this.state.roomPageIndex + 1
    }, () => this.filtlerRooms());
  }

  onSelectRoom = (phonghopId, phonghopName) => {
    this.setState({
      phonghopId,
      phonghopName
    });
  }

  renderRooms = ({ item }) => {
    return (
      <ListItem
        key={item.Value.toString()}
        onPress={() => this.onSelectRoom(item.Value, item.Text)}
        style={{ height: 60 }}>
        <Left>
          <Title>
            <Text>
              {item.Text}
            </Text>
          </Title>
        </Left>

        <Right>
          <CheckBox
            onPress={() => this.onSelectRoom(item.Value, item.Text)}
            checked={(this.state.phonghopId == item.Value)}
            style={{ alignSelf: "center" }}
          />
        </Right>
      </ListItem>
    );
  }

  render() {
    let bodyContent = null;

    if (!this.state.loadingData) {
      bodyContent = (
        <Container>
          <Item>
            <Icon name='ios-search' style={{ marginLeft: 5 }} />
            <Input placeholder='Tên phòng'
              value={this.state.roomFilterValue}
              onSubmitEditing={() => this.onFilter(true)}
              onChangeText={(roomFilterValue) => this.setState({ roomFilterValue })} />
            {
              (this.state.roomFilterValue !== EMPTY_STRING)
              && <Icon name='ios-close-circle' onPress={() => this.onClearFilter(true)} />
            }
          </Item>

          <Content contentContainerStyle={{ flex: 1 }}>
            {
              renderIf(this.state.searchingInRoom)(
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
                </View>
              )
            }

            {
              renderIf(!this.state.searchingInRoom)(
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  data={this.state.rooms}
                  renderItem={this.renderRooms}
                  ListEmptyComponent={
                    this.state.loadingData ? null : emptyDataPage()
                  }
                  ListFooterComponent={() => (<MoreButton
                    isLoading={this.state.loadingMoreInRoom}
                    isTrigger={this.state.rooms.length >= 5}
                    loadmoreFunc={this.loadingMore}
                  />)}
                />
              )
            }
          </Content>
        </Container>
      );
    }

    return (
      <Container>
        <Header hasTabs style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={[NativeBaseStyle.body, { flex: 5 }]}>
            <Title style={NativeBaseStyle.bodyTitle}>
              ĐẶT PHÒNG HỌP
            </Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <HeaderRightButton onPress={() => this.preSaveRoom()} />
          </Right>
        </Header>
        {
          renderIf(this.state.loadingData)(
            dataLoading(true)
          )
        }

        {
          renderIf(!this.state.loadingData)(
            bodyContent
          )
        }

        {
          executeLoading(this.state.executing)
        }
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userState.userInfo,
    extendsNavParams: state.navState.extendsNavParams,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PickMeetingRoom);
