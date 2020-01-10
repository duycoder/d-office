import React from 'react';
import { ListItem, Icon } from 'react-native-elements';
import { View, Text } from 'react-native';
import { BirthdayNotiStyles, iconColor, iconSize } from '../../../assets/styles/BirthdayNotiStyle';

class BirthdayNoti extends React.Component {
  static defaultProps = {
    birthdayData: null,
  }
  render() {
    if (this.props.birthdayData !== null) {
      const { title, body } = this.props.birthdayData;
      return (
        <ListItem
          containerStyle={BirthdayNotiStyles.containerStyle}
          leftIcon={
            <View style={BirthdayNotiStyles.leftIconContainer}>
              <Icon name="gift" type="font-awesome" color={iconColor} size={iconSize} />
            </View>
          }
          hideChevron={true}
          title={title}
          titleStyle={BirthdayNotiStyles.titleStyle}
          titleContainerStyle={BirthdayNotiStyles.titleContainerStyle}
          subtitle={body}
          subtitleStyle={BirthdayNotiStyles.subTitleStyle}
          subtitleContainerStyle={BirthdayNotiStyles.subTitleContainerStyle}
          titleNumberOfLines={3}
        />
      );
    }
    return null;
  }
}

export default BirthdayNoti;