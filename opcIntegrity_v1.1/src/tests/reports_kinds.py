from src.models.reports_kind import ReportsKind
from mongoengine import connect

connect('opc_integrity')

rk = ReportsKind()
rk.kind_name = "Integrity Status"
rk.title = "Integrity status"
rk.default_reporters = ["all_admins"]
rk.send_every_days = 14
rk.save()

rk = ReportsKind()
rk.kind_name = "Build Run Summary"
rk.title = "Build ID # - Run Summary"
rk.default_reporters = ["all_users", "build_runner"]
rk.send_every_days = 0
rk.save()
