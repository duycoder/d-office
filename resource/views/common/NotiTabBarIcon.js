import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import { Colors } from '../../common/SystemConstant';
import { _readableFormat } from '../../common/Utilities';
import { moderateScale } from '../../assets/styles/ScaleIndicator';

class NotiTabBarIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationCount: this.props.userInfo.numberUnReadMessage || 0
    }
  }
  render() {
    const { notificationCount } = this.state;
    let notificationCountText = notificationCount > 99
      ? '99+'
      : _readableFormat(notificationCount);

    return notificationCount > 0
      ? <View style={styles.countContainer}>
        <Text style={styles.countText}>{notificationCountText}</Text>
      </View>
      : null
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userState.userInfo
  }
}

export default connect(mapStateToProps, null)(NotiTabBarIcon);

const styles = StyleSheet.create({
  countContainer: {
    position: 'absolute',
    top: 1,
    right: 1,
    margin: -1,
    minWidth: 18,
    height: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.RED_PANTONE_186C,
  },
  countText: {
    color: Colors.WHITE,
    textAlign: "center",
    fontSize: 9,
  }
});