import React, { Component } from 'react';
import {
  AsyncStorage, ActivityIndicator, View, StyleSheet, Picker, PickerIOS, TouchableOpacity, Modal, Platform, TextInput
} from 'react-native';

import {
  Container, Header, Item, Icon, Body, Text,
  Content, Badge, Left, Right, Button, Title, Form
} from 'native-base'

import { Calendar, LocaleConfig } from 'react-native-calendars';
import PopupDialog, { DialogTitle, DialogButton } from 'react-native-popup-dialog';

import { Colors, height, API_URL } from '../../../common/SystemConstant';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { appStoreDataAndNavigate, convertDateTimeToString, convertDateToString } from '../../../common/Utilities';
import { verticalScale, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { LoginStyle } from '../../../assets/styles/LoginStyle';
import { executeLoading, dataLoading } from '../../../common/Effect';
import { _readableFormat } from '../../../common/Utilities';
import * as util from 'lodash';
import { connect } from 'react-redux';

LocaleConfig.locales['vn'] = {
  monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
  monthNamesShort: ['Thg1.', 'Thg2.', 'Thg3.', 'Thg4.', 'Thg5.', 'Thg6.', 'Thg7.', 'Thg8.', 'Thg9.', 'Thg10.', 'Thg11.', 'Thg12.'],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', ''],
  dayNamesShort: ['CN.', 'Th2.', 'Th3.', 'Th4.', 'Th5.', 'Th6.', 'Th7.']
};

LocaleConfig.defaultLocale = 'vn';

class BaseCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingData: false,
      todayDate: (new Date()).toISOString().split("T").shift(), // save today date, used as an archon

      loading: false,
      executing: false,
      isOpened: false, // to open popup-dialog
      currentDate: (new Date()).toISOString().split("T").shift(), // currentDate the Calendar point to
      tempYear: '', // get the year chosen in popup-dialog
      markedDates: {}
    }

    this.togglePicker = this.togglePicker.bind(this);
    this.navigateToEventList = this.navigateToEventList.bind(this);
    this.backToDefaultDate = this.backToDefaultDate.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
  }

  backToDefaultDate() {
    this.setState({
      currentDate: this.state.todayDate
    }, () => this.fetchData(new Date()));
  }

  togglePicker() {
    this.setState({
      isOpened: !this.state.isOpened,
      tempYear: this.state.currentDate.split("-").shift()
    });
  }

  handleMonthChange(dateObj) {
    this.setState({
      currentDate: dateObj.dateString
    }, () => this.fetchData(this.state.currentDate));
  }

  handleYearChange() {
    const { currentDate, tempYear } = this.state;
    const currentMonth = currentDate.split("-")[1];

    this.setState({
      currentDate: `${tempYear}-${currentMonth}-01`,
      isOpened: false
    });
  }

  navigateToEventList(day) {
    // const targetScreenParam = {
    //   selectedDate: day.dateString
    // }
    // appStoreDataAndNavigate(this.props.navigation, "BaseCalendarScreen", new Object(), "EventListScreen", targetScreenParam);
    this.props.navigation.navigate("EventListScreen", {
      selectedDate: day.dateString
    })
  }


  componentDidMount = async () => {
    this.fetchData(new Date());
  }

  fetchData = async (date) => {
    this.setState({
      executing: true
    });
    date = new Date(date);
    const currentDate = new Date();
    const currentDateStr = `${_readableFormat(currentDate.getFullYear())}-${_readableFormat(currentDate.getMonth() + 1)}-${_readableFormat(currentDate.getDate())}`

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const url = `${API_URL}/api/LichCongTac/GetLichCongTacThang/${this.props.userInfo.ID}/${month}/${year}`;

    let markedDates = {};
    const resultDates = await fetch(url).then(response => response.json());

    if (!util.isEmpty(resultDates)) {
      for (let item of resultDates) {
        if (markedDates[item]) {
          continue;
        }
        if (util.isEqual(item, currentDateStr)) {
          markedDates[item] = { marked: true, dotColor: Colors.WHITE }
        } else {
          markedDates[item] = { marked: true, dotColor: Colors.BLUE }
        }
      }
    }

    this.setState({
      executing: false,
      tempYear: this.state.currentDate.split("-").shift(),
      markedDates
    }, () => {
      console.log(url)
    });
  }


  render() {
    const yearOptions = util.range(1950, 2050);
    const { currentDate } = this.state;

    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
          </Left>
          <Body style={NativeBaseStyle.body}>
            <TouchableOpacity onPress={this.togglePicker}>
              <Title style={NativeBaseStyle.bodyTitle}>
                {currentDate.split("-").shift()} <Icon name="ios-arrow-down" style={{ fontSize: 17, color: Colors.WHITE }} />
              </Title>
            </TouchableOpacity>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <TouchableOpacity onPress={this.backToDefaultDate}>
              <Icon name="md-calendar" style={{ fontSize: 22, color: Colors.WHITE }} />
            </TouchableOpacity>
          </Right>
        </Header>

        <Content contentContainerStyle={{ flex: 1 }}>
          {
            this.state.loading &&
            dataLoading(this.state.loading)
          }

          {
            !this.state.loading && (
              <Calendar
                ref={(ref) => this.baseCalendar = ref}
                current={this.state.currentDate}
                style={styles.calendar}
                container={styles.container}
                hideExtraDays
                onDayPress={this.navigateToEventList}
                firstDay={1}
                markedDates={this.state.markedDates}
                onMonthChange={this.handleMonthChange}
                theme={{
                  "stylesheet.day.basic": {
                    base: {
                      width: '100%',
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      justifyContent: 'center',
                      alignItems: 'center'
                    },
                    text: {
                      fontSize: 18,
                    },
                    today: {
                      backgroundColor: Colors.LITE_BLUE,
                    },
                    todayText: {
                      color: '#fff',
                    },
                  },
                  "stylesheet.calendar.main": {
                    container: {
                      paddingLeft: 5,
                      paddingRight: 5,
                      // backgroundColor: 'red'
                    },
                    monthView: {
                      flex: 1
                    },
                    week: {
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      flex: 1,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ecf0f1',
                    },
                  }
                }}
              />
            )
          }

          {
            executeLoading(this.state.executing)
          }
          {
            // <PopupDialog
            //   show={this.state.isOpened}
            //   dialogTitle={
            //     <DialogTitle title={"Chọn năm"}
            //       titleStyle={{
            //         ...Platform.select({
            //           android: {
            //             height: verticalScale(50),
            //             justifyContent: 'center',
            //           }
            //         })
            //       }}
            //     />
            //   }
            //   ref={(popupDialog) => { this.popupDialog = popupDialog }}
            //   width={0.8}
            //   dialogStyle={{ height: 'auto' }}
            //   // height={'auto'}
            //   actions={[
            //     <DialogButton
            //       align={'center'}
            //       buttonStyle={{
            //         backgroundColor: Colors.GRAY,
            //         alignSelf: 'stretch',
            //         alignItems: 'center',
            //         borderBottomLeftRadius: 8,
            //         borderBottomRightRadius: 8,
            //         ...Platform.select({
            //           ios: {
            //             justifyContent: 'flex-end',
            //           },
            //           android: {
            //             height: verticalScale(50),
            //             justifyContent: 'center',
            //           },
            //         })
            //       }}
            //       text="OK"
            //       textStyle={{
            //         fontSize: moderateScale(14, 1.5),
            //         color: '#fff',
            //         textAlign: 'center'
            //       }}
            //       onPress={() => {
            //         const { currentDate } = this.state;
            //         const currentMonth = currentDate.split("-")[1];
            //         this.setState({
            //           isOpened: false,
            //           currentDate: `${this.state.tempYear}-${currentMonth}-01`
            //         });

            //         this.popupDialog.dismiss();
            //       }}
            //       key="button-0"
            //     />,
            //   ]}>

            //     <View style={[LoginStyle.formInputs, { marginVertical: 10 }]}>
            //       <View style={LoginStyle.formInput}>
            //         <TextInput
            //           style={LoginStyle.formInputText}
            //           keyboardType="numeric"
            //           placeholder={this.state.yearChosen + ""}
            //           value={this.state.currentDate.split("-").shift()}
            //           onChangeText={(text) => this.setState({ tempYear: text })}
            //         />
            //       </View>
            //     </View>

            //     </PopupDialog>
          }
          <Modal animationType={"slide"} visible={this.state.isOpened} transparent>
            <View style={{ backgroundColor: '#fafafa', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                <TouchableOpacity onPress={this.togglePicker}>
                  <Text style={{ fontWeight: 'bold' }}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleYearChange}>
                  <Text style={{ color: Colors.GREEN_PANTONE_364C, fontWeight: 'bold' }}>Chọn</Text>
                </TouchableOpacity>
              </View>
              <View style={{ borderBottomColor: Colors.GRAY, borderBottomWidth: 1 }}></View>
              <Picker
                selectedValue={this.state.tempYear}
                onValueChange={(itemValue, itemIndex) => this.setState({ tempYear: itemValue })}
              >
                {
                  yearOptions.map(x => <Picker.Item label={`${x}`} value={`${x}`} key={`${x}`} />)
                }
              </Picker>
            </View>
          </Modal>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  calendar: {
    flex: 1
  }
});


const mapStatetoProps = (state) => {
  return {
    userInfo: state.userState.userInfo
  }
}

export default connect(mapStatetoProps)(BaseCalendar);