
// Render a fixed grid with fixed size cells inside a Scroll View
// Cells rendered are bigger than Visible window
// if user scroll to within a limit of the end, more async loading will happen
// only during that time the state will be changed and rendering happens
import React, { Component } from 'react';
import { Text,  ScrollView, View , StyleSheet} from 'react-native';


class InfiniteScrollingGrid extends React.Component {
  static defaultProps =  {
    cellWidth: 64,
    cellHeight : 64,
    cellPadding : 16,
    numCellsPerRow : 2,
    // how many rows to display (including invisible rows) at a time,
    // these rows are kept in a ScrollView
    rowsOffScreenBuffer :  80,

    // how many items to async load  from the network at a time
    pageSize : 100,
    /**
     * How early to start loading more rows before current in-memory rows are depleted
     * due to scrolling, in number of rows.
     */
    rowsLoadAhead : 20,
    dataLoadingFunction : undefined,
  };


  // Initialize the state for keeping the cells as children
  constructor(props) {
    super(props);
    this.redrawing = false;
    this.state = {
      // data array
      rowsData : [],

      // where does the visible window start within the data array
      // number of visible rows is total height of the grid  divided
      // by row height (cell height plus padding)

      // row height (cell height plus padding)
      rowHeight : props.cellHeight + props.cellPadding,

      // the first item within the global data array to keep in memory
      dataSourcePageBegin : 0,
      // the last item within the data array to keep in memory
      dataFullyLoaded : false,

   };
   this.scrollView = undefined;
 }


 componentDidMount() {
   this._loadMoreData();
 }

 componentDidUpdate(prevProps,prevState) {
 }

 render() {
   console.log("render called");
    var rows = [];
    var cellIdx = 0;
    var cellsInRow = [];
    for (var i = this.state.dataSourcePageBegin ; i <
      Math.min(this.state.rowsData.length, this.state.dataSourcePageBegin + this.props.rowsOffScreenBuffer) ; i++) {
      if (cellIdx % this.props.numCellsPerRow == 0) {
        if (cellsInRow.length > 0) {
          rows.push((
            <View style={styles.gridRow}>
              {cellsInRow}
            </View>
          ));
        }
        cellsInRow = [];
      }
      let cellElem = this.props.renderCell(i, this.state.rowsData[i]);
      cellsInRow.push(cellElem);
      cellIdx ++;
      // var cellStyle = cellElem.style == undefined ? {} : cellElem.style;
      // Object.assign(cellStyle, {height : this.state.rowHeight} );
      // cellElem.style = cellStyle;
    }
    return (
      <ScrollView style={styles.listContainer}
        ref={(scrollView) => { this.scrollView = scrollView; }}
        contentContainerStyle={styles.listContent}
        onScroll={this._onScroll.bind(this)}
        >
        {rows}
      </ScrollView>
    );
  }

  _loadMoreData() {
    if (this.state.dataFullyLoaded) {
        return;
    }
    this.props.showLoading(true);
    // calc the pageNo to be loaded from curr buffer size and page size
    const { rowsData, dataSourcePageBegin } = this.state;
    const numPagesInMemory = rowsData.length / this.props.pageSize;

    // page index starts at 1 on server
    this.props.loadMoreData(numPagesInMemory + 1).then((response) => {
      this.props.showLoading(false);
      dataFullyLoaded = response.length == 0;
      this.setState({
        rowsData : rowsData.concat(response) ,
        dataSourcePageBegin : Math.max(0, rowsData.length - this.props.rowsOffScreenBuffer),
        dataFullyLoaded : dataFullyLoaded,
      });
    });

  }

  reenableScroll() {
    this.redrawing = false;
    this.scrollView.scrollTo({y: 0});
    console.log("scroolled to 0");

  }


  // somehow this component needs to know the per row height of
  // children and do scroll calc on that
  _onScroll(e: Object) {
    if (this.redrawing) {
      console.log("scroll ignored");
      return;
    }

    var offset = e.nativeEvent.contentOffset['y'];

    // check if we need to load more data into memory
    var topVisibileRow =  Math.floor(offset / this.state.rowHeight) + this.state.dataSourcePageBegin;


    console.log("Scrolled to " , offset , "page begin " , this.state.dataSourcePageBegin,
      " top row ", topVisibileRow);
    if (topVisibileRow * this.props.numCellsPerRow >= this.state.dataSourcePageBegin +
       this.props.rowsOffScreenBuffer - this.props.rowsLoadAhead) {
      //
      this.redrawing = true;
      setTimeout(this.reenableScroll.bind(this), 7000);

      console.log("Near end of off screen buffer, changing visible window, redraw :",
        this.redrawing);
      // see if we need to load more data
      if (topVisibileRow * this.props.numCellsPerRow >=
         this.state.rowsData.length - this.props.rowsLoadAhead) {
      // load more data into offscreen buffer
      // loadMoreData must be an async function
        console.log("Loading more data now, curr data len " ,
          this.state.rowsData.length);
        this._loadMoreData();
      } else {
        // no need to load data, just shift the offscreen buffer downward
        const { dataSourcePageBegin } = this.state;
        this.setState({
          dataSourcePageBegin : topVisibileRow * this.props.numCellsPerRow ,
        });
      }
    }

  }
}



var styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  gridRow : {
    flexDirection : 'row',
    flex: 1,
  },
  listContent : {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FC33',
  }
});


module.exports = InfiniteScrollingGrid;
