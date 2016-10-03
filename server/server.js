let express = require("express");
let path = require("path");
let FS = require('fs');
let PDF = require('html-pdf');
let bodyParser = require('body-parser')

let app = express();
app.use(express.static(path.join(__dirname, "../app/dist")));

global.__base = __dirname + '/';
app.use( bodyParser.json() ); 

app.listen(3000, ()=> {
    console.log("Started listening on port", 3000);
})

// called when the export report button is clicked
app.post('/makeReport', (req, res)=> {
    try{
        let reportData = buildReport(req.body.rows);
        let reportName = getReportName();
        let options = {
            format: 'Letter'
        };
    
        PDF.create(reportData, options).toFile('./app/dist/' + reportName , (err, pdfRes)=> {
            if (err) {
                console.log(err);
                res.send('err: ' + err); 
                return;
            }
        });
        res.send(reportName); 
    }catch (err) {
        console.log('err: ' + err);
    }
});

// builds a report with the given json report row object
buildReport = (rows)=> {
    try{
        let htm = '<table><thead><tr><th>USER</th><th>ADDRESS</th><th>COMPANY</th></thead><tbody>';
        rows.forEach( (row) => { 
            htm += `<tr><td>${row.id}, ${row.name}, ${row.name}, ${row.username}, ${row.email}</td>
            <td>${row.address.city}, ${row.address.geo.lat}:${row.address.geo.lng} , ${row.address.street}, ${row.address.suite}, ${row.address.zipcode}</td>
            <td>${row.company.name}, ${row.company.catchPhrase}, ${row.company.bs}</td></tr>`;
        });
        htm += '</tbody><table>';
        return htm;
    }catch(error) {
        console.log(error);
    }
}

// returns a report name
getReportName = ()=> {
    let currentdate = new Date(); 
    let reportName = "report-"
    + (currentdate.getMonth()+1)  + "-" 
    + currentdate.getFullYear() + "-"  
    + currentdate.getHours() + "-"  
    + currentdate.getMinutes() + "-" 
    + currentdate.getSeconds() + '.pdf';
    return reportName;
}