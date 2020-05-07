const nodemailer = require('nodemailer');
const fs = require('fs');

function convertStatus(status) {
    switch (status) {
        case 1:
            return "Running";
        case 2:
            return "Stopped";
        case 3:
            return "Success";
        case 4:
            return "Failed";
    }
    return "";
}

function getStatusColor(status) {
    switch (status) {
        case 1:
            return "color:black";
        case 2:
            return "color:blue";
        case 3:
            return "color:green";
        case 4:
            return "color:red";
    }
    return "";
}


function title() {
    return "<h3 dir=ltr style='text-align: left'>Last 10 result:</h3><br>"+
        "<img src=\"cid:logo\" style='display: block; width: 40%;  margin-left: auto; margin-right: auto'/><br>";
}

function title2() {
    return "<img src=\"cid:logo\" style='display: block; width: 50%;  margin-left: auto; margin-right: auto'/>" +
        "<h3 dir=ltr style='text-align: left'>Build details : </h3><br>";
}


function jsonToHtml(_data) {
    var style = fs.readFileSync('reportDetails.css', 'utf8');
    var template = fs.readFileSync('template.html', 'utf8');
    const build = JSON.parse(_data);
    var output ="<ul dir=ltr>" +
        " <li>Build_Id: " + build.build_id + "</li><br>" +
        " <li>Result</li><br>" +
        " <li>Status</li><br>" +
        " <li>Date</li><br>" +
        " <li>Start Time</li><br>" +
        " <li>Name</li><br>" +
        "</ul>";
    output += build.build_id;
    output += build.build_name;
    output += build.result;
    output += "<style=\"" + getStatusColor(build.status) + "\">" + convertStatus(build.status);
    output += build.date;
    output += build.start_time;
    output += build.build_name;
    return template.replace('#css#', style).replace('#body#', output)
}

function jsonListToHtml(_data) {
    const style = fs.readFileSync('allTests.css', 'utf8');
    const template = fs.readFileSync('template.html', 'utf8');
    const pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
    const json_builds = JSON.parse(_data)
        .filter(build => (build.status == 3 || build.status == 4))
        .sort((build1, build2) => new Date(build2.date.replace(pattern, '$3-$2-$1')) - new Date(build1.date.replace(pattern, '$3-$2-$1')))
        .slice(0, 10)
        .sort((build1, build2) => build2.status - build1.status);
    const th = '<th class="text-left">'
    var output = '<table border="1" style="width:100%" dir=ltr class="table-fill">' +
        "<tr>" +
        th + "Build Id</th>" +
        th + "Result</th>" +
        th + "Status</th>" +
        th + "Date</th>" +
        th + "Start Time</th>" +
        "</tr>";

    json_builds.forEach(build => {
        const td = '<td class="text-left">';
        output += "<tr>"
        output += td + build.build_id + "</td>";
        output += td + build.result + "</td>";
        output += "<td style=\"" + getStatusColor(build.status) + "\">" + convertStatus(build.status) + "</td>";
        output += td + build.date + "</td>";
        output += td + build.start_time + "</td>";
        output += "</tr>\n";
    })
    output += "</table>";
    return template.replace('#css#', style).replace('#body#', output);
}

exports.sendEmailAllBuilds = function (_to, _data) {
    console.log("sendEmailAllBuilds()");
    const _user = 'OPCloudSoftware@gmail.com';
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: _user,
            pass: 'OPCloudSoftwareIntegrityManagementSystem'
        }
    });

    let title1 = title;
    const mailOptions = {
        from: _user,
        to: _to.toString(),
        subject: 'Build report from Jenkins',
        text: _data,
        html: title1() + jsonListToHtml(_data),
        attachments: [{
            filename: 'image.png',
            path : "image.png",
            cid: 'logo' //same cid value as in the html img src
        }]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
exports.sendBuildDetails = function (_to, _data) {
    console.log("sendBuildDetails()");
    const _user = 'OPCloudSoftware@gmail.com';
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: _user,
            pass: 'OPCloudSoftwareIntegrityManagementSystem'
        }
    });
    let title3 = title2;
    const mailOptions = {
        from: _user,
        to: _to.toString(),
        subject: 'Build details report from Jenkins ' + new Date().toLocaleString(),
        text: _data,
        html: title3() + jsonToHtml(_data),
        attachments: [{
            filename: 'image.png',
            path : "image.png",
            cid: 'logo' //same cid value as in the html img src
        }]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
