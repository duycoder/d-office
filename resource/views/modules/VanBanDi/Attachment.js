/**
 * @description: tài liệu đính kèm văn bản trình ký
 * @author: duynn
 * @since: 04/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

//lib
import { Container, Content, Header, Item, Icon, Input } from 'native-base';
import { List, ListItem, Icon as RneIcon } from 'react-native-elements';

import {
    MenuProvider,
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

//styles
import { DetailSignDocStyle } from '../../../assets/styles/SignDocStyle';

//utilities
import renderIf from 'render-if';
import { API_URL, WEB_URL, EMPTY_STRING, LOADER_COLOR, Colors, BASEDOCSEARCH_CONSTANT } from '../../../common/SystemConstant';
import {
    asyncDelay, isImage, emptyDataPage, convertDateToString,
    convertTimeToString, onDownloadFile, extention
} from '../../../common/Utilities';
import { verticalScale, indicatorResponsive } from '../../../assets/styles/ScaleIndicator';
import { getFileExtensionLogo, getFileSize } from '../../../common/Effect';
import { NativeBaseStyle } from '../../../assets/styles';

export default class AttachSignDoc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            VB_ID: props.docId,
            ListTaiLieu: props.info,
            filterValue: EMPTY_STRING,
            searching: false,
            showDialogSuccess: false,
            showDialogFailure: false,
            openFileConfig: {}
        }
    }

    async onFilter() {
        this.setState({
            searching: true
        });

        const url = `${API_URL}/api/VanBanDi/SearchAttachment?id=${this.state.VB_ID}&attQuery=${this.state.filterValue}`;
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        });

        const result = await fetch(url, {
            method: 'POST',
            headers
        });

        const resultJson = await result.json();

        await asyncDelay(1000);

        this.setState({
            searching: false,
            ListTaiLieu: resultJson
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
            <MenuProvider>
                <Container>
                    <Header searchBar style={NativeBaseStyle.container}>
                        <Item style={{ backgroundColor: Colors.WHITE }}>
                            <Icon name='ios-search' />
                            <Input placeholder='Tên tài liệu'
                                value={this.state.filterValue}
                                onChangeText={(filterValue) => this.setState({ filterValue })}
                                onSubmitEditing={() => this.onFilter()} />
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
                                <List containerStyle={DetailSignDocStyle.listContainer}>
                                    <FlatList
                                        data={this.state.ListTaiLieu}
                                        renderItem={this.renderItem}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListEmptyComponent={() =>
                                            emptyDataPage()
                                        }
                                    />
                                </List>
                            )
                        }
                    </Content>
                </Container>
            </MenuProvider>
        );
    }
}