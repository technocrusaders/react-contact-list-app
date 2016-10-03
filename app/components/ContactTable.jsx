var React = require("react");
var ContactRow = require("./ContactRow.jsx");

module.exports = React.createClass({
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
