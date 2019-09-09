/*
* @description: Đơn vị/ phòng ban nhận văn bản
* @author: duynn
* @since: 28/05/2018
*/
import React, { Component } from 'react';
import { ActivityIndicator, View, ScrollView, FlatList, Text } from 'react-native';

//lib
import { Container, Content, Header, Icon, Item, Input, Col } from 'native-base';
import { List, ListItem, Icon as RneIcon } from 'react-native-elements';
import renderIf from 'render-if';

//styles
import { DetailSignDocStyle } from '../../../assets/styles/SignDocStyle';

//utilities
import { API_URL, EMPTY_STRING, LOADER_COLOR, Colors } from '../../../common/SystemConstant';
import { asyncDelay, emptyDataPage } from '../../../common/Utilities';
import { verticalScale, indicatorResponsive } from '../../../assets/styles/ScaleIndicator';

export default class UnitSignDoc extends Component {
	constructor(props) {
		super(props);
		this.state = {
			VanBanDi: props.info.VanBanTrinhKy,
			ListDonVi: props.info.ListDonViNhanVanBan,
			filterValue: EMPTY_STRING
		}
	}

	renderItem = ({ item }) => {
		let rightIcon = <RneIcon name="eye-with-line" type="entypo" size={verticalScale(25)} color={Colors.MENU_BLUE} />
		if (item.IsDoc) {
			rightIcon = <RneIcon name="eye" type="entypo" size={verticalScale(25)} color={Colors.DANK_GRAY} />
		}
		return <ListItem titleStyle={{color: Colors.BLACK}} title={item.TenDonVi} rightIcon={rightIcon}/>
	}

	onUnitFilter = async () => {
		this.setState({
			searching: true
		});

		const url = `${API_URL}/api/VanBanDi/SearchInternalUnit?id=${this.state.VanBanDi.ID}&unitQuery=${this.state.filterValue}`;

		const result = await fetch(url, {
			method: 'GET'
		}).then(response => response.json()).then(responseJson => {
			return responseJson;
		});

		await asyncDelay(1000)

		this.setState({
			searching: false,
			ListDonVi: result
		});
	}

	render() {
		return (
			<Container>
				<Header searchBar style={{ backgroundColor: Colors.WHITE }}>
					<Item style={{ backgroundColor: Colors.WHITE }}>
						<Icon name='ios-search' />
						<Input placeholder='Tên phòng ban, đơn vị'
							onChangeText={(filterValue) => this.setState({ filterValue })}
							onSubmitEditing={() => this.onUnitFilter()}
							value={this.state.filterValue} />
					</Item>
				</Header>
				<Content contentContainerStyle={{ flex: 1, justifyContent: (this.state.searching ? 'center' : 'flex-start') }}>
					{
						renderIf(this.state.searching)(
							<ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
						)
					}

					{
						renderIf(!this.state.searching)(
							<List containerStyle={DetailSignDocStyle.listContainer}>
								<FlatList
									data={this.state.ListDonVi}
									keyExtractor={(item, index) => index.toString()}
									renderItem={this.renderItem}
									ListEmptyComponent={() =>
										emptyDataPage()
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