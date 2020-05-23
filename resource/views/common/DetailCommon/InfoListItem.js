import React from 'react';
import { Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { InfoStyle } from '../../../assets/styles';
import { COMMON_REGEX } from '../../../common/SystemConstant';
import HTMLView from 'react-native-htmlview';
import util from 'lodash';

class InfoListItem extends React.Component {
  static defaultProps = {
    titleText: '',
    subtitleText: '',
    isRender: true,
    customTitleText: {},
    customSubtitleText: {},
    customSubtitleNumberOfLines: 10,
    customTitleNumberOfLines: 10,
  }
  render() {
    const {
      isRender, titleText, subtitleText,
      customTitleText, customSubtitleText, 
      customTitleNumberOfLines, customSubtitleNumberOfLines,
    } = this.props;
    if (isRender && util.isString(titleText) && util.isString(subtitleText)) {
      const isHTML = subtitleText.match(COMMON_REGEX.HTML_STRIP_PATTERN);
      if (!isHTML) {
        return (
          <ListItem
            style={InfoStyle.listItemContainer}
            hideChevron
            title={titleText}
            titleStyle={InfoStyle.listItemTitleContainer}
            subtitle={subtitleText}
            subtitleStyle={[InfoStyle.listItemSubTitleContainer, customSubtitleText]}
            subtitleNumberOfLines={customSubtitleNumberOfLines}
            titleNumberOfLines={customTitleNumberOfLines}
          />
        );
      }
      else {
        <ListItem
          style={InfoStyle.listItemContainer}
          hideChevron
          title={titleText}
          titleStyle={InfoStyle.listItemTitleContainer}
          subtitle={
            <HTMLView
              value={subtitleText}
              stylesheet={{ p: InfoStyle.listItemSubTitleContainer }}
            />
          }
          subtitleNumberOfLines={customSubtitleNumberOfLines}
          titleNumberOfLines={customTitleNumberOfLines}
        />
      }
    }

    return null;
  }
}

export default InfoListItem;