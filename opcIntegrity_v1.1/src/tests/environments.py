from src.models.environment import Environment
from mongoengine import connect

connect('opc_integrity')

Environment(environment_name="Trunk").save()
Environment(environment_name="Client").save()
Environment(environment_name="Trial").save()




