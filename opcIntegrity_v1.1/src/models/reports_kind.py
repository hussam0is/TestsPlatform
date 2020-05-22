import datetime
from mongoengine import Document, StringField, SequenceField, IntField, ListField, ObjectIdField, DateTimeField


class ReportsKind(Document):
    kind_id = SequenceField(unique=True)
    kind_name = StringField(required=True)
    # all_admins, all_users, build_runner
    default_reporters = ListField(StringField(), default=list)
    title = StringField(max_length=50)
    send_every_days = IntField()
    last_report_date = DateTimeField(default=datetime.datetime.utcnow)
