from src.models.test import Test
from mongoengine import connect

connect('opc_integrity')

t = Test()
t.test_title = "AAA"
t.test_case = "#ACL1"
t.category = "Uni-test"
t.group = 3
t.save()

t = Test()
t.test_title = "AAB"
t.test_case = "#ACL1"
t.category = "Uni-test"
t.group = 4
t.save()


t = Test()
t.test_title = "AAC"
t.test_case = "#ACL1"
t.category = "Uni-test"
t.group = 3
t.save()




