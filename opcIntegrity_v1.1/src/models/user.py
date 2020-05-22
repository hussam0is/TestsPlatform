from mongoengine import Document, StringField, IntField


class User(Document):
    # ID - nine digits
    user_id = IntField(required=True, unique=True, min_value=100000000, max_value=999999999)
    first_name = StringField(required=True)
    last_name = StringField(required=True)
    email_address = StringField(required=True, unique=True)
    password = StringField(required=True)
    user_type = StringField(required=True)