from models.report import Report
from mongoengine import connect

connect('opc_integrity')

r = Report()
r.title = "AA"
r.kind = "Integrity Status"
r.reporters_ids = [111111111]
r.build_id = 101
r.content = "dskfhsidfuhaidsada"
r.save()

r = Report()
r.title = "BB"
r.kind = "Build Run Summary"
r.reporters_ids = [222222222]
r.build_id = 100
r.content = "zzzzzzzzzzzzzz"
r.save()



