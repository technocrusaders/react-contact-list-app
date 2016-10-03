var React = require("react");

module.exports = React.createClass({
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
