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
      yearChosen: 2019,
      currentDate: new Date(),

      loading: false,
      executing: false,
      currentDate: (new Date()).toISOString().split("T").shift(),
      tempDate: '',
      markedDates: {}
    }

    this.openPicker = this.openPicker.bind(this);
    this.navigateToEventList = this.navigateToEventList.bind(this);
    this.backToDefaultDate = this.backToDefaultDate.bind(this);
  }

  backToDefaultDate() {
    this.baseCalendar.current = this.state.currentDate
  }

  openPicker() {
    //Picker cua RN dang bi sida
    this.setState({ executing: !this.setState.executing })
  }

  navigateToEventList(day) {
    const targetScreenParam = {
      selectedDate: day.dateString
    }
    appStoreDataAndNavigate(this.props.navigation, "BaseCalendarScreen", new Object(), "EventListScreen", targetScreenParam);
  }


  componentDidMount = async () => {
    this.fetchData(new Date());
  }

  fetchData = async (date) => {
    this.setState({
      executing: true
    });

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
      markedDates
    }, () => {
      console.tron.log(url)
    });
  }


  render() {
    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: Colors.LITE_BLUE }}>
          <Left style={NativeBaseStyle.left}>
          </Left>
          <Body style={NativeBaseStyle.body}>
            <TouchableOpacity onPress={this.openPicker}>
              <Title style={NativeBaseStyle.bodyTitle}>
                {this.state.yearChosen + " "} <Icon name="ios-arrow-down" style={{ fontSize: 17, color: Colors.WHITE }} />
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
                // monthFormat={'MM'}
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
          <PopupDialog
            show={false}
            dialogTitle={
              <DialogTitle title={"Chọn năm"}
                titleStyle={{
                  ...Platform.select({
                    android: {
                      height: verticalScale(50),
                      justifyContent: 'center',
                    }
                  })
                }}
              />
            }
            ref={(popupDialog) => { this.popupDialog = popupDialog }}
            width={0.8}
            dialogStyle={{ height: 'auto' }}
            // height={'auto'}
            actions={[
              <DialogButton
                align={'center'}
                buttonStyle={{
                  backgroundColor: Colors.GRAY,
                  alignSelf: 'stretch',
                  alignItems: 'center',
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  ...Platform.select({
                    ios: {
                      justifyContent: 'flex-end',
                    },
                    android: {
                      height: verticalScale(50),
                      justifyContent: 'center',
                    },
                  })
                }}
                text="OK"
                textStyle={{
                  fontSize: moderateScale(14, 1.5),
                  color: '#fff',
                  textAlign: 'center'
                }}
                onPress={() => {
                  this.setState({
                    executing: false,
                    currentDate: this.state.currentDate.replace(this.state.currentDate.split("-").shift(), this.state.tempDate)
                  });

                  this.popupDialog.dismiss();
                }}
                key="button-0"
              />,
            ]}>
            <View style={[LoginStyle.formInputs, { marginVertical: 10 }]}>
              <View style={LoginStyle.formInput}>
                <TextInput
                  style={LoginStyle.formInputText}
                  keyboardType="numeric"
                  placeholder={this.state.yearChosen + ""}
                  value={this.state.currentDate.split("-").shift()}
                  onChangeText={(text) => this.setState({ tempDate: text })}
                />

              </View>

            </View>
          </PopupDialog>
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
})


// const theme = {
//   'stylesheet.calendar.header': {
//     calendar: {
//       paddingTop: 100,
//       borderBottomWidth: 3,
//       borderColor: 'red',
//       flex: 1
//     }
//   }
// }

// const styles = StyleSheet.create({
//   calendar: {
//     paddingTop: 5,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//     flex: 1
//   },
//   calendar: {
//     paddingTop: 100,
//     borderBottomWidth: 3,
//     borderColor: 'red',
//     flex: 1
//   }
//   //...(theme["stylesheet.calendar.header"])
//   // text: {
//   //   textAlign: 'center',
//   //   borderColor: '#bbb',
//   //   padding: 10,
//   //   backgroundColor: '#eee'
//   // },
//   // container: {
//   //   flex: 1,
//   //   backgroundColor: 'gray'
//   // }
// });


const mapStatetoProps = (state) => {
  return {
    userInfo: state.userState.userInfo
  }
}

export default connect(mapStatetoProps)(BaseCalendar);