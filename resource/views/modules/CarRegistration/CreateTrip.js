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

class CreateTrip extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: props.userInfo.ID,
      registrationId: this.props.extendsNavParams.registrationId,

      executing: false,
      loadingData: false,

      drivers: [],
      cars: [],
      message: EMPTY_STRING,

      chosenDrivers: [],
      chosenCars: [],

      currentTabIndex: 0,
      driverFilterValue: EMPTY_STRING,
      carFilterValue: EMPTY_STRING,

      driverPageIndex: DEFAULT_PAGE_INDEX,
      carPageIndex: DEFAULT_PAGE_INDEX,

      //hiệu ứng
      searchingInDriver: false,
      searchingInCar: false,
      loadingMoreInDriver: false,
      loadingMoreInCar: false,
    }
  }

  componentDidMount = () => {
    this.fetchData();
  }

  async fetchData() {
    this.setState({
      loadingData: true
    });

    const url = `${API_URL}/api/CarTrip/CreateTrip/${this.state.registrationId}`;
    const result = await fetch(url);
    const resultJson = await result.json();

    this.setState({
      loadingData: false,
      drivers: resultJson.groupOfDrivers || [],
      cars: resultJson.groupOfCars || []
    })
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  saveTiepnhan = async () => {
    //validate
    const {
      drivers, cars, chosenDrivers, chosenCars,
      registrationId, message, userId
    } = this.state;
    if (drivers.length > 0 && cars.length > 0) {
      if (chosenCars.length === 0) {
        Toast.show({
          text: 'Vui lòng chọn xe',
          type: 'danger',
          buttonText: "OK",
          buttonStyle: { backgroundColor: Colors.WHITE },
          buttonTextStyle: { color: Colors.LITE_BLUE },
        });
      }
      else if (chosenDrivers.length === 0) {
        Toast.show({
          text: 'Vui lòng chọn lái xe',
          type: 'danger',
          buttonText: "OK",
          buttonStyle: { backgroundColor: Colors.WHITE },
          buttonTextStyle: { color: Colors.LITE_BLUE },
        });
      }
      else if (chosenCars.length !== chosenDrivers.length) {
        Toast.show({
          text: 'Số lái xe phải tương đồng với số xe',
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

        const url = `${API_URL}/api/CarRegistration/AcceptCarRegistration`;
        const headers = new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8'
        });
        const body = JSON.stringify({
          registrationId,
          carIds: chosenCars.join(","),
          driverIds: chosenDrivers.join(","),
          note: message,
          currentUserId: userId
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
          text: resultJson.Status ? 'Tiếp nhận thành công' : 'Tiếp nhận thất bại',
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

  filterCars = async () => {
    const url = `${API_URL}/api/CarTrip/SearchGroupOfCars/${this.state.registrationId}/${this.state.carPageIndex}/5?query=${this.state.carFilterValue}`;
    const result = await fetch(url);
    const resultJson = await result.json();
    this.setState({
      searchingInCar: false,
      loadingMoreInCar: false,
      cars: this.state.searchingInCar ? (resultJson || []) : [...this.state.cars, ...(resultJson || [])]
    })
  }
  filterDrivers = async () => {
    const url = `${API_URL}/api/CarTrip/SearchGroupOfDrivers/${this.state.registrationId}/${this.state.driverPageIndex}/5?query=${this.state.driverFilterValue}`;
    const result = await fetch(url);
    const resultJson = await result.json();
    this.setState({
      searchingInDriver: false,
      loadingMoreInDriver: false,
      drivers: this.state.searchingInDriver ? (resultJson || []) : [...this.state.drivers, ...(resultJson || [])]
    })
  }

  onFilter = (isDriver) => {
    if (isDriver) {
      this.setState({
        chosenDrivers: [],
        searchingInDriver: true,
        driverPageIndex: DEFAULT_PAGE_INDEX
      }, () => this.filterDrivers());
    } else {
      this.setState({
        chosenCars: [],
        searchingInCar: true,
        carPageIndex: DEFAULT_PAGE_INDEX
      }, () => this.filterCars())
    }
  }
  onClearFilter = (isDriver) => {
    if (isDriver) {
      this.setState({
        loadingData: true,
        pageIndex: DEFAULT_PAGE_INDEX,
        driverFilterValue: EMPTY_STRING
      }, () => {
        this.fetchData()
      });
    }
    else {
      this.setState({
        loadingData: true,
        pageIndex: DEFAULT_PAGE_INDEX,
        carFilterValue: EMPTY_STRING
      }, () => {
        this.fetchData()
      });
    }
  }

  loadingMore = (isDriver) => {
    if (isDriver) {
      this.setState({
        loadingMoreInDriver: true,
        driverPageIndex: this.state.driverPageIndex + 1
      }, () => this.filterDrivers());
    } else {
      this.setState({
        loadingMoreInCar: true,
        carPageIndex: this.state.carPageIndex + 1
      }, () => this.filterCars())
    }
  }

  onSelectDrivers = (driverId) => {
    const tmpChosen = this.state.chosenDrivers,
      index = tmpChosen.indexOf(driverId);
    if (index > -1) {
      tmpChosen.splice(index, 1)
    }
    else {
      tmpChosen.push(driverId)
    }
    this.setState({ chosenDrivers: tmpChosen });
  }
  onSelectCars = (carId) => {
    const tmpChosen = this.state.chosenCars,
      index = tmpChosen.indexOf(carId);
    if (index > -1) {
      tmpChosen.splice(index, 1);
    }
    else {
      tmpChosen.push(carId)
    }
    this.setState({ chosenCars: tmpChosen });
  }

  renderDrivers = ({ item }) => {
    return (
      <ListItem
        key={item.Value.toString()}
        onPress={() => this.onSelectDrivers(item.Value)}
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
            onPress={() => this.onSelectDrivers(item.Value)}
            checked={(this.state.chosenDrivers.indexOf(item.Value) > -1)}
            style={{ alignSelf: "center" }}
          />
        </Right>
      </ListItem>
    );
  }

  renderCars = ({ item }) => {
    // console.tron.log(this.state.chosenCars)
    return (
      <ListItem
        key={item.Value.toString()}
        onPress={() => this.onSelectCars(item.Value)}
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
            onPress={() => this.onSelectCars(item.Value)}
            checked={(this.state.chosenCars.indexOf(item.Value) > -1)}
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
        <Tabs
          // renderTabBar={() => <ScrollableTab />}
          initialPage={this.state.currentTabIndex}
          onChangeTab={({ currentTabIndex }) => this.setState({ currentTabIndex })}
          tabBarUnderlineStyle={TabStyle.underLineStyle}>
          <Tab heading={
            <TabHeading style={(this.state.currentTabIndex == 0) ? TabStyle.activeTab : TabStyle.inActiveTab}>
              <Icon name='ios-person' style={TabStyle.activeText} />
              <Text style={(this.state.currentTabIndex == 0) ? TabStyle.activeText : TabStyle.inActiveText}>LÁI XE</Text>
            </TabHeading>
          }>
            <Item>
              <Icon name='ios-search' style={{ marginLeft: 5 }} />
              <Input placeholder='Tên lái xe'
                value={this.state.driverFilterValue}
                onSubmitEditing={() => this.onFilter(true)}
                onChangeText={(driverFilterValue) => this.setState({ driverFilterValue })} />
              {
                (this.state.driverFilterValue !== EMPTY_STRING)
                && <Icon name='ios-close-circle' onPress={() => this.onClearFilter(true)} />
              }
            </Item>

            <Content contentContainerStyle={{ flex: 1 }}>
              {
                renderIf(this.state.searchingInDriver)(
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
                  </View>
                )
              }

              {
                renderIf(!this.state.searchingInDriver)(
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.drivers}
                    renderItem={this.renderDrivers}
                    ListEmptyComponent={
                      this.state.loadingData ? null : emptyDataPage()
                    }
                    ListFooterComponent={
                      this.state.loadingMoreInDriver ?
                        <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
                        (
                          this.state.drivers.length >= 5 ?
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
          </Tab>

          <Tab heading={
            <TabHeading style={(this.state.currentTabIndex == 1) ? TabStyle.activeTab : TabStyle.inActiveTab}>
              <Icon name='ios-car' style={TabStyle.activeText} />
              <Text style={(this.state.currentTabIndex == 1) ? TabStyle.activeText : TabStyle.inActiveText}>XE</Text>
            </TabHeading>
          }>
            <Item>
              <Icon name='ios-search' style={{ marginLeft: 5 }} />
              <Input placeholder='Tên xe'
                value={this.state.carFilterValue}
                onSubmitEditing={() => this.onFilter(false)}
                onChangeText={(carFilterValue) => this.setState({ carFilterValue })} />
              {
                (this.state.carFilterValue !== EMPTY_STRING) && <Icon name='ios-close-circle' onPress={() => this.onClearFilter(false)} />
              }
            </Item>

            <Content contentContainerStyle={{ flex: 1 }}>
              {
                renderIf(this.state.searchingInCar)(
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
                  </View>
                )
              }
              {
                renderIf(!this.state.searchingInCar)(
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.cars}
                    renderItem={this.renderCars}
                    ListEmptyComponent={
                      this.state.loadingData ? null : emptyDataPage()
                    }
                    ListFooterComponent={
                      this.state.loadingMoreInCar ?
                        <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} /> :
                        (
                          this.state.cars.length >= 5 ?
                            <Button full style={{ backgroundColor: Colors.BLUE_PANTONE_640C }} onPress={() => this.loadingMore(false)}>
                              <Text>TẢI THÊM</Text>
                            </Button>
                            : null
                        )
                    }
                  />
                )
              }
            </Content>
          </Tab>

          <Tab heading={
            <TabHeading style={(this.state.currentTabIndex == 2) ? TabStyle.activeTab : TabStyle.inActiveTab}>
              <Icon name='ios-chatboxes' style={TabStyle.activeText} />
              <Text style={(this.state.currentTabIndex == 2) ? TabStyle.activeText : TabStyle.inActiveText}>GHI CHÚ</Text>
            </TabHeading>
          }>
            <Content contentContainerStyle={{padding: 5}}>
              <Form>
                <Textarea rowSpan={5} bordered placeholder='Nội dung ghi chú' onChangeText={(message) => this.setState({ message })} />
              </Form>
            </Content>
          </Tab>
        </Tabs>
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
              PHÊ DUYỆT YÊU CẦU ĐĂNG KÝ XE
            </Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <Button transparent onPress={() => this.saveTiepnhan()}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateTrip);
