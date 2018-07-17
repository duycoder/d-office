/**
 * @description: danh sách văn bản trình ký chưa xử lý
 * @author: duynn
 * @since: 02/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { ActivityIndicator, View, FlatList, RefreshControl, TouchableOpacity, Text as RnText } from 'react-native';

//redux
import { connect } from 'react-redux';
import * as signDocAction from '../../../redux/modules/signdoc/SignDocAction';
//lib
import {
  Container, Header, Item, Icon, Input, Body, Text,
  Content, Badge, Left, Right, Button
} from 'native-base'
import renderIf from 'render-if';
import { List, ListItem } from 'react-native-elements';

//utilities
import { formatLongText, openSideBar, emptyDataPage } from '../../../common/Utilities';
import {
  API_URL, HEADER_COLOR, LOADER_COLOR, DOKHAN_CONSTANT,
  VANBAN_CONSTANT, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE,
  Colors
} from '../../../common/SystemConstant';
import { indicatorResponsive } from '../../../assets/styles/ScaleIndicator';


//styles
import { ListSignDocStyle } from '../../../assets/styles/SignDocStyle';

class BaseSignDocList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: this.props.filterValue,
      userId: this.props.userInfo.ID,
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
      docType: props.docType,
      loadingData: false,
      loadingMoreData: false,
      refreshingData: false,
      data: []
    }
  }

  componentWillMount() {
    this.setState({
      loadingData: true
    }, () => {
      this.fetchData();
    })
  }

  async fetchData() {
    let apiUrlParam = 'GetListProcessing';

    const { docType } = this.state;

    if (docType == VANBAN_CONSTANT.DA_XULY) {
      apiUrlParam = 'GetListProcessed';
    } else if (docType == VANBAN_CONSTANT.CAN_REVIEW) {
      apiUrlParam = 'GetListReview';
    } else if (docType == VANBAN_CONSTANT.DA_REVIEW) {
      apiUrlParam = 'GetListReviewed';
    }

    const url = `${API_URL}/api/VanBanDi/${apiUrlParam}/${this.state.userId}/${this.state.pageSize}/${this.state.pageIndex}?query=${this.state.filterValue}`;
    const result = await fetch(url);
    const resultJson = await result.json();

    this.setState({
      data: this.state.loadingMoreData ? [...this.state.data, ...resultJson.ListItem] : resultJson.ListItem,
      refreshingData: false,
      loadingData: false,
      loadingMore: false,
    });
  }

  navigateToDocDetail(docId) {
    this.props.navigator.navigate('DetailSignDocScreen', {
      docId,
      docType: this.state.docType
    })
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
      loadingMore: true,
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

  renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity onPress={() => this.navigateToDocDetail(item.ID)}>
          <ListItem
            hideChevron={true}
            badge={{
              value: (item.DOKHAN_ID == DOKHAN_CONSTANT.THUONG_KHAN) ? 'T.KHẨN' : ((item.DOKHAN_ID == DOKHAN_CONSTANT.KHAN) ? 'KHẨN' : 'THƯỜNG'),
              textStyle: {
                color: Colors.WHITE,
                fontWeight: 'bold'
              },
              containerStyle: {
                backgroundColor: (item.DOKHAN_ID == DOKHAN_CONSTANT.THUONG_KHAN) ? Colors.RED_PANTONE_186C : ((item.DOKHAN_ID == DOKHAN_CONSTANT.KHAN) ? Colors.RED_PANTONE_021C : Colors.GREEN_PANTONE_364C),
                borderRadius: 3
              }
            }}
            leftIcon={
              <View style={ListSignDocStyle.leftSide}>
                {
                  renderIf(item.HAS_FILE)(
                    <Icon name='ios-attach' />
                  )
                }
              </View>
            }

            title={
              <RnText style={item.IS_READ === true ? ListSignDocStyle.textRead : ListSignDocStyle.textNormal}>
                <RnText style={{ fontWeight: 'bold' }}>
                  Mã hiệu:
                </RnText>

                <RnText>
                  {' ' + item.SOHIEU}
                </RnText>
              </RnText>
            }

            subtitle={
              <RnText style={[item.IS_READ === true ? ListSignDocStyle.textRead : ListSignDocStyle.textNormal, ListSignDocStyle.abridgment]}>
                <RnText style={{ fontWeight: 'bold' }}>
                  Trích yếu:
                </RnText>
                <RnText>
                  {' ' + formatLongText(item.TRICHYEU, 50)}
                </RnText>
              </RnText>
            }
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <Container>
        <Header searchBar rounded style={{ backgroundColor: Colors.RED_PANTONE_186C }}>
          <Item style={{ backgroundColor: Colors.WHITE }}>
            <Icon name='ios-search' />
            <Input placeholder='Mã hiệu, trích yếu'
              value={this.state.filterValue}
              onChangeText={(filterValue) => this.setState({ filterValue })}
              onSubmitEditing={() => this.onFilter()} />
            <Icon name='ios-document' />
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
                ListFooterComponent={() => this.state.loadingMore ?
                  <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
                  (
                    this.state.data.length >= DEFAULT_PAGE_SIZE ?
                      <Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadingMore()}>
                        <Text>
                          TẢI THÊM
                          </Text>
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
}

const mapStatetoProps = (state) => {
  return {
    userInfo: state.userState.userInfo,
    filterValue: state.signDocState.filterValue
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editFilterValue: (filterValue) => dispatch(signDocAction.editFilterValue(filterValue))
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(BaseSignDocList);