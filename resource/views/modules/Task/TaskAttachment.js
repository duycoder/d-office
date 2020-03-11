/*
* @description: tài liệu đính kèm công việc
* @author: duynn
* @since: 12/05/2018
*/
'use strict'
import React, { Component } from 'react'
import {
  ActivityIndicator,
  FlatList
} from 'react-native'

//lib
import renderIf from 'render-if';
import { List, ListItem, Icon as RneIcon } from 'react-native-elements';
import { Container, Content, Header, Item, Input, Icon } from 'native-base';

//styles
import { DetailTaskStyle } from '../../../assets/styles/TaskStyle';

import { Colors, EMPTY_STRING } from '../../../common/SystemConstant';

//utilities
import { emptyDataPage, convertDateToString, convertTimeToString, onDownloadFile, extention } from '../../../common/Utilities';
import { verticalScale, indicatorResponsive } from '../../../assets/styles/ScaleIndicator';
import { getFileExtensionLogo, getFileSize } from '../../../common/Effect';
import { NativeBaseStyle } from '../../../assets/styles';
import { taskApi } from '../../../common/Api';

export default class TaskAttachment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attachments: props.info.ListTaiLieu,
      searching: false,
      CongViec: props.info.CongViec,
      filterValue: EMPTY_STRING
    }
  }

  onAttachFilter = async () => {
    this.setState({
      searching: true
    });

    const { CongViec, filterValue } = this.state;
    const resultJson = await taskApi().getAttachment(`?id=${CongViec.ID}&attQuery=${filterValue}`);

    this.setState({
      searching: false,
      attachments: resultJson
    });
  }

  renderItem = ({ item }) => {
    let regExtension = extention(item.DUONGDAN_FILE);
    let extension = regExtension ? regExtension[0] : "";
    return <ListItem
      leftIcon={getFileExtensionLogo(extension)}
      title={item.TENTAILIEU}
      titleStyle={{
        marginLeft: 10,
        color: '#707070',
        fontWeight: 'bold'
      }}
      subtitle={
        getFileSize(item.KICHCO) + " | " + convertDateToString(item.NGAYTAO) + " " + convertTimeToString(item.NGAYTAO)
      }
      subtitleStyle={{
        fontWeight: 'normal',
        color: '#707070',
        marginLeft: 10,
      }}
      rightIcon={
        <RneIcon name='download' color={Colors.GREEN_PANTON_369C} size={verticalScale(25)} type='entypo' />
      }
      onPress={() => onDownloadFile(item.TENTAILIEU, item.DUONGDAN_FILE, item.DINHDANG_FILE)}
    />
  }

  render() {
    return (
      <Container>
        <Header searchBar style={NativeBaseStyle.container}>
          <Item style={{ backgroundColor: Colors.WHITE }}>
            <Icon name='ios-search' />
            <Input placeholder='Tên tài liệu'
              value={this.state.filterValue}
              onChangeText={(filterValue) => this.setState({ filterValue })}
              onSubmitEditing={() => this.onAttachFilter()} />
          </Item>
        </Header>


        <Content contentContainerStyle={{ flex: 1, justifyContent: (this.state.searching) ? 'center' : 'flex-start' }}>
          {
            renderIf(this.state.searching)(
              <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
            )
          }

          {
            renderIf(!this.state.searching)(
              <List containerStyle={DetailTaskStyle.listContainer}>
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  data={this.state.attachments}
                  renderItem={this.renderItem}
                  ListEmptyComponent={() =>
                    this.state.loading ? null : (
                      emptyDataPage()
                    )
                  }
                />
              </List>
            )
          }
        </Content>
      </Container>
    );
  }
}

