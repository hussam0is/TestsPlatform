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
        "<h3 dir=ltr style='text-align: left'>Build result:</h3>";
}


function jsonToHtml(_data) {
    var style = fs.readFileSync('allTests.css', 'utf8');
    var template = fs.readFileSync('template.html', 'utf8');
    const build = JSON.parse(_data)
    var output1 ="<ul dir=ltr>" +
        "<li><b>Build Id:</b> " + build.build_id + "</li><br>" +
        "<li><b>Build Name:</b> " + build.build_name + "</li><br>" +
        "<li><b>Jenkins Job Number:</b> " + build.jenkins_job_number + "</li><br>" +
        "<li><b>Status:</b> " + build.status + "</li><br>" +
        "<li><b>Result:</b> " + build.result + "</li><br>" +
        "<li><b>Running Environment:</b> " + build.running_environment + "</li><br>" +
        "<li><b>Date:</b> " + build.date + "</li><br>" +
        "<li><b>Start Time:</b> " + build.start_time + "</li><br>" +
        "<li><b>Run Duration:</b> " + build.run_duration + "</li><br>" +
        "<li><b>Reported To:</b> " + build.reported_to + "</li><br>" +
        "<li><b>Zoho Issue Link:</b> " + build.zoho_issue_link + "</li><br>" +
        "</ul>";

    let th = '<th class="text-left">'
    let output ="<h3>Build consists of the following tests:</h3><br>"
    output += '<table border="1" style="width:100%" dir=ltr class="table-fill">' +
        "<tr>" +
        th + "Test Id</th>" +
        th + "Test Case</th>" +
        th + "Test Title</th>" +
        th + "Category</th>" +
        th + "Test Result</th>" +
        "</tr>";

    build.tests.sort((build1, build2) => build1.test_id - build2.test_id);
    build.tests.forEach(build =>{
        output += "<tr>"
        output += '<td class="text-left">' + build.test_id + "</td>";
        output += '<td class="text-left">' + build.test_case + "</td>";
        output += '<td class="text-left">' + build.test_title + "</td>";
        output += '<td class="text-left">' + build.category + "</td>";
        output += "<td style=\"" + getStatusColor(build.test_result) + "\">" + convertStatus(build.test_result) + "</td>";
        output += "</tr>\n";
    })
    output += "</table>";
    return template.replace('#css#', style).replace('#body#', output1 + output)
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
