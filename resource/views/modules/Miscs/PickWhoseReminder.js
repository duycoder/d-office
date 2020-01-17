/*
* @description: màn hình giao việc
* @author: duynn
* @since: 13/05/2018
*/
'use strict'
import React, { Component } from 'react';
import {
  ActivityIndicator, FlatList
} from 'react-native'
//lib
import {
  Container, Content, Segment, Button, Text, Icon, Item, Input,
  Header, Left, Body, Title, View, Tabs, Tab, TabHeading,
  Right, Toast, ListItem as NbListItem, Radio, CheckBox
} from 'native-base';
import {
  Icon as RneIcon
} from 'react-native-elements';
import renderIf from 'render-if';
import * as util from 'lodash';

//redux
import { connect } from 'react-redux';
import * as taskAction from '../../../redux/modules/CongViec/Action';
import * as navAction from '../../../redux/modules/Nav/Action';
//utilities
import {
  API_URL, HEADER_COLOR, DEFAULT_PAGE_INDEX,
  EMPTY_STRING, LOADER_COLOR, LOADMORE_COLOR,
  TASK_PROCESS_TYPE, Colors, DEFAULT_PAGE_SIZE
} from '../../../common/SystemConstant';
import { asyncDelay, emptyDataPage, backHandlerConfig, appGetDataAndNavigate, formatMessage } from '../../../common/Utilities';
import { dataLoading, executeLoading } from '../../../common/Effect';
import { verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//views
import GoBackButton from '../../common/GoBackButton';
import { reminderApi } from '../../../common/Api';
import { MoreButton, HeaderRightButton } from '../../common';

class PickWhoseReminder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userInfo.ID,

      executing: false,
      loading: false,

      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: 20,
      isLoadmore: false,
      isSearch: false,

      data: [],
      giamdocId: props.extendsNavParams.giamdocId || 0,
      giamdocName: props.extendsNavParams.giamdocName || null,
      keyword: null,
    }
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = async (isLoadmore = false) => {
    const {
      pageIndex, pageSize, keyword
    } = this.state;

    this.setState({
      loading: isLoadmore ? false : true
    });

    const resultJson = await reminderApi().getWhoseReminder([
      pageSize,
      pageIndex,
      keyword ? keyword.trim().toLowerCase() : ""
    ]);

    this.setState({
      data: isLoadmore ? [...this.state.data, ...resultJson.Params] : resultJson.Params,
      loading: false,
      isLoadmore: isLoadmore && false
    })
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  onPickGiamdoc = () => {
    const {
      giamdocId, giamdocName
    } = this.state;
    if (giamdocId === 0) {
      Toast.show({
        text: 'Vui lòng chọn được nhắc nhở',
        type: 'danger',
        buttonText: "OK",
        buttonStyle: { backgroundColor: Colors.WHITE },
        buttonTextStyle: { color: Colors.LITE_BLUE },
      });
    } else {
      this.props.updateExtendsNavParams({ giamdocId, giamdocName });
      this.navigateBack();
    }
  }

  selectUser = (itemName, itemId) => {
    this.setState({
      giamdocId: itemId,
      giamdocName: itemName
    });
  }

  renderMainAssigner = ({ item }) => {
    return (
      <NbListItem
        key={item.Value}
        onPress={() => this.selectUser(item.Text, item.Value)}
        style={{ height: verticalScale(60) }}
      >
        <Left>
          <Title>
            <Text>
              {item.Text}
            </Text>
          </Title>
        </Left>

        <Right>
          <CheckBox
            color={Colors.LITE_BLUE}
            checked={this.state.giamdocId == item.Value}
            onPress={() => this.selectUser(item.Text, item.Value)}
          />
        </Right>
      </NbListItem>
    );
  }

  onFilter = () => {
    this.setState({
      isSearch: true,
      pageIndex: DEFAULT_PAGE_INDEX
    }, () => this.fetchData());
  }
  clearFilter = () => {
    this.setState({
      isSearch: false,
      keyword: null,
    }, () => this.fetchData())
  }
  loadingMore = () => {
    this.setState({
      pageIndex: this.state.pageIndex + 1,
      isLoadmore: true
    }, () => this.fetchData(true));
  }

  render() {
    // console.tron.log(this.state.giamdocId)
    let unsubmitableCondition = this.state.giamdocId === 0,
      checkButtonStyle = unsubmitableCondition ? { opacity: 0.6 } : { opacity: 1 };

    let bodyContent = null;

    if (this.state.loading) {
      bodyContent = dataLoading(true);
    }
    else {
      bodyContent = (
        <Content contentContainerStyle={{ flex: 1 }}>
          <Item style={{ paddingLeft: 10 }}>
            <Icon name='ios-search' />
            <Input placeholder={'Họ tên'}
              onSubmitEditing={() => this.onFilter(true)}
              value={this.state.keyword}
              onChangeText={(value) => this.setState({ keyword: value })}
            />
            {
              this.state.keyword
                ? <Icon name='ios-close-circle' onPress={() => this.clearFilter()} />
                : null
            }
          </Item>

          {

          }

          <FlatList
            data={this.state.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderMainAssigner}
            ListEmptyComponent={emptyDataPage()}
            ListFooterComponent={() => (<MoreButton
              isLoading={this.state.isLoadmore}
              isTrigger={this.state.data.length >= 5}
              loadmoreFunc={this.loadingMore}
            />)}
          />
        </Content>
      );
    }

    return (
      <Container>
        <Header style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              CHỌN NGƯỜI ĐƯỢC NHẮC NHỞ
						</Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <HeaderRightButton
              onPress={() => this.onPickGiamdoc()}
              iconName='md-checkmark' iconType='ionicon'
              btnStyle={checkButtonStyle} btnDisabled={unsubmitableCondition}
            />
          </Right>
        </Header>
        {
          bodyContent
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
    extendsNavParams: state.navState.extendsNavParams
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PickWhoseReminder);