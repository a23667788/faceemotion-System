#!/usr/bin/env python
import json
import os
from pymongo import MongoClient

class VotingDatabase():

    def __init__(self, db_url=None, db_port=27017, img_path=None, db_name=None, collection_name=None, user_list=None):
        client = MongoClient(db_url, db_port)
        print client
        self.img_path = img_path
        db = client[db_name]
        self.collection = db[collection_name]
        self.user_list = user_list

    def get_image(self, idx):
        try:
            p = self.collection.find_one({'idx': int(idx)})

            # Find image path
            image_path = os.path.join(self.img_path, p['name'] + '.jpg')

            # Return image
            return image_path, True

        # Return error
        except Exception, e:
            print e
            return e, False
            # return '', 404


    def get_meta(self, idx):
        try:
            p = self.collection.find_one({'idx': int(idx)})
            del p['_id']
            return p, 200
        
        except Exception, e:
            return 'Error', 404
            

    def post_meta(self, idx, req_data):

        
        idx= int(idx)
        self.collection.update_one({'idx':idx},{'$set':{'voting.'+req_data['user_name']:req_data['payload']}})
        p = self.collection.find_one({'idx': idx})
        
        self.collection.update_one({'idx':idx},{'$set':{'count':len(p['voting'])}})

        # Check if key in db
        # if data_key in self.db:
        #     # Get data from db
        #     ret = ast.literal_eval(self.db[data_key])

        # # Update data if labeled
        # if req_data['payload']['status'] == 'label':
        #     # self.status_list[data_key].append(req_data['user_name'])
        #     ret['voting'][req_data['user_name']] = req_data['payload']
        #     self.user_count[req_data['user_name']] += 1

        # elif req_data['payload']['status'] == 'garbage':
        #     self.status_list[data_key].append(req_data['user_name'])
        #     ret['voting'][req_data['user_name']] = req_data['payload']
        #     self.user_count[req_data['user_name']] += 1

        # # Delete data if not labeled
        # else:
        #     self.status_list[data_key].remove(req_data['user_name'])

        #     if req_data['user_name'] in ret['voting']:
        #         del ret['voting'][req_data['user_name']]
        #         self.user_count[req_data['user_name']] -= 1

        # # Store data to db
        # with self.db.transaction():
        #     self.db[data_key] = ret


        return '', 200



    def flow(self, arg_data):  # Get input data


        f = {'voting.'+ arg_data['user_name']:{'$exists': 0},'count':{'$lte': 5}}

        user_done_count = self.collection.find({'voting.'+ arg_data['user_name']:{'$exists': 1}}).count()

        pri_next = self.collection.find_one({"$and": [f, {'prior': {'$exists':True}}]})
        if pri_next:
            return {'id': str(pri_next['idx']), 'name': pri_next['name'], 'count':user_done_count}, 200
        else:
            com_next = self.collection.find_one(f)
            if com_next:
                return {'id': str(com_next['idx']), 'name': com_next['name'], 'count':user_done_count}, 200
            else:
                return "EOF", 404

        

    def check_user(self, arg_data):

        # return '',200
        users = []
        with open(self.user_list) as f:
            lines = f.readlines()
            for line in lines:
                users.append(line.strip())

        # If user exist, return 200
        if (arg_data['user_name'] in users):
            return '', 200

        # Else, return 401
        else:
            return '', 401
