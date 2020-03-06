import React from 'react';
import { Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { InfoStyle } from '../../../assets/styles';
import { HTML_STRIP_PATTERN } from '../../../common/SystemConstant';
import HTMLView from 'react-native-htmlview';
import util from 'lodash';

class InfoListItem extends React.Component {
  static defaultProps = {
    titleText: '',
    subtitleText: '',
    isRender: true,
    customTitleText: {},
    customSubtitleText: {}
  }
  render() {
    const {
      isRender, titleText, subtitleText,
      customTitleText, customSubtitleText,
    } = this.props;
    if (isRender && util.isString(titleText) && util.isString(subtitleText)) {
      const isHTML = subtitleText.match(HTML_STRIP_PATTERN);
      if (!isHTML) {
        return (
          <ListItem
            style={InfoStyle.listItemContainer}
            hideChevron
            title={titleText}
            titleStyle={InfoStyle.listItemTitleContainer}
            subtitle={subtitleText}
            subtitleStyle={[InfoStyle.listItemSubTitleContainer, customSubtitleText]}
            subtitleNumberOfLines={10}
            titleNumberOfLines={10}
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
          subtitleNumberOfLines={10}
          titleNumberOfLines={10}
        />
      }
    }

    return null;
  }
}

export default InfoListItem;