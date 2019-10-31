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

class PickMeetingRoom extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: props.userInfo.ID,
      lichhopId: this.props.extendsNavParams.lichhopId,

      executing: false,
      loadingData: false,

      rooms: [],

      chosenRoom: 0,

      roomFilterValue: EMPTY_STRING,

      roomPageIndex: DEFAULT_PAGE_INDEX,

      //hiệu ứng
      searchingInRoom: false,
      loadingMoreInRoom: false,
    }
  }

  componentDidMount = () => {
    this.fetchData();
  }

  async fetchData() {
    this.setState({
      loadingData: true
    });

    const url = `${API_URL}/api/MeetingRoom/SearchPhonghop/10/${this.state.roomPageIndex}/${this.state.roomFilterValue}`;
    const result = await fetch(url);
    const resultJson = await result.json();

    this.setState({
      loadingData: false,
      rooms: resultJson.Params || [],
    })
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  saveRoom = async () => {
    //validate
    const {
      rooms, chosenRoom, lichhopId, userId
    } = this.state;
    if (rooms.length > 0) {
      if (chosenRoom === 0){
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

        const url = `${API_URL}/api/MeetingRoom/SavePhonghop`;
        const headers = new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8'
        });
        const body = JSON.stringify({
          userId,
          meetingCalendarId: lichhopId,
          meetingRoomId: chosenRoom
        });

        const result = await fetch(url, {
          method: 'POST',
          headers,
          body
        });

        const resultJson = await result.json();

        await asyncDelay();

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
    const url = `${API_URL}/api/MeetingRoom/SearchPhonghop/10/${this.state.roomPageIndex}/${this.state.roomFilterValue}`;
    const result = await fetch(url);
    const resultJson = await result.json();
    this.setState({
      searchingInRoom: false,
      loadingMoreInRoom: false,
      rooms: this.state.searchingInRoom ? (resultJson.Params || []) : [...this.state.rooms, ...(resultJson.Params || [])]
    })
  }

  onFilter = () => {
    this.setState({
      chosenRoom: 0,
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

  onSelectRoom = (roomId) => {
    this.setState({ chosenRoom: roomId });
  }

  renderRooms = ({ item }) => {
    const nameCode = item.Text.split(" - ")
    return (
      <ListItem
        key={item.Value.toString()}
        onPress={() => this.onSelectRoom(item.Value)}
        style={{ height: 60 }}>
        <Left>
          <Title>
            <Text>
              {nameCode[0]}
            </Text>
          </Title>
        </Left>

        <Body>
          <Title>
            <Text>
              {nameCode[1]}
            </Text>
          </Title>
        </Body>

        <Right>
          <CheckBox
            onPress={() => this.onSelectRoom(item.Value)}
            checked={(this.state.chosenRoom == item.Value)}
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
                  ListFooterComponent={
                    this.state.loadingMoreInRoom ?
                      <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
                      (
                        this.state.rooms.length >= 5 ?
                          <Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadingMore(true)}>
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
      );
    }

    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={[NativeBaseStyle.body, { flex: 5 }]}>
            <Title style={NativeBaseStyle.bodyTitle}>
              ĐẶT PHÒNG HỌP
            </Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <Button transparent onPress={() => this.saveRoom()}>
              <RneIcon name='md-send' size={verticalScale(30)} color={Colors.WHITE} type='ionicon' />
            </Button>
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
