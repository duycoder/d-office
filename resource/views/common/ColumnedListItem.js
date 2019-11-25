import React, { Component } from 'react';
import {
  View, Text, StyleSheet
} from 'react-native';

class ColumnedListItem extends Component {
  constructor() {
    
  }

  render() {
    <View style={{ marginTop: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: "35%" }}>
          <Text style={{ color: Colors.DANK_GRAY, fontSize: moderateScale(11, 1.1) }}>
            Mục đích:
                </Text>
        </View>
        <View style={{ width: "65%" }}>
          <Text style={{ fontSize: moderateScale(12, 1.1) }}>
            {item.MUCDICH}
          </Text>
        </View>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({

});

export default ColumnedListItem;