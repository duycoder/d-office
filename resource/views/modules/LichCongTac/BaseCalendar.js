import React, { Component } from 'react';
import {
  AsyncStorage, ActivityIndicator, View, StyleSheet, Picker, PickerIOS, TouchableOpacity, Modal, Platform, TextInput
} from 'react-native';

import {
  Container, Header, Item, Icon, Body, Text,
  Content, Badge, Left, Right, Button, Title, Form
} from 'native-base'

import { Calendar } from 'react-native-calendars';
import PopupDialog, { DialogTitle, DialogButton } from 'react-native-popup-dialog';

import { Colors, height } from '../../../common/SystemConstant';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';
import { appStoreDataAndNavigate, convertDateToString } from '../../../common/Utilities';
import { verticalScale, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { LoginStyle } from '../../../assets/styles/LoginStyle';

export default class BaseCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingData: false,
      yearChosen: 2019,
      executing: false,
      currentDate: (new Date()).toISOString().split("T").shift(),
      tempDate: ''
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
            // this.state.loadingData &&
            //   <View style={{ flex: 1, justifyContent: 'center' }}>
            //     <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
            //   </View>
          }

          {
            !this.state.loadingData && (
              <Calendar
                // onDayPress={this.onDayPress}
                ref={(ref) => this.baseCalendar = ref}
                current={this.state.currentDate}
                
                style={styles.calendar}
                hideExtraDays
                onDayPress={this.navigateToEventList}
                firstDay={1}
                // monthFormat={'MM'}
                // markedDates={{ [this.state.selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' } }}
                theme={{
                  'stylesheet.calendar.main': {
                    week: {
                      marginTop: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      height: 70
                    }
                  },
                  'stylesheet.calendar.header': {
                    dayHeader: {
                      width: 70,
                      textAlign: 'center',
                      marginTop: 15
                    }
                  },
                  'stylesheet.day.basic': {
                    base: {
                      justifyContent: 'center',
                      height: 70
                    },
                    text: {
                      fontSize: 17
                    }
                  }
                }}
              />
            )
          }

          <PopupDialog
            show={this.state.executing}
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
            dialogStyle={{height:'auto'}}
            height={'auto'}
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
            <View style={[LoginStyle.formInputs, {marginVertical: 10}]}> 
            <View style={LoginStyle.formInput}>
            <TextInput 
              style={LoginStyle.formInputText} 
              keyboardType="numeric" 
              placeholder={this.state.yearChosen + ""}
              value={this.state.currentDate.split("-").shift()}
              onChangeText={(text)=>this.setState({tempDate: text})}
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
  calendar: {
    // borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 350
  },
  text: {
    textAlign: 'center',
    borderColor: '#bbb',
    padding: 10,
    backgroundColor: '#eee'
  },
  container: {
    flex: 1,
    backgroundColor: 'gray'
  }
});
