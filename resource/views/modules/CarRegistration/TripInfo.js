/**
 * @description: thông tin chuyến xe
 * @author: annv
 * @since: 26/10/2019
 */
import React, { Component } from 'react'
import { View, Text, ScrollView, Linking } from 'react-native'

//lib
import { List, ListItem } from 'react-native-elements';
//styles
import { DetailPublishDocStyle } from '../../../assets/styles/PublishDocStyle';
import { InfoStyle } from '../../../assets/styles';

class TripInfo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      info: props.info.entity
    };
  }

  render() {
    const { info } = this.state;

    // render
    return (
      <View style={InfoStyle.container}>
        <ScrollView>
          <List containerStyle={InfoStyle.listContainer}>

            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Tên chuyến
                    </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {info.TEN_CHUYEN}
                </Text>
              } />
            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Tên xe
                    </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {info.TENXE}
                </Text>
              } />
            <ListItem style={InfoStyle.listItemContainer}
              onPress={() => Linking.openURL(`tel:${info.DIENTHOAI_LAIXE}`)}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Điện thoại lái xe
                    </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {info.DIENTHOAI_LAIXE}
                </Text>
              } />
            <ListItem style={InfoStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={InfoStyle.listItemTitleContainer}>
                  Tên lái xe
                    </Text>
              }
              subtitle={
                <Text style={InfoStyle.listItemSubTitleContainer}>
                  {info.TEN_LAIXE}
                </Text>
              } />

            {
              // <ListItem style={InfoStyle.listItemContainer}
              //   hideChevron={true}
              //   title={
              //     <Text style={InfoStyle.listItemTitleContainer}>
              //       Tên cán bộ
              //           </Text>
              //   }
              //   subtitle={
              //     <Text style={InfoStyle.listItemSubTitleContainer}>
              //       {info.TEN_CANBO}
              //     </Text>
              //   } />
              // <ListItem style={InfoStyle.listItemContainer}
              //   hideChevron={true}
              //   title={
              //     <Text style={InfoStyle.listItemTitleContainer}>
              //       Mục đích
              //   </Text>
              //   }
              //   subtitle={
              //     <Text style={InfoStyle.listItemSubTitleContainer}>
              //       {info.MUCDICH}
              //     </Text>
              //   } />
              // <ListItem style={InfoStyle.listItemContainer}
              //   hideChevron={true}
              //   title={
              //     <Text style={InfoStyle.listItemTitleContainer}>
              //       Thời gian xuất phát
              //                   </Text>
              //   }
              //   subtitle={
              //     <Text style={InfoStyle.listItemSubTitleContainer}>
              //       {info.THOIGIAN_XUATPHAT}
              //     </Text>
              //   } />

              // <ListItem style={InfoStyle.listItemContainer}
              //   hideChevron={true}
              //   title={
              //     <Text style={InfoStyle.listItemTitleContainer}>
              //       Số người
              //   </Text>
              //   }
              //   subtitle={
              //     <Text style={InfoStyle.listItemSubTitleContainer}>
              //       {info.SONGUOI}
              //     </Text>
              //   } />

              // <ListItem style={InfoStyle.listItemContainer}
              //   hideChevron={true}
              //   title={
              //     <Text style={InfoStyle.listItemTitleContainer}>
              //       Nội dung
              //   </Text>
              //   }
              //   subtitle={
              //     <Text style={InfoStyle.listItemSubTitleContainer}>
              //       {info.NOIDUNG}
              //     </Text>
              //   } />
            }

            {
              !!info.GHICHU && <ListItem style={InfoStyle.listItemContainer}
                hideChevron={true}
                title={
                  <Text style={InfoStyle.listItemTitleContainer}>
                    Ghi chú
                </Text>
                }
                subtitle={
                  <Text style={InfoStyle.listItemSubTitleContainer}>
                    {info.GHICHU}
                  </Text>
                } />
            }

            {
              // <ListItem style={InfoStyle.listItemContainer}
              //   hideChevron={true}
              //   title={
              //     <Text style={InfoStyle.listItemTitleContainer}>
              //       Trạng thái
              //   </Text>
              //   }
              //   subtitle={
              //     <Text style={[InfoStyle.listItemSubTitleContainer, { color: info.MAU_TRANGTHAI.toString() }]}>
              //       {info.TEN_TRANGTHAI}
              //     </Text>
              //   } />
            }

          </List>
        </ScrollView>
      </View>
    );
  }
}

export default TripInfo;