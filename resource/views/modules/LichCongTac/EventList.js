import React, { Component } from 'react';
import { View, Text as RnText, TouchableOpacity as RnButton, FlatList } from 'react-native';

import {
  Container, Header, Left, Button,
  Body, Icon, Title, Content, Form,
  Tabs, Tab, TabHeading, ScrollableTab,
  Text, Right
} from 'native-base';

import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';

import {
  Icon as RneIcon
} from 'react-native-elements';
import { TabStyle } from '../../../assets/styles/TabStyle';
import { Colors, API_URL } from '../../../common/SystemConstant';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import {
  appGetDataAndNavigate, convertDateToString, appStoreDataAndNavigate,
  formatLongText, _readableFormat,emptyDataPage
} from '../../../common/Utilities';
import { dataLoading } from '../../../common/Effect';

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabIndex: 0,
      selectedDate: this.props.navigation.state.params.selectedDate,
      loading: false,
      daySchedule: [],
      nightSchedule: [],
    }

    this.navigateBacktoBase = this.navigateBacktoBase.bind(this);
  }

  navigateBacktoBase() {
    appGetDataAndNavigate(this.props.navigation, 'EventListScreen');
    return true;
  }

  fetchData = async () => {
    this.setState({
      loading: true
    })
    const date = convertDateToString(this.state.selectedDate);
    const day = date.split('/')[0];
    const month = date.split('/')[1];
    const year = date.split('/')[2];

    const url = `${API_URL}/api/LichCongTac/GetLichCongTacNgay/${this.props.userInfo.ID}/${month}/${year}/${day}`;

    console.tron.log(url)

    const result = await fetch(url)
      .then((response) => response.json());
    this.setState({
      loading: false,
      daySchedule: result.filter(item => item.GIO_CONGTAC <= 12),
      nightSchedule: result.filter(item => item.GIO_CONGTAC > 12)
    })
  }

  componentDidMount = () => {
    this.fetchData();
  }

  render() {
    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
            <Button transparent onPress={() => this.navigateBacktoBase()}>
              <RneIcon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
            </Button>
          </Left>

          <Body style={NativeBaseStyle.body}>
            <Title style={NativeBaseStyle.bodyTitle} >
              {convertDateToString(this.state.selectedDate)}
            </Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
          </Right>
        </Header>
        <View style={{ flex: 1 }}>
          {
            this.state.loading ? dataLoading(this.state.loading) :
              <Tabs
                initialPage={this.state.currentTabIndex}
                tabBarUnderlineStyle={TabStyle.underLineStyle}
                onChangeTab={({ index }) => this.setState({ currentTabIndex: index })}>
                <Tab heading={
                  <TabHeading style={(this.state.currentTabIndex == 0 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                    <Icon name='ios-sunny' style={TabStyle.activeText} />
                    <Text style={(this.state.currentTabIndex == 0 ? TabStyle.activeText : TabStyle.inActiveText)}>
                      SÁNG
                    </Text>
                  </TabHeading>
                }>
                  <Schedules timeline={"Sáng"} nav={this.props.navigation} data={this.state.daySchedule} />
                </Tab>

                <Tab heading={
                  <TabHeading style={(this.state.currentTabIndex == 1 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                    <Icon name='ios-moon' style={TabStyle.activeText} />
                    <Text style={(this.state.currentTabIndex == 1 ? TabStyle.activeText : TabStyle.inActiveText)}>
                      CHIỀU
                </Text>
                  </TabHeading>
                }>
                  <Schedules timeline={"Chiều"} data={this.state.nightSchedule} />
                </Tab>
              </Tabs>
          }
        </View>
      </Container>

    );
  }
}

class Schedules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeline: props.timeline,
      nav: props.nav,
      data: props.data
    }
    this.renderItem = this.renderItem.bind(this);
    this.navigateToDetail = this.navigateToDetail.bind(this);
  }

  // fetchData() {
  //   //wait for api
  // }

  renderItem({ item, index }) {
    return (
      <View>
        <RnButton onPress={() => this.navigateToDetail(item.ID)}>
          <ListItem
            hideChevron={true}
            title={item.TIEUDE}
            titleStyle={{
              color: Colors.BLACK,
              fontWeight: 'bold',
              fontSize: moderateScale(13, 1.2)
            }}
            subtitle={
              convertDateToString(item.NGAY_CONGTAC) + " lúc " + _readableFormat(item.GIO_CONGTAC) + ":" + _readableFormat(item.PHUT_CONGTAC)
            }
            subtitleStyle={{
              color: Colors.GRAY,
              fontSize: moderateScale(13, 1.2)
            }}
          />
        </RnButton>
      </View>
    );
  }

  navigateToDetail(id) {
    const targetScreenParam = {
      id: id
    }
    appStoreDataAndNavigate(this.state.nav, "EventListScreen", new Object(), "DetailEventScreen", targetScreenParam);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={this.state.refreshingData}
        //     onRefresh={this.handleRefresh}
        //     colors={[Colors.BLUE_PANTONE_640C]}
        //     tintColor={[Colors.BLUE_PANTONE_640C]}
        //     title='Kéo để làm mới'
        //     titleColor={Colors.RED}
        //   />
        // }
        ListEmptyComponent={() =>
          emptyDataPage()
        }
        // ListFooterComponent={() => this.state.loadingMoreData ?
        //   <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
        //   (
        //     this.state.data && this.state.data.length >= DEFAULT_PAGE_SIZE ?
        //       <Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadingMore()}>
        //         <Text>
        //           TẢI THÊM
        //                   </Text>
        //       </Button>
        //       : null
        //   )
        // }
        />
      </View>

    );
  }
}

const mapStatetoProps = (state) => {
  return {
    userInfo: state.userState.userInfo
  }
}

export default connect(mapStatetoProps)(EventList);