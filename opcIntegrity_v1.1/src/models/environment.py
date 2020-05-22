from mongoengine import Document, StringField, SequenceField


class Environment(Document):
    environment_id = SequenceField()
    environment_name = StringField(unique=True)

