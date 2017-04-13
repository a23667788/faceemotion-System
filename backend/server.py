#!/usr/bin/env python
import json
import os
import random
from flask import Flask, send_file, request, jsonify
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
from deepdiff import DeepDiff
from datetime import datetime
# from unqlite import UnQLite
import ast
import copy
import argparse

from user import User
from database import Database
from taskbase import Taskbase

# tmp
from voting_database import VotingDatabase

from http_code import *


# Setup API
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)


class ApiUsers(Resource):
    """docstring for User"""

    def __init__(self):
        pass


class ApiUsersLogin(Resource):
    """docstring for UserLogin"""

    def __init__(self):
        pass


class ApiJobs(Resource):
    """docstring for DatasetSubset"""

    def get(self):
        """Load job list"""

        status = STATUS_OK
        return None, status

    # def post(self):
    #     """Create new job"""

    #     req = request.get_json()
    #     return None, status


class ApiJob(Resource):
    """docstring for Subset"""

    def get(self, dataset_id):
        """Load job"""

        job, status = taskbase.get_job(dataset_id)

        return job, status


class ApiJobStat(Resource):
    """docstring for Subset"""

    def get(self, dataset_id):
        """Load job"""

        stat, status = taskbase.get_job_stat(dataset_id)

        return stat, status


class ApiTask(Resource):
    """docstring for Subset"""

    def get(self, dataset_id, task_id):
        """Load job"""

        task, status = taskbase.get_task(dataset_id, task_id)

        return task, status


class ApiDatasets(Resource):
    """docstring for Meta"""

    def get(self):
        """Load list of datasets"""

        datasets, status = database.get_datasets()

        return datasets, status

    # def post(self):
    #     """Create new dataset"""

    #     req = request.get_json()
    #     return None, status


class ApiDataset(Resource):
    """docstring for Meta"""

    def get(self, dataset_id):
        """Load this dataset"""

        dataset, status = database.get_dataset(dataset_id)

        return dataset, status

    def put(self, dataset_id):
        """Update/Replace this dataset"""

        req = request.get_json()
        status = database.put_dataset(dataset_id)

        return None, status

    def delete(self, dataset_id):
        """Delete this dataset"""

        req = request.get_json()
        status = database.delete_dataset(dataset_id)

        return None, status

    # def post(self, dataset_id):
    #     """Create new data in this dataset"""

    #     req = request.get_json()
    #     return None, status


class ApiImage(Resource):
    """docstring for Image"""

    def get(self, dataset_id, data_id):
        """Load data-image"""

        file_name, status = database.get_image(dataset_id, data_id)

        if status == STATUS_OK:
            return send_file(file_name, mimetype='image/jpg')
        else:
            return None, status

    def put(self, dataset_id, data_id):
        """Update/Replace data-image"""

        if request.headers['Content-Type'].split(';')[0] == "multipart/form-data":
            image = request.files['image_file']
            status = database.put_image_by_file(dataset_id, data_id, image)
        else:
            data = request.get_json()
            status = database.put_image_by_url(
                dataset_id, data_id, data['image_url'])

        return None, status

    def delete(self, dataset_id, data_id):
        """Delete data-image"""

        status = database.delete_image(dataset_id, data_id)

        return None, status


class ApiMeta(Resource):
    """docstring for Meta"""

    def get(self, dataset_id, data_id):
        """Load data-meta"""

        data, status = database.get_meta(dataset_id, data_id)

        return data, status

    def put(self, dataset_id, data_id):
        """Update/Replace data-meta"""

        data = request.get_json()

        diff, status = database.put_meta(dataset_id, data_id, data)

        return data, status

    def delete(self, dataset_id, data_id):
        """Delete data-meta"""

        status = database.delete_meta(dataset_id, data_id)

        return None, status


class ApiConfig(Resource):
    """docstring for Meta"""

    def get(self, config_name):
        """Load config"""

        data, status = database.get_config(config_name)

        return data, status


class ApiVotingUser(Resource):

    def post(self):

        # Get input argument
        arg_data = request.get_json()
        return voting_database.check_user(arg_data)


class ApiVotingImage(Resource):

    def get(self, data_id):
        ret, flag = voting_database.get_image(data_id)
        if (flag):
            return send_file(ret, mimetype='image/jpg')
        else:
            return str(ret), 404


class ApiVotingMeta(Resource):

    # Return the data
    def get(self, data_id):
        return voting_database.get_meta(data_id)

    # Store the data
    def post(self, data_id):
        req_data = request.get_json()
        return voting_database.post_meta(data_id, req_data)


class ApiVoting(Resource):

    def post(self):
        arg_data = request.get_json()
        return voting_database.flow(arg_data)


# User API route
api.add_resource(ApiUsers, '/users')
api.add_resource(ApiUsersLogin, '/users/login')

# Job API route
api.add_resource(ApiJobs, '/jobs/')
api.add_resource(ApiJob, '/jobs/<dataset_id>')
api.add_resource(ApiJobStat, '/jobs_stat/<dataset_id>/stat')
api.add_resource(ApiTask, '/jobs/<dataset_id>/<task_id>')

# Dataset API route
api.add_resource(ApiDatasets, '/datasets')
api.add_resource(ApiDataset, '/datasets/<dataset_id>')
api.add_resource(ApiImage, '/datasets/<dataset_id>/<data_id>/image')
api.add_resource(ApiMeta, '/datasets/<dataset_id>/<data_id>/meta')

api.add_resource(ApiConfig, '/configs/<config_name>')

# Voting Backend tmp
api.add_resource(ApiVoting, '/voting/emotion')
api.add_resource(ApiVotingUser, '/voting/user')
api.add_resource(ApiVotingImage, '/voting/emotion/<data_id>/image')
api.add_resource(ApiVotingMeta, '/voting/emotion/<data_id>/meta')


if __name__ == '__main__':

    database = Database('/etc/database/data', '/etc/database/config')
    taskbase = Taskbase(database)
    voting_database = VotingDatabase(db_url='172.17.0.2', db_port=27017, 
         img_path='/etc/database/data/emotion/image', db_name='voting', collection_name='emotion',
         user_list='/etc/database/data/emotion/job_vote.txt')

    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('-db', dest='db_root')
    parser.add_argument('-user', dest='user_list')
    args = parser.parse_args()

    try:
        app.run(host='0.0.0.0', port=8079, threaded=True)
    except Exception, e:
        print e
