import json
import utils
import random
from flask import request
from models.reports_kind import ReportsKind
from flask_restful import Resource


class ReportsKindAPI(Resource):
    def get(self, kind_name=None):
        if kind_name:
            # Return just the existing kind names
            if kind_name == "kind_names":
                kinds_names = [report_kind.kind_name for report_kind in ReportsKind.objects()]
                return kinds_names
            else:
                reports_kinds = ReportsKind.objects(kind_name=kind_name).fields(id=0).first()
        else:
            reports_kinds = ReportsKind.objects().fields(id=0).order_by("kind_name")

        if reports_kinds:
            reports_kinds = json.loads(reports_kinds.to_json())
        else:
            reports_kinds = "No reports kind found."

        return reports_kinds

    def put(self, kind_name):
        report_kind_json = request.get_json()
        try:
            ReportsKind.objects(kind_name=kind_name).update_one(**report_kind_json)
            error = False
            message = "ReportKind successfully updated"
        except Exception as e:
            error = True
            message = str(e)

        return {"error": error, "message": message}

    def post(self):
        report_kind_json = request.get_json()
        try:
            ReportsKind(**report_kind_json).save()
            error = False
            message = "ReportKind successfully added"
        except Exception as e:
            error = True
            message = str(e)

        return {"error": error, "message": message}




