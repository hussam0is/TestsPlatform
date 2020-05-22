from .test import TestAPI
from .user import UserAPI
from .build import BuildAPI
from flask_restful import Api
from .report import ReportAPI
from .connect import ConnectAPI
from .test import TestHistoryAPI

from .environment import EnvironmentAPI
from .reports_kind import ReportsKindAPI



def init_app(app):
    # Create restful api object
    api = Api(app)

    api.add_resource(ConnectAPI, '/connect')

    api.add_resource(EnvironmentAPI, '/environment')

    api.add_resource(BuildAPI, '/build', '/build/<string:build_id>')

    api.add_resource(UserAPI, '/user', '/user/<string:user_id>')

    api.add_resource(ReportsKindAPI, '/reports_kind', '/reports_kind/<string:kind_name>')

    api.add_resource(TestAPI, '/test', '/test/<string:test_id>')

    api.add_resource(TestHistoryAPI, '/test_history/<string:test_id>')

    api.add_resource(ReportAPI, '/report', '/report/<string:report_id>')





