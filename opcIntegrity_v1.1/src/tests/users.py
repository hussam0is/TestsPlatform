from src.models.user import User
from mongoengine import connect

connect('opc_integrity')

# Add user
User(user_id=111111111,first_name='Ross1', last_name='Lawley', email_address="aa@gmail.com", password="121212", user_type="admin").save()
User(user_id=211111111,first_name='Ross2', last_name='Lawley', email_address="ab@gmail.com", password="121212", user_type="admin").save()
User(user_id=311111111,first_name='Ross3', last_name='Lawley', email_address="ac@gmail.com", password="121212", user_type="admin").save()


# Get data
for user in User.objects:
    print(user.first_name)

# Query
for user in User.objects(first_name='Ross'):
    print(user.first_name)

# Get First
first_user = User.objects().first()
print(first_user.last_name)

# Count
users_count = User.objects().count()
print(users_count)