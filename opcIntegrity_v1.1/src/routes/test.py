import csv
import json
import utils
from io import StringIO
from flask import request
from models.test import Test
from models.user import User
from models.build import Build
from flask_restful import Resource
from .build import add_result_to_tests


def get_tests_results_dict():
    tests_results_dict = {}
    for build in  Build.objects():
        for test_id, test_result in build.build_tests.items():
            if not test_id in tests_results_dict.keys():
                tests_results_dict[test_id] = {}
            if not test_result in tests_results_dict[test_id].keys():
                tests_results_dict[test_id][test_result] = 0

            tests_results_dict[test_id][test_result] += 1

    return tests_results_dict


def add_success_rate_to_tests(tests):
    tests_results_dict = get_tests_results_dict()
    for test in tests:
        if str(test["test_id"]) in tests_results_dict.keys():
            passed_count = tests_results_dict[str(test["test_id"])].get("Passed", 0)
            failed_count = tests_results_dict[str(test["test_id"])].get('Failed', 0)
            test["success_rate"] = f"{str(passed_count)}/{(failed_count + passed_count)}"
        else:
            test["success_rate"] = "0/0"


class TestAPI(Resource):
    def get(self, test_id=None):
        args = dict(request.args)
        test_result = {}
        # Test details
        if test_id:
            test = Test.objects(test_id=test_id).fields(id=0).first()
            test_result = json.loads(test.to_json())

        # Single field - distinct
        elif len(args) == 1 and "field" in args:
            field = args["field"]
            test_result = Test.objects().distinct(field)

        # Tests search
        elif len(args) == 2:
            field = args["field"]
            search_text = args["search_text"]
            tests = Test.objects().fields(id=0, symbol=0,test_steps=0, test_data=0, expected_result=0).order_by(field, "test_id")
            tests = json.loads(tests.to_json())
            test_result = utils.search(tests, field, search_text)
            # Add success rate to the tests
            add_success_rate_to_tests(test_result)

        # Tests of last build
        else:
            order_by = args.get("order_by", "test_id")
            last_build = Build.objects().fields(id=0).order_by("-start_time").first()
            if last_build:
                test_result = json.loads(Test.objects(test_id__in=last_build.build_tests.keys())
                                         .fields(id=0, symbol=0,test_steps=0, test_data=0, expected_result=0)
                                         .order_by('test_id').to_json())

                test_result = add_result_to_tests(test_result, last_build.build_tests, order_by)
                # Add success rate to the tests
                add_success_rate_to_tests(test_result)

        return test_result

    def post(self):
        data = {}
        # Add tests from csv file
        if request.files:
            try:
                tests_csv_file = request.files["tests_csv_file"]
                tests_csv_file = StringIO(tests_csv_file.read().decode())
                reader = csv.DictReader(tests_csv_file)
                for test in reader:
                    # Convert csv headers to match db columns
                    test_to_insert = {k.lower().translate({32:'_'}): v for k, v in test.items()}
                    Test(**test_to_insert).save()
                error = True
                message = "Tests successfully added"
            except Exception as e:
                error = True
                message = str(e)

        # Add test from post request
        else:
            try:
                test_json = request.get_json()
                test = Test(**test_json).save()
                data = {"test_id": test["test_id"]}
                error = False
                message = "Test successfully added"
            except Exception as e:
                error = True
                message = str(e)

        return {"error": error, "message": message, "data": data}

    def put(self, test_id):
        test_json = request.get_json()

        if "test_id" in test_json.keys():
            del test_json["test_id"]

        try:
            Test.objects(test_id=test_id).update_one(**test_json)
            error = False
            message = "Test successfully updated"
        except Exception as e:
            error = True
            message = str(e)

        return {"error": error, "message": message}

    def delete(self, test_id):
        try:
            test = Test.objects(test_id=test_id)
            error = False
            if test:
                test.delete()
                message = "Test successfully deleted"
            else:
                message = f"No test with ID - {test_id}"
        except Exception as e:
            error = True
            message = str(e)

        return {"error": error, "message": message}


class TestHistoryAPI(Resource):
    def get(self, test_id=None):
        if test_id:
            test = Test.objects(test_id=test_id).fields(id=0, test_id=1, test_title=1, group=1).first()
            test = json.loads(test.to_json())
            add_success_rate_to_tests([test])

            # Get test's builds
            builds = Build.objects.fields(id=0, build_id=1, running_environment=1, start_time=1, status=1, build_tests=1)\
                .filter(__raw__={f'build_tests.{test_id}': {'$exists': True}}).order_by("-build_id")
            builds = json.loads(builds.to_json())
            for build in builds:
                build["test_status"] = build["build_tests"][str(test["test_id"])]
                del build["build_tests"]

            test_result = {"test": test,
                           "builds": builds}

        return test_result
