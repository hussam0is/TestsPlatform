import datetime
from mongoengine import Document, StringField, IntField, ListField, DictField, DateTimeField, SequenceField


class Build(Document):
    build_id = SequenceField(unique=True)
    build_name = StringField()
    group = IntField()
    jenkins_job_number = IntField()
    status = StringField()
    result = StringField()
    running_environment = StringField()
    start_time = DateTimeField(default=datetime.datetime.utcnow)
    run_duration = StringField()
    reporters_ids = ListField(IntField(), default=list)
    zoho_issue_link = StringField()
    build_tests = DictField(default=dict)

