/*
* @description: màn hình giao việc
* @author: duynn
* @since: 13/05/2018
*/
'use strict'
import React, { Component } from 'react';
import {
  FlatList
} from 'react-native'
//lib
import {
  Container, Content, Text, Icon, Item, Input,
  Header, Left, Body, Title, Right, ListItem as NbListItem, CheckBox
} from 'native-base';

//redux
import { connect } from 'react-redux';
import * as navAction from '../../../redux/modules/Nav/Action';
//utilities
import {
  DEFAULT_PAGE_INDEX,
  COMMON_COLOR} from '../../../common/SystemConstant';
import { emptyDataPage, showWarningToast } from '../../../common/Utilities';
import { dataLoading, executeLoading } from '../../../common/Effect';
import { verticalScale } from '../../../assets/styles/ScaleIndicator';

import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//views
import { meetingRoomApi } from '../../../common/Api';
import { MoreButton, HeaderRightButton, GoBackButton } from '../../common';

class PickNguoiChutri extends Component {
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
      chutriId: props.extendsNavParams.chutriId || 0,
      chutriName: props.extendsNavParams.chutriName || null,
      keyword: null,
    }
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = async (isLoadmore = false) => {
    this.setState({
      loading: true
    });

    const { pageIndex, pageSize, keyword } = this.state;

    const resultJson = await meetingRoomApi().getNguoichutri([
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

  onPickNguoichutri = () => {
    if (this.state.chutriId === 0) {
      showWarningToast('Vui lòng chọn người chủ trì');
    } else {
      const { chutriId, chutriName } = this.state;
      this.props.updateExtendsNavParams({ chutriId, chutriName });
      this.navigateBack();
    }
  }

  selectUser = (itemName, itemId) => {
    this.setState({
      chutriId: itemId,
      chutriName: itemName
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
            color={COMMON_COLOR.LITE_BLUE}
            checked={this.state.chutriId == item.Value}
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
    let unsubmitableCondition = this.state.chutriId === 0,
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
              CHỌN NGƯỜI CHỦ TRÌ
						</Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <HeaderRightButton
              onPress={() => this.onPickNguoichutri()}
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

export default connect(mapStateToProps, mapDispatchToProps)(PickNguoiChutri);