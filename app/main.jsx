var React = require("react");
var ReactDOM = require("react-dom");
var React = require("react");
var ReactTabs = require("react-tabs");
var Tab = ReactTabs.Tab;  
var Tabs = ReactTabs.Tabs;  
var TabList = ReactTabs.TabList;  
var TabPanel = ReactTabs.TabPanel;  

var ReportTable = React.createClass({
    exportReport: function(event) {
        try{
            event.preventDefault();
            var rows = [];             
            var target =  this.filterRows.rows != null ?  this.filterRows.rows : this.filterRows;
            for (var i=0; i< target.length; i++ ) {
                rows.push(target[i].props.contact);
            }
            var dataToSend = {};
            dataToSend.rows = rows;

            console.log('this.props.filterText=' +  rows);
            this.request = $.ajax({
                dataType: 'json',
                data:  JSON.stringify(dataToSend),
                url: '/makeReport',
                type: 'POST',
                contentType: 'application/json',
                success: function(result) {
                }.bind(this),
                error: function (xhr) { // for some annoying reason Firefox will never call the success function, so i force an error and do the work 
                    if(/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)){ // chrome allows a link to be clicked this way
                        setTimeout( function() {
                            var link = document.createElement('a');
                            link.href = '/' +  xhr.responseText;
                            link.download = '/' +  xhr.responseText;
                            link.click();
                        },2000); // wait 2 seconds for report to be made on the backend then open it
                    }else{ // all browser but chrome can't open a link this way from my knowledge, so user must click the link
                        var link = $('#downloadReport');
                        link.show();  
                        link.attr('href', '/' + xhr.responseText);
                        link.attr('target','_new');
                        link.on("click",function(){
                            // window.open('www.yourdomain.com','_blank');
                            link.hide();
                        });
                    }
                }
            });
        }catch(err)
        {
            alert('err=' + err);
        }
    },
                                                     
    render: function() {
        var rows = [];
        const QUOTE = '"';
        const SPACE = ' ';
        var msg = '';
        var match = false;
        if( this.props.filterText != '') {
            this.props.contacts.forEach(function(contact) {
                if (contact.name.toUpperCase().startsWith( this.props.filterText.toUpperCase() )   ) {
                    match = true;
                    rows.push(<ReportRow contact={contact} key={contact.name} key={contact.username}  key={contact.email} />);
                }
            }.bind(this));
        }
      
        if (!match || this.props.filterText === '') {
            msg = this.props.filterText === '' ? 'Make a report where the  contact\'s  first names start with the letters you type'  : 'No contacts found where the  contact\'s  first name starts with' + SPACE + QUOTE + this.props.filterText + QUOTE;
        } else {
            msg = rows.length==1 ? 'Found one contact, you may export your report now' : 'Found' + SPACE + rows.length + ' contacts\'s that start with' + SPACE + QUOTE + this.props.filterText + QUOTE + SPACE + 'you may export your report now.';
        }
        msg+= '.' + SPACE + 'There are ' + SPACE + this.props.contacts.length + SPACE + 'contacts.';
        this.filterRows = rows; 
        return (
            <div className="table-responsive">
                <div id="info" className="contact-card card card-block row"> {msg} </div>
                <button onClick={this.exportReport} > Export</button>
                <a id="downloadReport" href="#" target="_new" > Downlaod Report </a>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Street</th>
                            <th>Suite</th>
                            <th>City</th>
                            <th>Zip</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    }
});


var FilterableContactTable = React.createClass({
    request: null,
    getInitialState: function() {
        return {
            filterText: '',
            data: null,
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
                <ContactTable
                    contacts={this.state.data}
                    filterText={this.state.filterText}
                />
            </div>
        );
    },
    
});


var FilterableContactReport = React.createClass({
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
                         

var ContactTabs = React.createClass({
    handleSelect: function (index, last) {
        console.log('Selected tab: ' + index + ', Last tab: ' + last);
    },
    render: function() {
    return (
     <Tabs onSelect={this.handleSelect} selectedIndex={1}>
       <TabList>
         <Tab>Contacts</Tab>
          <Tab>Reports</Tab>
       </TabList>
      
        <TabPanel>
          <FilterableContactTable />
        </TabPanel>
        <TabPanel>
          <FilterableContactReport /> 
        </TabPanel>
     </Tabs>
    );
  }
});

var ContacTable = React.createClass({
    render: function() {
      var rows = [];
      var msg = '';
      var match = false;
        var SPACE = ' ';
        if (this.props.filterText != '') {
            this.props.contacts.forEach(function(contact) {
                if (contact.name.indexOf(this.props.filterText) != -1 || contact.username.indexOf(this.props.filterText) != -1  || contact.email.indexOf(this.props.filterText) != -1  ) {
                    match = true;
                    rows.push(<ContactRow contact={contact} key={contact.name} key={contact.username}  key={contact.email} />);
                }
            }.bind(this));
        }
    
        if (!match || this.props.filterText === '') {
            msg = this.props.filterText === '' ? 'Please search for some contacts' : 'No Contacts Found';
        } else {
            msg = rows.length==1 ? 'Found one contact' : 'Found' + SPACE + rows.length + ' contacts';
        }
        msg+= '.' + SPACE + 'There are ' + SPACE + this.props.contacts.length + SPACE + 'contacts.';
        return (
            <div id="contacts">
                <div id="info" className="contact-card card card-block row"> {msg} </div>
                {rows}
            </div>
        );
      }
});

var ContactRow = React.createClass({
    render: function() {
        var name = this.props.contact.name.split(' ');
        var firstName = '', lastName = '';
        if (name.length >1) {
            firstName = name[0];
            lastName = name[1];
        } else if(name.length == 1) {
            firstName = name[0];
        }
        return (
            <div  className="contact-card card card-block row">
                <div className="content">
                    <div className="col-xs-6">
                        <h3 className="contact-name full-name" data-content={firstName + " " + lastName}> <span className="first-name"> {firstName} </span> {lastName} </h3>
    			     <br/><br/>
                        <p className="contact-title card-text">{this.props.contact.username} </p>
                    </div>
                    <div className="col-xs-6">
                        <div className="right-content">
                            <p className="contact-phone"><span>Phone:</span>{this.props.contact.phone}</p>
                            <p className="contact-email"><span>Email:</span> {this.props.contact.email}</p>
                            <p className="address"><span><i>Address:</i></span> </p>
                            <p className="street"><span>Street:</span> {this.props.contact.address.street}</p>
                            <p className="suite"><span>Suite:</span>{this.props.contact.address.suite}</p>
                            <p className="city"><span>City:</span> {this.props.contact.address.city}</p> 
                            <p className="zipcode"><span>Zip:</span> {this.props.contact.address.zipcode}</p> 
                        </div>
                    </div>
                </div>
                <img src={'card.png'}/>
            </div>);
    }
});

var SearchBar = React.createClass({
    handleChange: function() {
        this.props.onUserInput(
            this.refs.filterTextInput.value
        );
    },
    canelSubmitForPhone: function(event) {
        event.preventDefault;
        return false;
    },
    render: function() {
        return (
            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={this.props.filterText}
                    ref="filterTextInput"
                    onChange={this.handleChange} />
        
            </div>
        );
    }
});

var ReportRow = React.createClass({
    render: function() {
        var name = this.props.contact.name.split(' ');
        var firstName = '', lastName = '';
      
        if(name.length >1)  {
            firstName = name[0];
            lastName = name[1];
        } else if( name.length == 1 ) {
            firstName = name[0];
        }
        return (
            <tr>
                <td><span>Name:</span>{name}</td>
                <td><span>Phone:</span>{this.props.contact.phone}</td>
                <td><span>Email:</span> {this.props.contact.email}</td>
                <td><span>Street:</span> {this.props.contact.address.street}</td>
                <td><span>Suite:</span>{this.props.contact.address.suite}</td>
                <td><span>City:</span> {this.props.contact.address.city} </td>
                <td><span>Zip:</span> {this.props.contact.address.zipcode}</td>
            </tr>
        );
    }
});

ReactDOM.render(
  <ContactTabs/>, document.getElementById('container')
);