'use strict';

var React = require('react');
var ReactNative = require('react-native');

var settings = require("./settings.js");
var {
    Image,
    ListView,
    ListViewDataSource,
    TouchableHighlight,
    StyleSheet,
    Text,
    View,
} = ReactNative;


var getHousesPage = require('./house_fetch.js');

var ListingTable = React.createClass({

    statics: {
        title: '<ListView> - Grid Layout',
        description: 'Flexbox grid layout.'
    },

    getInitialState: function() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: ds.cloneWithRows([]),
        };
    },

    _pressData: ({}: {[key: number]: boolean}),

    componentDidMount: function() {
        getHousesPage(1).then((response) => {
            this.setState({ dataSource : this.state.dataSource.cloneWithRows(response)});
        });
    },


    componentWillMount: function() {
        this._pressData = {};
    },

    render: function() {
        return (
            // ListView wraps ScrollView and so takes on its properties.
            // With that in mind you can use the ScrollView's contentContainerStyle prop to style the items.
          <View style={styles.listContainer}>
            <ListView
                style={{height: 600}}
                enableEmptySections={true}
                contentContainerStyle={styles.list}
                dataSource={this.state.dataSource}
                initialListSize={200}
                pageSize={2} // should be a multiple of the no. of visible cells per row
                scrollRenderAheadDistance={100}
                renderRow={this._renderRow}
                />
          </View>
        );
    },


    _renderRow: function(asset) {

        /*
           d": 1829,
           "address": "FilteredAddress",
           "age_years": 0,
           "house_type": "r",
           "area_id": 0,
           "area_text": "AreaText",
           "bedrooms": 0,
           "city": "Cityname",
           "full_baths": 0,
           "half_baths": 0,
           "listing_id": "ListingID",
           "property_id": "PropertyID",
           "list_price": 0,
           "area_sq_ft": 0.0,
           "lot_sq_ft": 0.0,
           "name": null,
           "postal_code": 0,
           "remarks": "PublicRemarks",
           "status": "",
           "generic_picture": null,
           "longitude": -119.4179324,
           "latitude": 36.778261,
           "video_url": "UnbrandedVirtualTourURL",
           "time_created": "2014-03-30T19:21:04.291119",
           "time_modified": "2016-06-14T14:47:43.003929",
           "num_photos": 0,
           "agent_full_name": "ListingAgentFullName",
           "agent_office": "ListingOfficeName",
           "region": null
           },
           {
         */
        //        var imageUrl = settings.url + "/media/images/houses/" + asset.property_id + "_1.jpg";
        var imageUrl = "https://www.meiguocaihong.com/media/images/houses/"
                     + asset.property_id + "_0.jpg";

        return (
            <TouchableHighlight onPress={() => this._pressRow(rowID)} underlayColor="transparent">
            <View>
            <View style={styles.gridCell}>
            <Text style={styles.text}>
                    {asset.city}
            </Text>
            <Image style={styles.thumb} source={{uri: imageUrl}} />
            <Text style={styles.text}>
            ${asset.list_price}
            </Text>
            </View>
            </View>
            </TouchableHighlight>
        );
    },

    _genRows: function(pressData: {[key: number]: boolean}): Array<string> {
        var dataBlob = [];
        for (var ii = 0; ii < 100; ii++) {
            var pressedText = pressData[ii] ? ' (X)' : '';
            dataBlob.push('Cell ' + ii + pressedText);
        }
        return dataBlob;
    },

    _pressRow: function(rowID: number) {
        this._pressData[rowID] = !this._pressData[rowID];
        this.setState({dataSource: this.state.dataSource.cloneWithRows(
            this._genRows(this._pressData)
        )});
    },
});


var styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FC33',
  },

    list: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    gridCell: {
        justifyContent: 'center',
        padding: 5,
        margin: 3,
        width: 120,
        height: 120,
        backgroundColor: '#FFF6F6',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#CCC'
    },
    thumb: {
        width: 64,
        height: 64
    },
    text: {
        flex: 1,
        marginTop: 5,
        fontWeight: 'bold'
    },
});

module.exports = ListingTable;
