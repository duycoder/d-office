import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View
} from 'react-native';
// import { Calendar } from 'react-native-calendars';
import { appStoreDataAndNavigate } from '../../../common/Utilities';

export default class CalendarPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: ""
    }
  }
  onDayPress = (day) => {
    this.setState({
      selected: day.dateString
    }, () => alert(this.state.selected));
  }
  render() {
    return (
      <View style={styles.container}>
        <Calendar
          style={styles.calendar}
          onDayPress={this.onDayPress}
          markedDates={{ [this.state.selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' } }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray'
  },
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 350
  },
});