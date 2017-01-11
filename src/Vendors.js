import React, { Component } from 'react';
import { ListView } from 'react-native';
import Rebase from 're-base';
import config from './lib/config';
import List from './List';
import { Spinner } from './common';

const base = Rebase.createClass(config);

class Vendors extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: this.ds,
      data: null,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.fetchData();
  }

  fetchData() {
    base.fetch('vendors', {
      context: this,
      asArray: true
    }).then(data => {

      const sortedData = data.sort((a, b) => {
        if (a.distance < b.distance) {
          return -1;
        }
        if (a.distance > b.distance) {
          return 1;
        }
        return 0;
      });

     this.setState({
       data: sortedData,
       isLoading: false,
       dataSource: this.ds.cloneWithRows(sortedData)
     });
    }).catch(error => {
      console.error(error);
      this.setState({ isLoading: false });
    });
  }

  renderRow(rowData) {
    return (
      <List vendor={rowData} />
    );
  }

  render() {
    const { isLoading, dataSource } = this.state;

    return !isLoading ?
        <ListView
          dataSource={dataSource}
          renderRow={(rowData) => this.renderRow(rowData)}
        />
        : <Spinner />;
  }
}
export default Vendors;
