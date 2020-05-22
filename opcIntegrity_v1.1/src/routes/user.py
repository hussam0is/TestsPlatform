import json
import utils
import random
from flask import request
from models.user import User
from flask_restful import Resource


class UserAPI(Resource):
    def get(self, user_id=None):
        args = dict(request.args)
        users_result = {}
        if user_id:
            user = User.objects(user_id=user_id).fields(id=0).first()
            if user:
                users_result = json.loads(user.to_json())
        elif len(args) == 2:
            search_text = args["search_text"]
            field = args["field"]
            users =  json.loads(User.objects().fields(id=0).order_by(field, "first_name").to_json())
            users_result = utils.search(users, field, search_text)
        else:
            users = User.objects().fields(id=0).order_by("first_name")
            users_result = json.loads(users.to_json())

        return users_result

    def put(self, user_id):
        user_json = request.get_json()

        if "user_id" in user_json.keys():
            del user_json["user_id"]

        try:
            User.objects(user_id=user_id).update_one(**user_json)
            error = False
            message = "User successfully updated"
        except Exception as e:
            error = True
            message = str(e)

        return {"error": error, "message": message}

    def delete(self, user_id):
        try:
            user = User.objects(user_id=user_id)
            error = False
            if user:
                user.delete()
                message = "User successfully deleted"
            else:
                message = f"No user with ID - {user_id}"
        except Exception as e:
            error = True
            message = str(e)

        return {"error": error, "message": message}

    def post(self):
        user_json = request.get_json()
        if "user_id" not in user_json:
            user_json["user_id"] = random.randint(100000000, 999999999)
        try:
            User(**user_json).save()
            error = False
            message = "User successfully added"
        except Exception as e:
            error = True
            message = str(e)

        return {"error": error, "message": message}




