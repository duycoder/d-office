import React from 'react';
import { View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Colors, generateBadgeIconNoti, generateReadFontStyleAndColor, EMPTY_STRING } from '../../../common/SystemConstant';
import { convertDateTimeToTitle, showWarningToast } from '../../../common/Utilities';
import { ListNotificationStyle } from '../../../assets/styles/ListNotificationStyle';
import { moderateScale } from '../../../assets/styles/ScaleIndicator';
import { accountApi } from '../../../common/Api';

class RecentNoti extends React.Component {
  static defaultProps = {
    item: null,
    index: 0,
    successFunc: EMPTY_STRING,
    readFunc: EMPTY_STRING,
  }

  onPressNotificationItem = async (item, successFunc, readFunc) => {
    if (!item.IS_READ) {
      if (typeof readFunc === 'function') {
        readFunc();
      }
      await accountApi().updateReadStateOfMessage(item);
    }

    //navigate to detail
    let screenName = EMPTY_STRING;
    let screenParam = {};

    let outOfSwitch = false;
    if (item.URL) {
      let urlArr = item.URL.split("/");
      const itemType = urlArr[2] || item.NOTIFY_ITEM_TYPE;
      const itemId = +urlArr[3].split("&").shift().match(/\d+/gm) || item.NOTIFY_ITEM_ID;
      switch (itemType) {
        case "HSVanBanDi":
          screenName = "VanBanDiDetailScreen";
          screenParam = {
            docId: itemId,
            docType: "1"
          };
          break;
        case "QuanLyCongViec":
          screenName = "DetailTaskScreen";
          screenParam = {
            taskId: urlArr[4],
            taskType: "1"
          };
          break;
        case "HSCV_VANBANDEN":
          screenName = "VanBanDenDetailScreen";
          screenParam = {
            docId: itemId,
            docType: "1"
          };
          break;
        case "QL_LICHHOP":
          screenName = "DetailMeetingDayScreen";
          screenParam = {
            lichhopId: itemId,
          };
          break;
        case "QL_DANGKY_XE":
          screenName = "DetailCarRegistrationScreen";
          screenParam = {
            registrationId: itemId,
          };
          break;
        case "QL_CHUYEN":
          screenName = "DetailTripScreen";
          screenParam = {
            tripId: itemId,
          };
          break;
        case "KeHoachKhoa":
          screenName = "ListLichtrucScreen";
          screenParam = {
            listIds: [itemId],
          };
          break;
        default:
          outOfSwitch = true;
          break;
      }
    }
    else if (item.TARGET_SCREEN_NAME) {
      screenName = item.TARGET_SCREEN_NAME;
      screenParam = item.TARGET_SCREEN_PARAMS;
      if (screenParam) {
        if (screenParam.indexOf(',') > -1) {
          screenParam = {
            listIds: screenParam.split(','),
          };
        }
        else {
          screenParam = {
            listIds: [+screenParam]
          };
        }
      }
      else {
        outOfSwitch = true;
      }
    }
    else {
      outOfSwitch = true;
    }

    if (outOfSwitch) {
      showWarningToast('Bạn không có quyền truy cập vào thông tin này!');
    }
    else {
      if (typeof successFunc === 'function') {
        successFunc(screenName, screenParam);
      }
    }
  }

  render() {
    const {
      item, index,
      successFunc, readFunc,
    } = this.props;
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
          onPress={() => this.onPressNotificationItem(item, successFunc, readFunc)}
        />
      );
    }
    return null;
  }
}

export default RecentNoti;
