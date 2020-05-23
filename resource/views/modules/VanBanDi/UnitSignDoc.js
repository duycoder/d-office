/*
* @description: Đơn vị/ phòng ban nhận văn bản
* @author: duynn
* @since: 28/05/2018
*/
import React, { Component } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

//lib
import { Container, Content, Header, Icon, Item, Input } from 'native-base';
import { List, ListItem, Icon as RneIcon } from 'react-native-elements';
import renderIf from 'render-if';

//styles
import { DetailSignDocStyle } from '../../../assets/styles/SignDocStyle';

//utilities
import { EMPTY_STRING, COMMON_COLOR } from '../../../common/SystemConstant';
import { emptyDataPage } from '../../../common/Utilities';
import { verticalScale, indicatorResponsive } from '../../../assets/styles/ScaleIndicator';
import { vanbandiApi } from '../../../common/Api';

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
		let rightIcon = <RneIcon name="eye-with-line" type="entypo" size={verticalScale(25)} color={COMMON_COLOR.MENU_BLUE} />
		if (item.IsDoc) {
			rightIcon = <RneIcon name="eye" type="entypo" size={verticalScale(25)} color={COMMON_COLOR.DANK_GRAY} />
		}
		return <ListItem titleStyle={{color: COMMON_COLOR.BLACK}} title={item.TenDonVi} rightIcon={rightIcon}/>
	}

	onUnitFilter = async () => {
		this.setState({
			searching: true
		});

		const result = await vanbandiApi().getInternalUnits(`?id=${this.state.VanBanDi.ID}&unitQuery=${this.state.filterValue}`)

		this.setState({
			searching: false,
			ListDonVi: result
		});
	}

	render() {
		return (
			<Container>
				<Header searchBar style={{ backgroundColor: COMMON_COLOR.WHITE }}>
					<Item style={{ backgroundColor: COMMON_COLOR.WHITE }}>
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
							<ActivityIndicator size={indicatorResponsive} animating color={COMMON_COLOR.BLUE_PANTONE_640C} />
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