import React from 'react';
import { View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Colors, generateBadgeIconNoti, generateReadFontStyleAndColor } from '../../../common/SystemConstant';
import { convertDateTimeToTitle } from '../../../common/Utilities';
import { ListNotificationStyle } from '../../../assets/styles/ListNotificationStyle';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';

class RecentNoti extends React.Component {
  static defaultProps = {
    item: null,
    index: 0
  }

  render() {
    const { item, index, onPressNotificationItem } = this.props;
    if (item !== null) {
      let currentBackgroundColor = Colors.WHITE;
      let itemType = item.URL.split('/')[2];
      const { badgeBackgroundColor, leftTitle } = generateBadgeIconNoti(itemType);
      const { checkReadColor, checkReadFont } = generateReadFontStyleAndColor(item.IS_READ);

      if (index % 2 !== 0) {
        currentBackgroundColor = Colors.LIGHT_GRAY_PASTEL;
      }
      return (
        <ListItem
          key={index.toString()}
          containerStyle={{ backgroundColor: currentBackgroundColor, borderBottomColor: "#ccc" }}
          leftIcon={
            <View style={[ListNotificationStyle.leftTitleCircle, { backgroundColor: badgeBackgroundColor }]}>
              <Text style={ListNotificationStyle.leftTitleText}>{leftTitle}</Text>
            </View>
          }
          hideChevron
          title={item.NOIDUNG}
          titleStyle={[ListNotificationStyle.title, { fontWeight: checkReadFont, color: checkReadColor }]}
          titleContainerStyle={{
            marginHorizontal: '3%',
          }}
          titleNumberOfLines={3}
          rightTitle={convertDateTimeToTitle(item.NGAYTAO, true)}
          rightTitleNumberOfLines={2}
          rightTitleStyle={{
            textAlign: 'center',
            color: Colors.DARK_GRAY,
            fontSize: moderateScale(12, 0.9),
            fontStyle: 'italic',
            fontWeight: checkReadFont,
          }}
          rightTitleContainerStyle={{
            flex: 0
          }}
          onPress={() => onPressNotificationItem(item)}
        />
      );
    }
    return null;
  }
}

export default RecentNoti;