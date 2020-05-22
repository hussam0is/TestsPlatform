import json
import utils
from flask import request
from models.user import User
from models.report import Report
from flask_restful import Resource

LAST_REPORT_LIMIT = 10


class ReportAPI(Resource):
    def get(self, report_id=None):
        args = dict(request.args)
        report_result = {}
        # Report details
        if report_id:
            report = Report.objects(report_id=report_id).fields(id=0).first()
            if report:
                reporters = User.objects(user_id__in=report.reporters_ids).fields(id=0)
                report_result = json.loads(report.to_json())
                report_result["reporters"] = json.loads(reporters.to_json())

        # Report search
        elif 3 >= len(args) >= 2:
            field = args["field"]
            reports = Report.objects().fields(id=0, report_id=1, build_id=1, date=1).order_by(field, "-date")
            reports = json.loads(reports.to_json())

            if len(args) == 2:
                search_text = args["search_text"]
                report_result = utils.search(reports, field, search_text)

            elif len(args) == 3:
                timestamp_a = args["timestamp_a"]
                timestamp_b = args["timestamp_b"]
                report_result = utils.search_by_start_time(reports, field, timestamp_a, timestamp_b)

        # Last Reports
        else:
            report_result = [json.loads(report.to_json()) for report in Report.objects()
                .fields(id=0, report_id=1, build_id=1, date=1)
                .order_by("-report_id").limit(LAST_REPORT_LIMIT)]

        return report_result

    def put(self, report_id):
        report_json = request.get_json()

        if "report_id" in report_json.keys():
            del report_json["report_id"]

        try:
            Report.objects(report_id=report_id).update_one(**report_json)
            error = False
            message = "Report successfully updated"
        except Exception as e:
            error = True
            message = str(e)

        return {"error": error, "message": message}

    def post(self):
        try:
            report_json = request.get_json()
            report = Report(**report_json).save()
            data = {"report_id": report["report_id"]}
            error = False
            message = "Report successfully added"
        except Exception as e:
            error = True
            message = str(e)
            data = {}

        return {"error": error, "message": message, "data": data}
