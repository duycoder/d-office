import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import { COMMON_COLOR } from '../../common/SystemConstant';
import { _readableFormat } from '../../common/Utilities';
import { moderateScale, scale } from '../../assets/styles/ScaleIndicator';
import { SideBarStyle } from '../../assets/styles/SideBarStyle';

class NotiTabBarIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationCount: props.notificationCount || props.userInfo.numberUnReadMessage || 0,
      customStyle: props.customStyle || {},
    }
  }
  render() {
    const { notificationCount, customStyle } = this.state;
    let notificationCountText = notificationCount > 99 ? '99+' : notificationCount.toString();

    return notificationCount > 0
      ? <View style={[styles.badge, customStyle]}>
        <Text style={styles.badgeTitle}>
          {notificationCountText}
        </Text>
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
  badge: {
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 10,
    top: -2,
    right: -5,
    padding: 1,
    backgroundColor: COMMON_COLOR.RED,
    borderRadius: 5,
    minWidth: moderateScale(18),
    borderColor: '#fff',
    borderWidth: 1.75
  }, badgeTitle: {
    fontSize: moderateScale(10, 1.05),
    color: COMMON_COLOR.WHITE,
    fontWeight: 'bold'
  }
});