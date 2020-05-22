import json
from flask import request
from flask_restful import Resource
from models.environment import Environment


class EnvironmentAPI(Resource):
    def get(self):
        environments = [environment.environment_name for environment in Environment.objects().fields(id=0)]
        return environments

    def post(self):
        environment_json = request.get_json()

        try:
            Environment(environment_name=environment_json["environment_name"]).save()
            error = False
            message = "Environment successfully added"
        except Exception as e:
            error = True
            message = str(e)

        return {"error": error, "message": message}




