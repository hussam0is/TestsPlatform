import json
from flask import request
from models.user import User
from flask_restful import Resource


class ConnectAPI(Resource):
    def post(self):
        data = request.get_json()
        user = User.objects(email_address=data["email_address"], password=data["password"]).fields(id=0).first()
        if user:
            connect_json = {"error": False, "data": json.loads(user.to_json()), "message": "Logged in successfully"}
        else:
            connect_json = {"error": True, "data": {}, "message": "Invalid username or password"}

        return connect_json

