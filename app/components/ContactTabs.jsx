var React = require("react");
var ReactTabs = require("react-tabs");
var Tab = ReactTabs.Tab;  
var Tabs = ReactTabs.Tabs;  
var TabList = ReactTabs.TabList;  
var TabPanel = ReactTabs.TabPanel;                
var FilterableContactReport = require("./FilterableContactReport.jsx");
var FilterableContactTable = require("./FilterableContactTable.jsx");
                              

module.exports = React.createClass({
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