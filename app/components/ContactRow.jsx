var React = require("react");
var ContactRow = require("c:\\contact-list\\app\\components\\ContactRow.jsx"); 

module.exports = React.createClass({
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
