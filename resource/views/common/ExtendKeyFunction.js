
/**
 * @description: giao diện bên tay trái người dùng
 * @author: duynn
 * @since: 02/05/2018
 */
//native-base
import { Body, Header, Left, Right, Title } from 'native-base';
import React, { Component } from 'react';
import { AsyncStorage, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
//redux
import { connect } from 'react-redux';
import { NativeBaseStyle } from '../../assets/styles/NativeBaseStyle';
// import { genIcon } from '../../common/Icons';
import { moderateScale } from '../../assets/styles/ScaleIndicator';
import { SideBarStyle } from '../../assets/styles/SideBarStyle';
import { accountApi } from '../../common/Api';
import SideBarIcon from '../../common/Icons';
import { DM_FUNCTIONS, EMPTY_STRING, generateTitle, SYSTEM_FUNCTION } from '../../common/SystemConstant';
import { emptyDataPage, isArray, showWarningToast } from '../../common/Utilities';
import * as navAction from '../../redux/modules/Nav/Action';
import GoBackButton from './GoBackButton';
import GridPanel from './GridPanel';
import { dataLoading } from '../../common/Effect';

const { TIENICH } = DM_FUNCTIONS;
const { TienichFunction } = SYSTEM_FUNCTION;

const api = accountApi();

class ExtendKeyFunction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      userInfo: {},
      onFocusNow: '',
      notifyCount: 0,
      userFunctions: [],
      loadingUserFunctions: false,

      notifyCount_Lichhop: 0,
      notifyCount_Datxe: 0,
      notifyCount_Chuyenxe: 0,
      notifyCount_Uyquyen: 0,
      notifyCount_Lichtruc: 0,
      notifyCount_Nhacviec: 0,
    }
  }

  fetchFunctions = async () => {
    const result = await accountApi().getUserFunctions([
      this.state.userInfo.ID,
    ]);
    this.setState({
      userFunctions: result.Status ? result.Params : [],
      loadingUserFunctions: false,
    }, () => {
      !result.Status && showWarningToast(result.Message);
    });
  }

  fetchNotifyCount = async () => {
    const result = await api.getNotifyCount([
      this.state.userInfo.ID
    ]);
    this.setState({
      notifyCount_Lichhop: result.notifyCount_Lichhop || 0,
      notifyCount_Datxe: result.notifyCount_Datxe || 0,
      notifyCount_Chuyenxe: result.notifyCount_Chuyenxe || 0,
      notifyCount_Uyquyen: result.notifyCount_Uyquyen || 0,
      notifyCount_Lichtruc: result.notifyCount_Lichtruc || 0,
      notifyCount_Nhacviec: result.notifyCount_Nhacviec || 0,
    });
  }

  async componentWillMount() {
    const storageUserInfo = await AsyncStorage.getItem('userInfo');
    const userInfo = JSON.parse(storageUserInfo);
    this.setState({
      userInfo,
      loadingUserFunctions: true,
    }, () => {
      this.fetchFunctions();
      this.fetchNotifyCount();
    });
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
      // isAndroid && StatusBar.setBackgroundColor('#6a51ae');
      this.fetchNotifyCount();
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  navigate(screenName) {
    this.props.navigation.push(screenName);
  }

  onLogOut() {
    this.refs.confirm.showModal();
  }

  setCurrentFocus(screenName, ref, actionCode = EMPTY_STRING) {
    this.setState({
      onFocusNow: ref,
      notifyCount: 0
    });
    // check authorize
    if (actionCode.includes("UYQUYEN")) {
      this.props.updateAuthorization(1);
    }
    else {
      this.props.updateAuthorization(0);
    }
    const webviewUrl = ref || "";
    this.props.updateExtendsNavParams({
      webviewUrl
    });
    // console.tron.log("WebviewUrl: " + webviewUrl)
    // console.tron.log("ScreenName: "+ screenName)
    this.props.navigation.navigate(screenName);
  }

  generateNotifyCount = (maThaotac) => {
    const {
      notifyCount_Lichhop, notifyCount_Chuyenxe, notifyCount_Datxe, notifyCount_Lichtruc, notifyCount_Uyquyen, notifyCount_Nhacviec,
    } = this.state;

    switch (maThaotac) {

      case TIENICH._DS_YEUCAU_XE.NAME:
        return notifyCount_Datxe;
      case TIENICH._DS_CHUYEN.NAME:
        return notifyCount_Chuyenxe;
      case TIENICH._DS_LICHHOP.NAME:
        return notifyCount_Lichhop;
      case TIENICH._DS_UYQUYEN.NAME:
        return notifyCount_Uyquyen;
      case TIENICH._DS_LICHTRUC.NAME:
        return notifyCount_Lichtruc;
      case TIENICH._DS_NHACNHO.NAME:
        return notifyCount_Nhacviec;
      default:
        break;
    }

    return 0;
  }

  moveToSpecialScreen = (webviewUrl = "", screenTitle = "", screenName = "WebViewerScreen") => {
    this.props.updateExtendsNavParams({
      webviewUrl,
      screenTitle
    });
    this.props.navigation.navigate(screenName);
  }

  render() {
    const { userFunctions, loadingUserFunctions } = this.state;
    let bodyContent = null;
    if (loadingUserFunctions) {
      bodyContent = dataLoading(loadingUserFunctions);
    } else if (isArray(userFunctions) && userFunctions.length > 0) {
      bodyContent = (
        <ScrollView contentContainerStyle={{ paddingVertical: moderateScale(6, 1.2) }}>
          {
            userFunctions.map((item) => {
              if (item.MA_CHUCNANG.indexOf("HSCV_TIENICH") < 0) {
                return null;
              }
              return <GridPanel
                title={item.TEN_CHUCNANG.replace("Quản lý ", "")}
                key={item.DM_CHUCNANG_ID.toString()}
              >
                {
                  item.ListThaoTac.map((sItem) => {
                    const renderCondition = sItem.IS_HIENTHI && sItem.IS_ACCESS_ON_MOBILE;
                    if (renderCondition) {
                      if (sItem.MA_THAOTAC.match(/^KHAC_/)) {
                        return <TouchableOpacity
                          style={SideBarStyle.normalBoxStyle}
                          key={sItem.DM_THAOTAC_ID.toString()}
                          onPress={() => this.moveToSpecialScreen(sItem.MENU_LINK, sItem.TEN_THAOTAC)}
                        >
                          <SideBarIcon
                            actionCode={TienichFunction.actionCodes[6]}
                          />
                          <Text style={SideBarStyle.normalBoxTextStyle}>{sItem.TEN_THAOTAC}</Text>
                        </TouchableOpacity>;
                      }

                      return <TouchableOpacity
                        style={SideBarStyle.normalBoxStyle}
                        key={sItem.DM_THAOTAC_ID.toString()}
                        onPress={() => this.setCurrentFocus(sItem.MOBILE_SCREEN, sItem.MENU_LINK, item.MA_CHUCNANG)}
                      >
                        <SideBarIcon
                          actionCode={sItem.MA_THAOTAC}
                          notifyCount={this.generateNotifyCount(sItem.MA_THAOTAC)}
                        />
                        <Text style={SideBarStyle.normalBoxTextStyle}>{sItem.TEN_THAOTAC_MOBILE || generateTitle(sItem.MA_THAOTAC)}</Text>
                      </TouchableOpacity>;
                    }
                    else {
                      return null;
                    }
                  })
                }
              </GridPanel>
            })
          }
        </ScrollView>
      );
    } else {
      bodyContent = emptyDataPage();
    }

    return (
      <View style={SideBarStyle.container}>
        <StatusBar barStyle="light-content" />
        <Header style={NativeBaseStyle.container}>
          <Left style={NativeBaseStyle.left}>
            <GoBackButton onPress={() => this.props.navigation.goBack()} buttonStyle='100%' />
          </Left>
          <Body style={{ alignItems: 'center', flex: 5 }}>
            <Title style={NativeBaseStyle.bodyTitle}>
              TIỆN ÍCH
            </Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>

        <View style={[SideBarStyle.body]}>
          {bodyContent}
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAuthorization: (hasAuthorization) => dispatch(navAction.updateAuthorization(hasAuthorization)),
    updateExtendsNavParams: (extendsNavParams) => dispatch(navAction.updateExtendsNavParams(extendsNavParams))
  }
}

export default connect(null, mapDispatchToProps)(ExtendKeyFunction);