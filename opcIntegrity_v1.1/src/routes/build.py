import json
import utils
from flask import request
from models.test import Test
from models.user import User
from models.build import Build
from flask_restful import Resource

LAST_BUILDS_LIMIT = 10


def add_result_to_tests(tests, builds_test, order_by):
    for test in tests:
        test["result"] = builds_test[str(test["test_id"])]
    return sorted(tests, key=lambda i: i[order_by])


class BuildAPI(Resource):
    def get(self, build_id=None):
        args = dict(request.args)
        builds_result = {}
        # Build details
        if build_id:
            order_by = args.get("order_by", "result")
            build = Build.objects(build_id=build_id).fields(id=0).first()
            if build:
                tests = json.loads(Test.objects(test_id__in=build.build_tests.keys())
                                   .fields(id=0, test_id=1, test_case=1, test_title=1, category=1, group=1).to_json())
                tests = add_result_to_tests(tests, build.build_tests, order_by)
                reporters = User.objects(user_id__in=build.reporters_ids).fields(id=0)
                builds_result = json.loads(build.to_json())
                builds_result["tests"] = tests
                builds_result["reporters"] = json.loads(reporters.to_json())

        # Single field - distinct
        elif len(args) == 1:
            field = args["field"]
            builds_result = Build.objects().distinct(field)

        # Build search
        elif 3 >= len(args) >= 2:
            field = args["field"]
            builds = Build.objects().fields(id=0, build_id=1, group=1, status=1, result=1, start_time=1).order_by(field, "-start_time")
            builds = json.loads(builds.to_json())

            if len(args) == 2:
                search_text = args["search_text"]
                builds_result = utils.search(builds, field, search_text)

            elif len(args) == 3:
                timestamp_a = args["timestamp_a"]
                timestamp_b = args["timestamp_b"]
                builds_result = utils.search_by_start_time(builds, field, timestamp_a, timestamp_b)

        # Last builds
        else:
            builds_result = [json.loads(build.to_json()) for build in Build.objects()
                .fields(id=0, build_id=1, group=1, status=1, result=1, start_time=1)
                .order_by("-start_time").limit(LAST_BUILDS_LIMIT)]

        return builds_result

    def put(self, build_id):
        build_json = request.get_json()

        if "build_id" in build_json.keys():
            del build_json["build_id"]

        try:
            Build.objects(build_id=build_id).update_one(**build_json)
            error = False
            message = "Build successfully updated"
        except Exception as e:
            error = True
            message = str(e)

        return {"error": error, "message": message}

    def post(self):
        try:
            build_json = request.get_json()
            build = Build(**build_json).save()
            data = {"build_id": build["build_id"]}
            error = False
            message = "Build successfully added"
        except Exception as e:
            error = True

            message = str(e)
            data = {}

        return {"error": error, "message": message, "data": data}
