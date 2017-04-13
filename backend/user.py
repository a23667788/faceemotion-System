from unqlite import UnQLite
from datetime import datetime
from http_code import *

class User(object):

    def __init__(self, db_path):
        self.db = UnQLite(db_path)

    def create_user(self, account, password, name):

        self.db[account] = {
            'password': self.encrypt(password),
            'name': name,
            'logs': []
        }

    def list_users(self):

        user_list = []

        for key, value in self.db:
            user_list.append({
                'account': key,
                'name': value['name']}
            )

        return user_list

    def encrypt(self, password):
        return password

    def login(self, account, password):

        if password == self.db[account]['password']:
            return True
        else:
            return False

    def add_log(self, account, log):
        
        self.db[account]['logs'].append({
            'datetime': datetime.strftime(datetime.now(), '%Y:%m:%d:%H:%M:%S:%f'),
            'log': log
        })
