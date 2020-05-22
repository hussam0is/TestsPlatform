from src.models.build import Build
from mongoengine import connect
import datetime
connect('opc_integrity')

Build(build_name="1", group=3, status="Running", build_tests={"1": "Stopped", "2": "Passed", "3": "Failed"}, reporters_ids=[111111111, 211111111]).save()
#Build(build_name="2", group=3, status="Running", build_tests={"1": "Passed", "2": "Failed"}, reporters_ids=[111111111, 211111111]).save()
# Build(build_name="3", group=3, status="Running").save()
# Build(build_name="4", group=3, status="Running").save()
# Build(build_name="5", group=3, status="Running").save()
# Build(build_name="6", group=3, status="Running").save()
# Build(build_name="7", group=4, status="Stopped").save()
# Build(build_name="8", group=3, status="Running").save()
# Build(build_name="9", group=3, status="Running").save()
# Build(build_name="10", group=3, status="Running").save()
# Build(build_name="11", group=3, status="Running").save()
# Build(build_name="12", group=3, status="Running").save()
# Build(build_name="13", group=3, status="Running").save()
# Build(build_name="14", group=3, status="Running").save()



