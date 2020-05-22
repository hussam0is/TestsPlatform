from mongoengine import Document, StringField, DateTimeField, ImageField, SequenceField, IntField


class Test(Document):
    test_id = SequenceField(unique=True)
    category = StringField(required=True)
    test_case = StringField(required=True)
    test_title = StringField(required=True)
    group = IntField(required=True)
    # Path to an image file
    symbol = StringField()
    test_summary = StringField()
    test_steps = StringField()
    test_data = DateTimeField()
    expected_result = StringField(required=True)
    notes = StringField()
