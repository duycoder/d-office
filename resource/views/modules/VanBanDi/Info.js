/**
 * @description: thông tin chính văn bản trình ký
 * @author: duynn
 * @since: 04/05/2018
 */
import React, { Component } from 'react'
import { View,Text, ScrollView } from 'react-native'

//lib
import { List, ListItem } from 'react-native-elements'
import _ from 'lodash';
import HTMLView from 'react-native-htmlview';
//styles
import { DetailSignDocStyle } from '../../../assets/styles/SignDocStyle';
//common
import { convertDateToString } from '../../../common/Utilities';

export default class MainInfoSignDoc extends Component {
    constructor(props){
        super(props);
        this.state = {
            info: props.info
        }
    }

    render(){
        return(
            <View style={DetailSignDocStyle.container}>
                <ScrollView>
                    <List containerStyle={DetailSignDocStyle.listContainer}>
                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    HÌNH THỨC VĂN BẢN
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.TEN_LOAIVANBAN}
                                </Text>
                            }/>

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    LĨNH VỰC
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.TEN_LINHVUC}
                                </Text>
                            }/>

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    TRÍCH YẾU
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.TRICHYEU}
                                </Text>
                            }/>

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    NGÀY BAN HÀNH
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {convertDateToString(this.state.info.NGAYBANHANH)}
                                </Text>
                            }/>

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    SỐ KÝ HIỆU
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.SOHIEU}
                                </Text>
                            }/>

                         <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    THỜI HẠN XỬ LÝ
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                     {convertDateToString(this.state.info.THOIHANXULY)}
                                </Text>
                            }/>

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    ĐỘ KHẨN
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.TEN_DOKHAN}
                                </Text>
                            }/>

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    SỐ TỜ
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.SOTO || 'N/A'}
                                </Text>
                            }/>

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    SỐ BẢN SAO
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.SOBANSAO || 'N/A'}
                                </Text>
                            }/>

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    NGƯỜI KÝ
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.TEN_NGUOIKY || 'N/A'}
                                </Text>
                            }/>

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    CHỨC VỤ NGƯỜI KÝ
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.CHUCVU}
                                </Text>
                            }/>

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    NỘI DUNG VĂN BẢN
                                </Text>
                            }
                            subtitle={
                                <HTMLView
                                    value={this.state.info.NOIDUNG}
                                />
                            }/>
                    </List>
                </ScrollView>
            </View>
        );
    }
}