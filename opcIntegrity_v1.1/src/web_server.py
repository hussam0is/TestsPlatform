
import routes
from flask import Flask
from db import initialize_db
WEB_SERVER_LISTENING_IP = "0.0.0.0"


class WebServer:

    def __init__(self):
        self.app = None

        # Create the Flask App
        self.create_app()

    def create_app(self):
        """
            Create and configure the app
        """
        self.app = Flask(__name__, instance_relative_config=True)

        # Init the secret key of the app -it is a must for flask to run
        self.app.config.from_mapping(
            SECRET_KEY='!ZNeverSayNever116Z!',
            MONGODB_SETTINGS= {'host': 'mongodb://localhost/opc_integrity'}
        )
        initialize_db(self.app)


        # Init the app with core routes
        routes.init_app(self.app)

    def run(self):
        # Threaded True seems to be default only on windows
        self.app.run(host=WEB_SERVER_LISTENING_IP, threaded=True)

    @classmethod
    def start_web_server(cls):
        web_server = WebServer()
        web_server.run()

