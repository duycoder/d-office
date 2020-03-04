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
  Left, Title, Right, ListItem as NbListItem, CheckBox
} from 'native-base';

//utilities
import {
  DEFAULT_PAGE_INDEX,
  Colors
} from '../../../common/SystemConstant';
import { emptyDataPage } from '../../../common/Utilities';
import { dataLoading } from '../../../common/Effect';
import { verticalScale } from '../../../assets/styles/ScaleIndicator';

//views
import { meetingRoomApi } from '../../../common/Api';
import { MoreButton } from '../../common';

class BasePickInvite extends Component {
  static defaultProps = {
    unitId_Text: 'unitId',
    unitName_Text: 'unitName',
    extendsNavParams: {},
    fetchTrigger: 1,
  }

  constructor(props) {
    super(props);

    const { unitId_Text, unitName_Text, extendsNavParams } = this.props;
    this.unitId = unitId_Text;
    this.unitName = unitName_Text;

    this.state = {
      loading: false,

      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: 20,
      isLoadmore: false,
      isSearch: false,

      data: [],
      [unitId_Text]: extendsNavParams[unitId_Text] || [],
      [unitName_Text]: extendsNavParams[unitName_Text] || [],
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
    const getParams = [
      pageSize,
      pageIndex,
      keyword ? keyword.trim().toLowerCase() : ""
    ];
    let resultJson = {};

    switch (this.props.fetchTrigger) {
      case 1:
        resultJson = await meetingRoomApi().getInviteListPerson(getParams);
        break;
      case 2:
        resultJson = await meetingRoomApi().getInviteListRole(getParams);
        break;
      case 3:
        resultJson = await meetingRoomApi().getInviteListDept(getParams);
        break;
      default:
        resultJson = await meetingRoomApi().getInviteListPerson(getParams);
        break;
    }

    this.setState({
      data: isLoadmore ? [...this.state.data, ...resultJson.Params] : resultJson.Params,
      loading: false,
      isLoadmore: isLoadmore && false
    });
  }

  onPickUnit = () => {
    return {
      [this.unitId]: this.state[this.unitId],
      [this.unitName]: this.state[this.unitName],
    };
  }

  selectUnit = (itemName, itemId) => {
    this._updateListUnit(this.unitId, itemId);
    this._updateListUnit(this.unitName, itemName);
  }

  _updateListUnit = (stateName, item) => {
    let list = this.state[stateName];
    const index = list.indexOf(item);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(item);
    }
    this.setState({
      [stateName]: list
    });
  }

  renderUnitList = ({ item }) => {
    return (
      <NbListItem
        key={item.Value}
        onPress={() => this.selectUnit(item.Text, item.Value)}
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
            checked={this.state[this.unitId].indexOf(item.Value) > -1}
            onPress={() => this.selectUnit(item.Text, item.Value)}
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
    let bodyContent = null;
    if (this.state.loading) {
      bodyContent = dataLoading(true);
    }
    else {
      bodyContent = (
        <Content contentContainerStyle={{ flex: 1 }}>
          <Item style={{ paddingLeft: 10 }}>
            <Icon name='ios-search' />
            <Input placeholder='Nhập ký tự'
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
            renderItem={this.renderUnitList}
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
        {bodyContent}
      </Container>
    );
  }
}

export default BasePickInvite;