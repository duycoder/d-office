/**
 * @description: màn hình chi tiết văn bản trình ký
 * @author: duynn
 * @since: 05/06/2018
 */
'use strict'
import React, { Component } from 'react';
import { View } from 'react-native';

//redux
import { connect } from 'react-redux';

//lib
import {
    Container, Header, Content, Left, Right,
    Button, Body, Item, Icon as NBIcon, Title,
    Tab, Tabs, Text as NBText, ScrollableTab, TabHeading
} from 'native-base';
import {
    Icon as RneIcon
} from 'react-native-elements';
import * as util from 'lodash';

//utilities
import { dataLoading } from '../../../common/Effect';
import { asyncDelay, unAuthorizePage } from '../../../common/Utilities';
import { API_URL, Colors } from '../../../common/SystemConstant';
import { verticalScale, indicatorResponsive, moderateScale } from '../../../assets/styles/ScaleIndicator';

//styles
import { TabStyle } from '../../../assets/styles/TabStyle';
import { NativeBaseStyle } from '../../../assets/styles/NativeBaseStyle'
import { DetailPublishDocStyle } from '../../../assets/styles/PublishDocStyle';

//views
import AttachPublishDoc from './AttachPublishDoc';
import MainInfoPublishDoc from './MainInfoPublishDoc';
import TimelinePublishDoc from './TimelinePublishDoc';

class DetailPubslishDoc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: props.userInfo.ID,
            docId: props.navigation.state.params.docId,
            docInfo: {},
            loading: true,
            isUnAuthorize: false
        }
    }

    componentWillMount() {
        this.setState({
            loading: true
        }, () => {
            this.fetchData();
        })
    }

    fetchData = async () => {
        const url = `${API_URL}/api/VanBanDen/GetDetail/${this.state.docId}/${this.state.userId}`;
        const result = await fetch(url);
        const resultJson = await result.json();

        await asyncDelay(2000);

        this.setState({
            loading: false,
            docInfo: resultJson,
            isUnAuthorize: util.isNull(resultJson)
        });
    }

    navigateBackToList = () => {
        this.props.navigation.navigate('ListIsPublishedScreen');
    }

    render() {
        let bodyContent = null;
        if (this.state.loading) {
            bodyContent = dataLoading(true);
        }
        else if (this.state.isUnAuthorize) {
            bodyContent = unAuthorizePage(this.props.navigation);
        } else {
            bodyContent = <PublishDocContent info={this.state.docInfo} />
        }
        return (
            <Container>
                <Header hasTabs style={{ backgroundColor: Colors.RED_PANTONE_186C }}>
                    <Left style={NativeBaseStyle.left}>
                        <Button transparent onPress={this.navigateBackToList}>
                            <RneIcon name='ios-arrow-round-back' size={moderateScale(40)} color={Colors.WHITE} type='ionicon' />
                        </Button>
                    </Left>

                    <Body style={NativeBaseStyle.body}>
                        <Title style={NativeBaseStyle.bodyTitle}>
                            THÔNG TIN VĂN BẢN
                        </Title>
                    </Body>
                    <Right style={NativeBaseStyle.right}></Right>
                </Header>

                {
                    bodyContent
                }
            </Container>
        );
    }
}

class PublishDocContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTabIndex: 0
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Tabs renderTabBar={() => <ScrollableTab />}
                    initialPage={this.state.selectedTabIndex}
                    onChangeTab={({ index }) => this.setState({
                        currentTab: index
                    })}
                    tabBarUnderlineStyle={TabStyle.underLineStyle}>
                    <Tab heading={
                        <TabHeading style={(this.state.selectedTabIndex == 0 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                            <NBIcon name='ios-information-circle-outline' style={TabStyle.activeText} />
                            <NBText style={[(this.state.selectedTabIndex == 0 ? TabStyle.activeText : TabStyle.inActiveText)]}>
                                THÔNG TIN CHÍNH
                            </NBText>
                        </TabHeading>
                    }>
                        <MainInfoPublishDoc info={this.props.info.vanBanDen} />
                    </Tab>

                    <Tab heading={
                        <TabHeading style={(this.state.selectedTabIndex == 1 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                            <NBIcon name='ios-attach-outline' style={TabStyle.activeText} />
                            <NBText style={[(this.state.selectedTabIndex == 1 ? TabStyle.activeText : TabStyle.inActiveText)]}>
                                ĐÍNH KÈM
                            </NBText>
                        </TabHeading>
                    }>
                        <AttachPublishDoc info={this.props.info} />
                    </Tab>

                    <Tab heading={
                        <TabHeading style={(this.state.selectedTabIndex == 2 ? TabStyle.activeTab : TabStyle.inActiveTab)}>
                            <NBIcon name='ios-time-outline' style={TabStyle.activeText} />
                            <NBText style={[(this.state.selectedTabIndex == 2 ? TabStyle.activeText : TabStyle.inActiveText)]}>
                                LỊCH SỬ XỬ LÝ
                                </NBText>
                        </TabHeading>
                    }>
                        <TimelinePublishDoc info={this.props.info} />
                    </Tab>
                </Tabs>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userState.userInfo
    }
}

export default connect(mapStateToProps)(DetailPubslishDoc);