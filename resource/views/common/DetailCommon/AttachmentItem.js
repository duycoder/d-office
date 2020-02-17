import React, { Component } from 'react';
import {
  View, Text, StyleSheet
} from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { isArray, convertDateToString, convertTimeToString, onDownloadFile, extention } from '../../../common/Utilities';
import { InfoStyle } from '../../../assets/styles';
import { Colors } from '../../../common/SystemConstant';
import { verticalScale, moderateScale } from '../../../assets/styles/ScaleIndicator';
import { getFileSize, getFileExtensionLogo } from '../../../common/Effect';

export default class AttachmentItem extends Component {
  static defaultProps = {
    data: []
  }

  render() {
    const { data } = this.props;

    if (isArray(data) && data.length > 0) {
      return (
        <ListItem style={InfoStyle.listItemContainer}
          hideChevron
          title={
            <Text style={InfoStyle.listItemTitleContainer}>
              Đính kèm
            </Text>
          }
          subtitle={
            <View>
              {
                data.map((item, index) => {
                  let regExtension = extention(item.DUONGDAN_FILE);
                  let extension = regExtension ? regExtension[0] : "";
                  return <ListItem
                    key={index.toString()}
                    leftIcon={getFileExtensionLogo(extension)}
                    title={item.TENTAILIEU}
                    titleStyle={styles.titleStyle}
                    subtitle={
                      getFileSize(item.KICHCO) + " | " + convertDateToString(item.NGAYTAO) + " " + convertTimeToString(item.NGAYTAO)
                    }
                    subtitleStyle={styles.subTitleStyle}
                    rightIcon={
                      <Icon name='download' color={Colors.GREEN_PANTON_369C} size={verticalScale(25)} type='entypo' />
                    }
                    containerStyle={styles.containerStyle}
                    onPress={() => onDownloadFile(item.TENTAILIEU, item.DUONGDAN_FILE, item.DINHDANG_FILE)}
                  />
                })
              }
            </View>
          } />
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    marginLeft: 10,
    color: '#707070',
    fontWeight: 'bold',
    fontSize: moderateScale(14, 0.8),
  },
  subTitleStyle: {
    marginLeft: 10,
    color: '#707070',
    fontWeight: 'normal',
    fontSize: moderateScale(14, 0.8),
  },
  containerStyle: {
    borderBottomWidth: 0
  }
});