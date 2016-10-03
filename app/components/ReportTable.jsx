var React = require("react");
var ReportRow = require("./ReportRow.jsx"); 

module.exports = React.createClass({
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
