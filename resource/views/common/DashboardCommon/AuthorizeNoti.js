import React from 'react';
import { View, Text } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { convertDateTimeToTitle } from '../../../common/Utilities';
import { AuthorizeNotiStyle, iconSize, iconColor } from '../../../assets/styles/AuthorizeNotiStyle';

class AuthorizeNoti extends React.Component {
  static defaultProps = {
    item: null,
    index: 0,
  }
  render() {
    const { item, index } = this.props;
    if (item !== null) {
      return (
        <ListItem
          key={index.toString()}
          containerStyle={AuthorizeNotiStyle.containerStyle}
          leftIcon={
            <View style={AuthorizeNotiStyle.leftIconContainer}>
              <Icon name="transition-masked" type="material-community" color={iconColor} size={iconSize} />
            </View>
          }
          hideChevron={true}
          title={
            <Text style={AuthorizeNotiStyle.titleStyle}>
              <Text>{`${item.TEN_NGUOIGUI} `}</Text><Text style={{ color: iconColor }}>{`${item.TIEUDE}`}</Text>
            </Text>
          }
          titleContainerStyle={AuthorizeNotiStyle.titleContainerStyle}
          rightTitle={convertDateTimeToTitle(item.NGAYTAO, true)}
          rightTitleNumberOfLines={2}
          rightTitleStyle={AuthorizeNotiStyle.rightTitleStyle}
          rightTitleContainerStyle={AuthorizeNotiStyle.rightTitleContainerStyle}
          titleNumberOfLines={3}
          onPress={() => this.props.navigation.navigate("DetailNotiUyQuyenScreen", { id: item.ID })}
        />
      );
    }
    return null;
  }
}

export default AuthorizeNoti;