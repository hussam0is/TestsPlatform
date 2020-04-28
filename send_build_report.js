var nodemailer = require('nodemailer');

function convertStatus(status) {
    switch (status) {
        case 1: return "Running";
        case 2: return "Stopped";
        case 3: return "Success";
        case 4: return "Failed";
    }
    return "";
}

function getStatusColor(status) {
    switch (status) {
        case 1: return "color:black";
        case 2: return "color:blue";
        case 3: return "color:green";
        case 4: return "color:red";
    }
    return "";
}
function title() {
    return "<H1 dir=ltr>The result:</H1><br>";
}

function jsonToHtml(_data) {
    const build = JSON.parse(_data)
    var output = "<table border=\"1\" style=\"width:100%\" dir=ltr>" +
        "<tr>" +
        "    <th>Build Id</th>" +
        "    <th>Result</th>" +
        "    <th>Status</th>" +
        "    <th>Date</th>" +
        "    <th>Start Time</th>" +
        "    <th>Name</th>" +
        "</tr>" ;
    const td = "<td>";
    output += "<tr>"
    output += td + build.build_id + "</td>";
    output += td + build.result + "</td>";
    output += "<td style=\"" + getStatusColor(build.status) +"\">" + convertStatus(build.status) + "</td>";
    output += td + build.date + "</td>";
    output += td + build.start_time + "</td>";
    output += td + build.build_name + "</td>";
    output += "</tr>\n";
    output += "</table>";
    return output;
}

function jsonListToHtml(_data) {
    var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
    const json_builds = JSON.parse(_data)
        .filter(build => (build.status == 3 || build.status == 4))
        .sort((build1, build2) => new Date(build2.date.replace(pattern,'$3-$2-$1')) - new Date(build1.date.replace(pattern,'$3-$2-$1')))
        .slice(0, 10)
        .sort((build1, build2) => build2.status - build1.status);
    var output = "<table border=\"1\" style=\"width:100%\" dir=ltr>" +
        "<tr>" +
        "    <th>Build Id</th>" +
        "    <th>Result</th>" +
        "    <th>Status</th>" +
        "    <th>Date</th>" +
        "    <th>Start Time</th>" +
        "</tr>" ;

    json_builds.forEach(build => {
        const td = "<td>";
        output += "<tr>"
        output += td + build.build_id + "</td>";
        output += td + build.result + "</td>";
        output += "<td style=\"" + getStatusColor(build.status) +"\">" + convertStatus(build.status) + "</td>";
        output += td + build.date + "</td>";
        output += td + build.start_time + "</td>";
        output += "</tr>\n";
    })
    output += "</table>";
    return output;
}

exports.sendEmailAllBuilds = function(_to, _data) {
    console.log("sendEmailAllBuilds()");
    const _user = 'OPCloudSoftware@gmail.com';
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: _user,
            pass: 'OPCloudSoftwareIntegrityManagementSystem'
        }
    });

    const mailOptions = {
        from: _user,
        to: _to.toString(),
        subject: 'Build report from Jenkins ' +  Date(),
        text: _data,
        html: title() + jsonListToHtml(_data)
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
exports.sendBuildDetails = function(_to, _data) {
    console.log("sendBuildDetails()");
    const _user = 'OPCloudSoftware@gmail.com';
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: _user,
            pass: 'OPCloudSoftwareIntegrityManagementSystem'
        }
    });

    const mailOptions = {
        from: _user,
        to: _to.toString(),
        subject: 'Build details report from Jenkins ' +  Date(),
        text: _data,
        html: title() + jsonToHtml(_data)
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
//--------------------------- Example---------------------------------------
exports. data = '[\n' +
    '\t{\n' +
    '\t  "build_id": 23,\n' +
    '\t  "status": 1,\n' +
    '\t  "result": "28/50",\n' +
    '\t  "date": "28/03/2020",\n' +
    '\t  "start_time": "10:45:44"\n' +
    '  },\n' +
    '  {\n' +
    '\t  "build_id": 24,\n' +
    '\t  "status": 4,\n' +
    '\t  "result": "12/40",\n' +
    '\t  "date": "27/02/2020",\n' +
    '\t  "start_time": "21:29:12"\n' +
    '  },\n' +
    '  {\n' +
    '\t  "build_id": 29,\n' +
    '\t  "status": 3,\n' +
    '\t  "result": "34/50",\n' +
    '\t  "date": "01/04/2020",\n' +
    '\t  "start_time": "22:55:43"\n' +
    '  },\n' +
    '  {\n' +
    '\t  "build_id": 2,\n' +
    '\t  "status": 2,\n' +
    '\t  "result": "19/30",\n' +
    '\t  "date": "02/04/2020",\n' +
    '\t  "start_time": "23:23:57"\n' +
    '  },\n' +
    '  {\n' +
    '\t  "build_id": 88,\n' +
    '\t  "status": 3,\n' +
    '\t  "result": "15/47",\n' +
    '\t  "date": "03/04/2020",\n' +
    '\t  "start_time": "11:30:39"\n' +
    '  },\n' +
    '  {\n' +
    '\t  "build_id": 56,\n' +
    '\t  "status": 4,\n' +
    '\t  "result": "40/50",\n' +
    '\t  "date": "04/04/2020",\n' +
    '\t  "start_time": "01:57:33"\n' +
    '  },\n' +
    '  {\n' +
    '\t  "build_id": 43,\n' +
    '\t  "status": 4,\n' +
    '\t  "result": "29/33",\n' +
    '\t  "date": "04/04/2020",\n' +
    '\t  "start_time": "12:01:09"\n' +
    '  },\n' +
    '  {\n' +
    '\t  "build_id": 12,\n' +
    '\t  "status": 3,\n' +
    '\t  "result": "32/32",\n' +
    '\t  "date": "04/04/2020",\n' +
    '\t  "start_time": "18:19:12"\n' +
    '  },\n' +
    '  {\n' +
    '\t  "build_id": 76,\n' +
    '\t  "status": 4,\n' +
    '\t  "result": "10/50",\n' +
    '\t  "date": "05/08/2020",\n' +
    '\t  "start_time": "10:23:40"\n' +
    '  },\n' +
    '  {\n' +
    '\t  "build_id": 23,\n' +
    '\t  "status": 4,\n' +
    '\t  "result": "28/37",\n' +
    '\t  "date": "20/04/2020",\n' +
    '\t  "start_time": "19:56:10"\n' +
    '  }\n' +
    ']'
exports.build = "{\n" +
    "  \"build_id\": 23,\n" +
    "  \"status\": 1,\n" +
    "  \"result\": \"28/50\",\n" +
    "  \"date\": \"28/03/2020\",\n" +
    "  \"start_time\": \"10:45:44\",\n" +
    "  \"build_name\" : \"Test 23\",\n" +
    "  \"tests\": [\n" +
    "    {\n" +
    "      \"test_id\": 1,\n" +
    "      \"test_case\": \"bla\",\n" +
    "      \"test_title\": \"o1-o2\"\n" +
    "    },\n" +
    "    {\n" +
    "      \"test_id\": 2,\n" +
    "      \"test_case\": \"alb\",\n" +
    "      \"test_title\": \"o3-o42\"\n" +
    "\n" +
    "    }\n" +
    "  ]\n" +
    "}";

exports.recipients = ['avil2101@gmail.com'];

//exports.sendEmailAllBuilds(recipients, data);
//exports.sendBuildDetails(recipients, build);

