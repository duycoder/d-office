/*
	@description: lịch sử đánh giá tiến độ công việc
	@author: duynn
	@since: 19/05/2018
*/
'use strict'
import React, { Component } from 'react';

import {
  FlatList, StyleSheet, View, Text,
  RefreshControl
} from 'react-native';
//redux
import { connect } from 'react-redux';

//lib
import {
  Container, Header, Left, Content,
  Body, Title, Right,
} from 'native-base';
import {
  ListItem
} from 'react-native-elements';

//utilities
import {
  EMPTY_STRING,
  DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, Colors
} from '../../../common/SystemConstant';
import { dataLoading } from '../../../common/Effect';
import { emptyDataPage, convertDateTimeToString } from '../../../common/Utilities';
import { scale, moderateScale } from '../../../assets/styles/ScaleIndicator';

//styles
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { MoreButton, GoBackButton, ColumnedListItem } from '../../common';
import { taskApi } from '../../../common/Api';

class HistoryEvaluateTask extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: this.props.userInfo.ID,
      taskId: this.props.coreNavParams.taskId,
      taskType: this.props.coreNavParams.taskType,

      filterValue: EMPTY_STRING,
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
      data: [],
      dataItem: {},
      loading: false,
      loadingMore: false,
      refreshing: false
    }
  }

  componentWillMount = () => {
    this.setState({
      loading: true
    }, () => this.fetchData())
  }


  loadMore = () => {
    this.setState({
      loadingMore: true,
      pageIndex: this.state.pageIndex + 1
    }, () => {
      this.fetchData();
    });
  }

  fetchData = async () => {
    const { taskId, pageIndex, pageSize, filterValue } = this.state;
    const resultJson = await taskApi().getListEvaluation([
      taskId,
      pageIndex,
      `${pageSize}?query=${filterValue}`,
    ]);

    this.setState({
      data: this.state.loadingMore ? [...this.state.data, ...resultJson] : resultJson,
      loading: false,
      loadingMore: false,
      refreshing: false,
    });
  }

  onShowEvaluateInfo = (item) => {
    this.setState({
      dataItem: item
    }, () => {
      this.popupDialog.show();
    })
  }

  renderItem = ({ item }) => {
    let statusText = '', statusStyle = {};
    if (item.PHEDUYETKETQUA) {
      statusText = 'Đã phê duyệt';
      statusStyle = styles.approveText;
    } else {
      statusText = 'Đã trả lại';
      statusStyle = styles.denyText;
    }

    return (
      <ListItem
        containerStyle={{ borderBottomColor: Colors.GRAY, borderBottomWidth: .7 }}
        leftIcon={
          <View>
            <Text style={{ fontWeight: "bold", fontSize: moderateScale(12, 1.05) }}>{item.TIENDOCONGVIEC + '%'}</Text>
          </View>
        }
        subtitle={
          <View style={{ marginLeft: scale(8) }}>
            <ColumnedListItem
              isRender={!!item.CREATED_AT}
              leftText='Ngày trình duyệt kết quả công việc'
              rightText={item.CREATED_AT}
            />
            <ColumnedListItem
              leftText='Ngày cấp trên phản hồi'
              rightText={convertDateTimeToString(item.NGAYPHANHOI)}
            />
            <ColumnedListItem
              isRender={!!item.NGAYPHANHOI}
              leftText='Nội dung phản hồi'
              rightText={item.NGAYPHANHOI}
            />
            <ColumnedListItem
              leftText='Trạng thái'
              rightText={statusText}
              customRightText={statusStyle}
            />
          </View>
        }
        hideChevron
      />
    );
  }

  navigateBackToDetail = () => {
    this.props.navigation.goBack();
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true,
      pageIndex: DEFAULT_PAGE_INDEX,
    }, () => {
      this.fetchData()
    })
  }

  render() {
    let bodyContent = dataLoading(true);
    if (!this.state.loading) {
      bodyContent = (
        <FlatList
          data={this.state.data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
          ListEmptyComponent={() => emptyDataPage()}
          ListFooterComponent={() => (<MoreButton
            isLoading={this.state.loadingMore}
            isTrigger={this.state.data.length >= DEFAULT_PAGE_SIZE}
            loadmoreFunc={this.loadMore}
          />)}

          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              title='Kéo để làm mới'
              colors={[Colors.BLUE_PANTONE_640C]}
              tintColor={[Colors.BLUE_PANTONE_640C]}
              titleColor='red'
            />
          }
        />
      );
    }

    return (
      <Container>
        <Header style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBackToDetail()} />
          </Left>
          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle}>
              LỊCH SỬ PHẢN HỒI
						</Title>
          </Body>
          <Right style={NativeBaseStyle.right} />
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>
          {
            bodyContent
          }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  approveText: {
    color: '#337321',
    fontWeight: 'bold'
  }, denyText: {
    color: '#FF0033',
    fontWeight: 'bold'
  }
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.userState.userInfo,
    coreNavParams: state.navState.coreNavParams
  }
}

export default connect(mapStateToProps)(HistoryEvaluateTask);