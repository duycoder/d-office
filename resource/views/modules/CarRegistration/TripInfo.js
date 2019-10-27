/**
 * @description: thông tin chuyến xe
 * @author: annv
 * @since: 26/10/2019
 */
import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'

//lib
import { List, ListItem } from 'react-native-elements';
//styles
import { DetailPublishDocStyle } from '../../../assets/styles/PublishDocStyle';

class TripInfo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      info: this.props.info.entity
    };
  }

  render() {
    const { info } = this.state;

    // render
    return (
      <View style={DetailPublishDocStyle.container}>
        <ScrollView>
          <List containerStyle={DetailPublishDocStyle.listContainer}>

            <ListItem style={DetailPublishDocStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                  Tên chuyến
                    </Text>
              }
              subtitle={
                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                  {info.TEN_CHUYEN}
                </Text>
              } />
            <ListItem style={DetailPublishDocStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                  Tên xe
                    </Text>
              }
              subtitle={
                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                  {info.TENXE}
                </Text>
              } />
            <ListItem style={DetailPublishDocStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                  Điện thoại lái xe
                    </Text>
              }
              subtitle={
                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                  {info.DIENTHOAI_LAIXE}
                </Text>
              } />
            <ListItem style={DetailPublishDocStyle.listItemContainer}
              hideChevron={true}
              title={
                <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                  Tên lái xe
                    </Text>
              }
              subtitle={
                <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                  {info.TEN_LAIXE}
                </Text>
              } />

            {
              // <ListItem style={DetailPublishDocStyle.listItemContainer}
              //   hideChevron={true}
              //   title={
              //     <Text style={DetailPublishDocStyle.listItemTitleContainer}>
              //       Tên cán bộ
              //           </Text>
              //   }
              //   subtitle={
              //     <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
              //       {info.TEN_CANBO}
              //     </Text>
              //   } />
              // <ListItem style={DetailPublishDocStyle.listItemContainer}
              //   hideChevron={true}
              //   title={
              //     <Text style={DetailPublishDocStyle.listItemTitleContainer}>
              //       Mục đích
              //   </Text>
              //   }
              //   subtitle={
              //     <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
              //       {info.MUCDICH}
              //     </Text>
              //   } />
              // <ListItem style={DetailPublishDocStyle.listItemContainer}
              //   hideChevron={true}
              //   title={
              //     <Text style={DetailPublishDocStyle.listItemTitleContainer}>
              //       Thời gian xuất phát
              //                   </Text>
              //   }
              //   subtitle={
              //     <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
              //       {info.THOIGIAN_XUATPHAT}
              //     </Text>
              //   } />

              // <ListItem style={DetailPublishDocStyle.listItemContainer}
              //   hideChevron={true}
              //   title={
              //     <Text style={DetailPublishDocStyle.listItemTitleContainer}>
              //       Số người
              //   </Text>
              //   }
              //   subtitle={
              //     <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
              //       {info.SONGUOI}
              //     </Text>
              //   } />

              // <ListItem style={DetailPublishDocStyle.listItemContainer}
              //   hideChevron={true}
              //   title={
              //     <Text style={DetailPublishDocStyle.listItemTitleContainer}>
              //       Nội dung
              //   </Text>
              //   }
              //   subtitle={
              //     <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
              //       {info.NOIDUNG}
              //     </Text>
              //   } />
            }

            {
              !!info.GHICHU && <ListItem style={DetailPublishDocStyle.listItemContainer}
                hideChevron={true}
                title={
                  <Text style={DetailPublishDocStyle.listItemTitleContainer}>
                    Ghi chú
                </Text>
                }
                subtitle={
                  <Text style={DetailPublishDocStyle.listItemSubTitleContainer}>
                    {info.GHICHU}
                  </Text>
                } />
            }

            {
              // <ListItem style={DetailPublishDocStyle.listItemContainer}
              //   hideChevron={true}
              //   title={
              //     <Text style={DetailPublishDocStyle.listItemTitleContainer}>
              //       Trạng thái
              //   </Text>
              //   }
              //   subtitle={
              //     <Text style={[DetailPublishDocStyle.listItemSubTitleContainer, { color: info.MAU_TRANGTHAI.toString() }]}>
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