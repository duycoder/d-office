import React from 'react';
import { Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { _readableFormat } from '../../../common/Utilities';
import { COMMON_COLOR } from '../../../common/SystemConstant';
import { CalendarItemStyle } from '../../../assets/styles/CalendarItemStyle';

class CalendarItem extends React.Component {
  static defaultProps = {
    item: null,
    index: 0,
    listIds: [],
  }
  render() {
    const { item, index, listIds } = this.props;
    if (item !== null) {
      const {
        ID, NOIDUNG, TEN_NGUOI_CHUTRI, TEN_VAITRO_CHUTRI, TEN_PHONGBAN_CHUTRI,
        GIO_CONGTAC, PHUT_CONGTAC, DIADIEM,
      } = item;

      let ChutriString = "",
        ChutriArr = [],
        ThoigianDiadiemString = `${_readableFormat(GIO_CONGTAC)}h${_readableFormat(PHUT_CONGTAC)}${DIADIEM ? ` - ${DIADIEM}` : ""}`;
      if (TEN_NGUOI_CHUTRI) {
        ChutriArr.push(TEN_NGUOI_CHUTRI.split(" - ").reverse().join(" "));
      }
      if (TEN_VAITRO_CHUTRI) {
        ChutriArr.push(TEN_VAITRO_CHUTRI);
      }
      if (TEN_PHONGBAN_CHUTRI) {
        ChutriArr.push(TEN_PHONGBAN_CHUTRI);
      }
      if (ChutriArr.length > 0) {
        ChutriString = ChutriArr.join(", ");
      }

      let isNotiAlertTextColor = listIds.some(x => x == item.ID) ? COMMON_COLOR.OLD_LITE_BLUE : COMMON_COLOR.BLACK;
      const title = `${ThoigianDiadiemString} / Chủ trì: ${ChutriString}`;

      return (
        <ListItem
          key={index.toString()}
          containerStyle={CalendarItemStyle.containerStyle}
          hideChevron
          title={title}
          titleStyle={[CalendarItemStyle.titleStyle, { color: isNotiAlertTextColor }]}
          subtitleStyle={CalendarItemStyle.subTitleStyle}
          subtitle={NOIDUNG}
          onPress={() => this.props.onPressCalendar(ID)}
        />
      );
    }
    return null;
  }
}

export default CalendarItem;