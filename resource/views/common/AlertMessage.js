import React, { Component } from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';

import styles from '../../assets/styles/AlertMessageStyle';

export default class AlertMessage extends Component {
  static defaultProps = {
    title: "",
    exitText: "KHÔNG",
    bodyText: "",
  }

  state = {
    isVisible: false,
  }

  showModal() {
    this.setState({
      isVisible: true
    })
  }

  onModalClose() {
    console.log('Confirm Action', 'Modal has closed.');
  }

  closeModal() {
    this.setState({
      isVisible: false
    })
  }

  render() {
    return (
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        animationType={'fade'}
        transparent={true}
        visible={this.state.isVisible}
        onRequestClose={() => this.onModalClose()}>
        <View style={styles.container}>
          <View style={styles.body}>
            <Header
              outerContainerStyles={styles.headerOuter}
              centerComponent={
                <Text style={styles.headerCenterTitle}>
                  {this.props.title}
                </Text>
              }
            />
            <View style={styles.content}>
              <Text style={styles.contentText}>
                {this.props.bodyText}
              </Text>
            </View>

            <View style={styles.footer}>
              {this.props.children}
              <View style={styles.rightFooter}>
                <TouchableOpacity onPress={() => this.closeModal()} style={styles.footerButton}>
                  <Text style={[styles.footerText, styles.customFooterText]}>
                    {this.props.exitText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
