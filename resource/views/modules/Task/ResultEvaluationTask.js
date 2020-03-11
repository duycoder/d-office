/**
 * @description: thông tin kết quả đánh giá công việc
 * @author: duynn
 * @since: 07/06/2018
 */
import React, { Component } from 'react';

import { StyleSheet } from 'react-native';
//lib
import {
  Container, Content,
  Form, Label, Item, Text
} from 'native-base';

import { Col, Row, Grid } from 'react-native-easy-grid';

//utilities
import { convertDateToString } from '../../../common/Utilities'

//styles
import { verticalScale, scale, moderateScale } from '../../../assets/styles/ScaleIndicator'

export default class ResultEvaluationTask extends Component {
  state = {
    data: this.props.data.PhieuDanhGia,
    mainProcess: this.props.data.NGUOIXULYCHINH,
    ownProcess: this.props.data.NGUOIGIAOVIEC
  }

  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Item stackedLabel style={styles.item}>
              <Label style={styles.label}>Ngày đánh giá</Label>
              <Text style={styles.info}>
                {
                  convertDateToString(this.state.data.NGAYDANHGIA)
                }
              </Text>
            </Item>

            <Item stackedLabel style={styles.item}>
              <Label style={styles.label}>Người tự đánh giá</Label>
              <Text style={styles.info}>
                {
                  this.state.mainProcess
                }
              </Text>
            </Item>

            <Item stackedLabel style={styles.item}>
              <Label style={styles.label}>Ngày duyệt đánh giá</Label>
              <Text style={styles.info}>
                {
                  convertDateToString(this.state.data.NGAYDUYET)
                }
              </Text>
            </Item>

            <Item stackedLabel style={styles.item}>
              <Label style={styles.label}>Người duyệt</Label>
              <Text style={styles.info}>
                {
                  this.state.ownProcess
                }
              </Text>
            </Item>

            <Item stackedLabel style={styles.item}>
              <Label style={styles.label}>Xếp loại</Label>
              <Text style={styles.info}>
                {
                  this.state.data.XEPLOAI
                }
              </Text>
            </Item>

            <Item stackedLabel style={styles.item}>
              <Label style={styles.label}>Kết luận</Label>
              <Text style={styles.info}>
                {
                  this.state.data.KETLUAN
                }
              </Text>
            </Item>
          </Form>

          <Form style={styles.tableContainer}>
            <Grid>
              <Row>
                <Col style={[styles.columnHeader, styles.wideColumn]}>
                  <Text style={styles.columnHeaderText}>
                    Hạng mục
                                    </Text>
                </Col>

                <Col style={[styles.columnHeader, styles.wideColumn]}>
                  <Text style={styles.columnHeaderText}>
                    Điểm tự đánh giá
                                    </Text>
                </Col>

                <Col style={[styles.columnHeader, styles.wideColumn]}>
                  <Text style={styles.columnHeaderText}>
                    Điểm duyệt
                                    </Text>
                </Col>
                <Col style={[styles.columnHeader, styles.wideColumn]}>
                  <Text style={styles.columnHeaderText}>
                    Trọng số
                                    </Text>
                </Col>
                <Col style={[styles.columnHeader, styles.wideColumn]}>
                  <Text style={styles.columnHeaderText}>
                    Tổng điểm
                                    </Text>
                </Col>
              </Row>

              <Row>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text style={styles.rowLabelText}>
                    Tự chủ cao
                                    </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.TDG_TUCHUCAO}
                  </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.DD_TUCHUCAO}
                  </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    2
                                    </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.DD_TUCHUCAO * 2}
                  </Text>
                </Col>
              </Row>

              <Row>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text style={styles.rowLabelText}>
                    Trách nhiệm lớn
                                    </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.TDG_TRACHNHIEMLON}
                  </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.DD_TRACHNHIEMLON}
                  </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    2
                                    </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.DD_TRACHNHIEMLON * 2}
                  </Text>
                </Col>
              </Row>

              <Row>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text style={styles.rowLabelText}>
                    Tương tác tốt
                                    </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.TDG_TUONGTACTOT}
                  </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.DD_TUONGTACTOT}
                  </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    1
                                    </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.DD_TUONGTACTOT * 1}
                  </Text>
                </Col>
              </Row>

              <Row>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text style={styles.rowLabelText}>
                    Tốc độ nhanh
                                    </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.TDG_TOCDONHANH}
                  </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.DD_TOCDONHANH}
                  </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    1
                                    </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.DD_TOCDONHANH * 1}
                  </Text>
                </Col>
              </Row>

              <Row>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text style={styles.rowLabelText}>
                    Tiến bộ nhiều
                                    </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.TDG_TIENBONHIEU}
                  </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.DD_TIENBONHIEU}
                  </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    1
                                    </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.DD_TIENBONHIEU * 1}
                  </Text>
                </Col>
              </Row>

              <Row>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text style={styles.rowLabelText}>
                    Thành tích vượt
                                    </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.TDG_THANHTICHVUOT}
                  </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.DD_THANHTICHVUOT}
                  </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    3
                                    </Text>
                </Col>
                <Col style={[styles.column, styles.wideColumn]}>
                  <Text>
                    {this.state.data.DD_THANHTICHVUOT * 3}
                  </Text>
                </Col>
              </Row>

              <Row>
                <Col size={80} style={[styles.columnFooter]}>
                  <Text style={styles.columnHeaderText}>
                    Tổng cộng
                                    </Text>
                </Col>

                <Col size={20} style={[styles.columnFooter]}>
                  <Text style={styles.columnHeaderText}>
                    {this.state.data.TONGDIEM}
                  </Text>
                </Col>
              </Row>
            </Grid>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  tableContainer: {
    marginTop: verticalScale(10)
  },
  columnHeader: {
    backgroundColor: '#f1f1f2',
    height: verticalScale(60),
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRightColor: '#fff',
    borderRightWidth: 1,
    paddingLeft: scale(10),
  },
  columnFooter: {
    backgroundColor: '#f1f1f2',
    height: verticalScale(60),
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: scale(10),
  },
  column: {
    backgroundColor: '#fff',
    height: verticalScale(60),
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: scale(10),
    borderRightColor: '#f1f1f2',
    borderRightWidth: 1,
    borderBottomColor: '#f1f1f2',
    borderBottomWidth: 1
  },
  columnHeaderText: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left'
  },
  rowLabelText: {
    fontSize: moderateScale(11, 1.09)
  },
  wideColumn: {
    flex: 1
  },
  item: {
    alignItems: 'flex-start',
    margin: 0,
    padding: 0
  },
  label: {
    marginVertical: verticalScale(5),
    fontWeight: 'bold',
    color: '#000',
  }, info: {
    color: '#777',
    flexWrap: 'wrap'
  }, labelUnderline: {
    fontWeight: 'bold',
    color: '#000',
    textDecorationLine: 'underline'
  }
});
