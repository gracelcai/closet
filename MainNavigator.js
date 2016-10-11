import React, { Component } from 'react';


import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Navigator,
  Image,
  TouchableHighlight,
} from 'react-native';


import Spinner from 'react-native-loading-spinner-overlay';

// var ListingTable = require('./ListingTable.js');
var InfiniteScrollingGrid = require('./InfiniteScrollingGrid.js');


var settings = require("./settings.js");
var NavigationBarRouteMapper = {

  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {previousRoute.label}
        </Text>
      </TouchableOpacity>
    );
  },



  RightButton: function(route, navigator, index, navState) {
    return (
      <TouchableOpacity
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]} ref="share">
           查询
         </Text>
      </TouchableOpacity>
    );
  },

  Title: function(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.label}
      </Text>
    );
  },
}

class MainNavigator extends React.Component{
  static defaultProps =  {
    pageSize : 200,
  }
  constructor(props) {
    super(props);
    this.state = {
      progressBar : false,
    };
  }

  render() {
    const routes = [
        {title: 'valley', label : '硅谷', index: 0},
      ];

    return (

      <Navigator
        initialRoute={routes[0]}
        initialRouteStack={ routes }
        renderScene={this.navigatorRenderScene.bind(this)}

        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}
          />
        }
        />

    );
  }


    async getHousesPage(pageNo) {
      try {
        const url = settings.url + "house_price/100/1100000/all/?page="
          + pageNo + "&page_size=200/";
        let response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        let responseJson = await response.json();
        //console.info("Result " , responseJson.results);
        return responseJson.results;
      } catch(error) {
        console.error(error);
      }
    }


    _showLoading(loading) {
      this.state.progressBar = loading;
      this.setState(this.state);
    }

    _renderCell(i, asset) {
      let imageUrl = settings.url + "/media/images/houses/" + asset.property_id + "_1.jpg";
      return (
       <TouchableHighlight onPress={() => this._pressRow(rowID)} underlayColor="transparent">
         <View style={styles.houseCell}>
         <Text style={styles.cellText}>
              {asset.id}
         </Text>
         <Text style={styles.cellText}>
         ${asset.list_price}
         </Text>
         <Image style={styles.thumb} source={{uri: imageUrl}} />
         </View>
       </TouchableHighlight>
   );
    }



  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.title) {
      default:
        return (
          <View style={styles.navigatorContent}>
            <Spinner visible={this.state.progressBar} />
            <InfiniteScrollingGrid  style={styles.scrollGrid} loadMoreData={this.getHousesPage}
              pageSize={this.props.pageSize}
                renderCell={this._renderCell.bind(this)}  showLoading={this._showLoading.bind(this)}    />
          </View>
      );
    }
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  navigatorContent: {
    paddingTop: 64,
    flex : 1,
  },
  scrollGrid : {
    flex : 1,
  },
  houseCell : {
    height : 120,
    padding : 26,
  },
  cellText : {
    width : 90,
    height : 24,
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: '#373E4D',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#5890FF',
  },
  centering: {
   alignItems: 'center',
   justifyContent: 'center',
   padding: 8,
 },

 thumb: {
     width: 88,
     height: 64,
 },
});


module.exports = MainNavigator
