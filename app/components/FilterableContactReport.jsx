var React = require("react");
var SearchBar = require("c:\\contact-list\\app\\components\\SearchBar.jsx"); 
var ReportTable = require("c:\\contact-list\\app\\components\\ReportTable.jsx"); 

module.exports = React.createClass({
    request: null,
    getInitialState: function() {
        return {
            filterText: '',
            data: null,
            filterRows: []
        };
  },

  handleUserInput: function(filterText) {
      this.setState({
          filterText: filterText
      });
  },

    componentWillUnmount: function() {
        if (this.request) {
            this.request.abort();
            this.request = null;
        }
    },
    
    componentDidMount: function() {
        this.fetchData();
        
    },
    
    fetchData: function() {
        this.request = $.ajax({
            url: "http://jsonplaceholder.typicode.com/users",
            type: "GET",
            contentType: 'application/json',
            success: function(result) {
                console.log("result=" + result);
                var d = result // process results
                this.setState({ data: d });
            }.bind(this)
        });
    },
    
    render: function() {
        if (!this.state.data) {
            return <button className="btn btn-lg btn-warning">
                <span className="glyphicon glyphicon-refresh spinning"></span> Loading...    
                    </button>
        }

        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    onUserInput={this.handleUserInput}
                    />
                <ReportTable
                    contacts={this.state.data}
                    filterText={this.state.filterText}
                    />
            </div>
        );
    },
});
