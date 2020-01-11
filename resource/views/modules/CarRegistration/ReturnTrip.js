/**
 * @description: màn hình trình xử lý văn bản
 * @author: duynn
 * @since: 16/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { ActivityIndicator, View, Text as RnText, FlatList } from 'react-native';

//utilites
import {
  API_URL, HEADER_COLOR, LOADER_COLOR, LOADMORE_COLOR, EMPTY_STRING,
  DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, WORKFLOW_PROCESS_TYPE, Colors,
  MODULE_CONSTANT,
  TOAST_DURATION_TIMEOUT
} from '../../../common/SystemConstant';
import { asyncDelay, emptyDataPage, backHandlerConfig, appGetDataAndNavigate, formatMessage } from '../../../common/Utilities';
import { verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';
import * as util from 'lodash';
import { pushFirebaseNotify } from '../../../firebase/FireBaseClient';

//effect
import { dataLoading, executeLoading } from '../../../common/Effect';

//redux
import { connect } from 'react-redux';
import * as workflowAction from '../../../redux/modules/Workflow/Action';
import * as navAction from '../../../redux/modules/Nav/Action';


//lib
import {
  Container, Header, Left, Button, Content, Title,
  Tabs, Tab, TabHeading, ScrollableTab, Text, Icon,
  Form, Textarea, Body, Item, Input, Right, Toast,
  Label, ListItem, CheckBox
} from 'native-base';
import renderIf from 'render-if';
import { Icon as RneIcon } from 'react-native-elements';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle';

//views
import GoBackButton from '../../common/GoBackButton';
import { tripApi } from '../../../common/Api';

class ReturnTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userInfo.ID,
      tripId: this.props.extendsNavParams.tripId,
      ghichu: EMPTY_STRING,

      executing: false,
    }
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  saveReturn = async () => {
    const {
      tripId, ghichu, userId
    } = this.state;
    
    this.setState({
      executing: true
    });

    const resultJson = await tripApi().returnTrip({
      userId,
      tripId,
      ghichu
    });

    this.setState({
      executing: false
    })

    Toast.show({
      text: 'Trả xe ' + resultJson.Status ? 'thành công' : 'thất bại',
      type: resultJson.Status ? 'success' : 'danger',
      buttonText: "OK",
      buttonStyle: { backgroundColor: Colors.WHITE },
      buttonTextStyle: { color: resultJson.Status ? Colors.GREEN_PANTONE_364C : Colors.RED_PANTONE_186C },
      duration: TOAST_DURATION_TIMEOUT,
      onClose: () => {
        if (resultJson.Status) {
          this.props.updateExtendsNavParams({ check: true });
          this.navigateBack();
        }
      }
    });
  }

  render() {
    return (
      <Container>
        <Header hasTabs style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.navigateBack()} />
          </Left>

          <Body style={[NativeBaseStyle.body, { flex: 5 }]}>
            <Title style={NativeBaseStyle.bodyTitle}>
              TRẢ XE
            </Title>
          </Body>

          <Right style={NativeBaseStyle.right}>
            <Button transparent onPress={() => this.saveReturn()}>
              <RneIcon name='md-send' size={verticalScale(30)} color={Colors.WHITE} type='ionicon' />
            </Button>
          </Right>
        </Header>

        <Content contentContainerStyle={{ padding: 10 }}>
          <Form>
            <Textarea rowSpan={5} bordered placeholder='Ghi chú' onChangeText={(ghichu) => this.setState({ ghichu })} />
          </Form>
        </Content>
        {
          executeLoading(this.state.executing)
        }
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userState.userInfo,
    extendsNavParams: state.navState.extendsNavParams,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReturnTrip);