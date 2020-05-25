const nodemailer = require('nodemailer');
const fs = require('fs');

Number.prototype.toHHMMSS = function () {
    var sec_num = this
    //var days   = Math.floor(sec_num / 3600 / 24);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    let res ='';
    if(hours > 0) {
        res += `${hours} hr`
    }
    if(minutes > 0) {
        if(res.length > 0) {
            res += ', '
        }
        res += `${minutes} min`
    }
    if(seconds > 0) {
        if(res.length > 0) {
            res += ', '
        }
        res+= `${seconds} sec`
    }
    return res
}

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


function image() {
    return "<img src=\"cid:logo\" style='display: block; width: 40%;  margin-left: auto; margin-right: auto'/><br>";
}

function buildDetailsTitle(running_environment, build_id, status) {
    return `${running_environment} environment, Build #${build_id}, Status: ${status}`;
}


function jsonToHtml(build) {
    var style = fs.readFileSync('allTests.css', 'utf8');
    var template = fs.readFileSync('template.html', 'utf8');
    var output1 ="<ul dir=ltr>" +
        "<li><b>Build Id:</b> " + build.build_id + "</li><br>" +
        "<li><b>Build Name:</b> " + build.build_name + "</li><br>" +
        "<li><b>Jenkins Job Number:</b> " + build.jenkins_job_number + "</li><br>" +
        "<li><b>Status:</b> "  + convertStatus(build.status) + "</li><br>" +
        "<li><b>Result:</b> " + build.result + "</li><br>" +
        "<li><b>Running Environment:</b> " + build.running_environment + "</li><br>" +
        "<li><b>Date:</b> " + build.date + "</li><br>" +
        "<li><b>Start Time:</b> " + build.start_time + "</li><br>" +
        "<li><b>Run Duration:</b> " + build.run_duration + "</li><br>" +
        "<li><b>Reported To:</b> " + build.reported_to + "</li><br>" +
        "<li><b>Zoho Issue Link:</b> " + build.zoho_issue_link + "</li><br>" +
        "</ul>";

    let th = '<th class="text-left">'
    let output ="<h3 dir='ltr'>Build consists of the following tests:</h3><br>"
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
        output += '<td class="text-left">' + `<a href='${build.test_id_link}'>#${build.test_id}</a>`+ "</td>";
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
    let json_build = JSON.parse(_data)
    let json_builds = json_build.all_builds
        .filter(build => (build.status == 3 || build.status == 4))

        .sort((build1, build2) => new Date(build2.date.replace(pattern, '$3-$2-$1')) - new Date(build1.date.replace(pattern, '$3-$2-$1')))
        .sort((build1, build2) => {
            if(build1.build_name > build2.build_name) {
                return -1
            } else if (build1.build_name < build2.build_name) {
                return 1
            }
            return 0
        })
    const helpList = []
    let initialName
    if (json_builds.length > 0) json_builds[0].build_name
    let counter = 0
    json_builds.forEach(build => {
        if (build.build_name == initialName) {
            if (counter < 5) {
                helpList.push(build)
                counter++
            }
        } else {
            initialName = build.build_name
            helpList.push(build)
            counter = 1
        }
    })
    json_builds = helpList
    const th = '<th class="text-left">'
    let output = ''
    //last_builds
    output += "<h3 dir=ltr style='text-align: left'>Environments status:</h3><br>"
    output += '<table border="1" style="width:100%" dir=ltr class="table-fill">' +
        "<tr>" +
        th + "Name</th>" +
        th + "Last Success Build</th>" +
        th + "Last Failure Build</th>" +
        th + "Last build Duration</th>" +
        "</tr>";

    json_build.last_builds.forEach(build => {
        const td = '<td class="text-left">';
        output += "<tr>"
        output += td + `<a href='${build.build_name_url}'><div style="height:100%;width:100%">${build.build_name}</div></a>`+ "</td>";
        output += td + `${build.last_success_duration.toHHMMSS()} - <a href='${build.success_build_id_url}'>#${build.success_build_id}</a>` + "</td>";
        output += td + `${build.last_failure_duration.toHHMMSS()} - <a href='${build.failure_build_id_url}'>#${build.failure_build_id}</a>` + "</td>";
        output += td + build.last_build_duration.toHHMMSS() + "</td>";
        output += "</tr>\n";
    })
    output += "</table>";
    output += '<br><br>'

    //all builds
    output += "<h3 dir=ltr style='text-align: left'>Build's details for last 5 builds for each environment:</h3><br>"
    output += '<table border="1" style="width:100%" dir=ltr class="table-fill">' +
        "<tr>" +
        th + "Name</th>" +
        th + "Id</th>" +
        th + "Result</th>" +
        th + "Status</th>" +
        th + "Date</th>" +
        th + "Start Time</th>" +
        "</tr>";

    json_builds.forEach(build => {
        const td = '<td class="text-left">';
        output += "<tr>"
        output += td + `<a href='${build.build_name_url}'><div style="height:100%;width:100%">${build.build_name}</div></a>`+ "</td>";
        output += td + `<a href='${build.build_id_url}'><div style="height:100%;width:100%">#${build.build_id}</div></a>` + "</td>";
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

    const mailOptions = {
        from: _user,
        to: _to.toString(),
        subject: 'OPCloud bi-monthly builds report',
        html: image() + jsonListToHtml(_data),
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
    const build = JSON.parse(_data)
    const title = buildDetailsTitle(build.running_environment, build.build_id, convertStatus(build.status))
    const mailOptions = {
        from: _user,
        to: _to.toString(),
        subject: title + " " + new Date().toLocaleString(),
        html:  image() + `<h2 dir=ltr>Status: <span style='${getStatusColor(build.status)}'>${convertStatus(build.status)}</span></h2>` + jsonToHtml(build),
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
