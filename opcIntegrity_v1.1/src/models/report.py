import datetime
from mongoengine import Document, StringField, ObjectIdField, DateTimeField, ListField, IntField, SequenceField


class Report(Document):
    report_id = SequenceField(unique=True)
    # build_id - if exists
    build_id = IntField()
    date = DateTimeField(default=datetime.datetime.utcnow)
    reporters_ids = ListField(IntField(), default=list)
    title = StringField()
    content = StringField()
    kind = StringField()
