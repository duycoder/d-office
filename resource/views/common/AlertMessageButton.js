import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import styles from '../../assets/styles/AlertMessageStyle';
import { EMPTY_STRING, Colors } from '../../common/SystemConstant';

class AlertMessageButton extends React.Component {
  static defaultProps = {
    btnColorText: Colors.RED_PANTONE_186C,
    btnText: EMPTY_STRING,
  }
  render() {
    const { btnColorText, btnText, onPress } = this.props;
    return (
      <View style={styles.leftFooter}>
        <TouchableOpacity onPress={onPress} style={styles.footerButton}>
          <Text style={[styles.footerText, { color: btnColorText }]}>{btnText}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default AlertMessageButton;