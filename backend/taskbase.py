import os
import json
import urllib
import csv
from http_code import *


class Taskbase(object):
    """docstring for Job"""

    def __init__(self, database, task_size=1000):
        self.database = database
        self.__task_size = task_size

    """
    ========================================
        Job Operations:
            GET:
    ========================================
    """

    def get_job(self, dataset_id):
        dataset, __ = self.database.get_dataset(dataset_id)
        subsets = [str(idx) for idx, start in enumerate(
            xrange(0, len(dataset), self.__task_size))]

        return subsets, STATUS_OK

    def get_job_stat(self, dataset_id):
        dataset, __ = self.database.get_dataset(dataset_id)
        stat = {
            'summary': {'checked': 0, 'new': 0, 'to_check': 0, 'garbage': 0, 'labeled': 0},
            'tasks':{}
        }
        subsets = [dataset[i:i + self.__task_size]
                       for i in xrange(0, len(dataset), self.__task_size)]


        for task_id in range(0, len(subsets)):
            print task_id
            count = {'checked': 0, 'new': 0, 'to_check': 0, 'garbage': 0, 'labeled': 0}
            for item in subsets[int(task_id)]:
                data, status = self.database.get_meta(dataset_id, item['id'])
                if (status == STATUS_OK) and ('status' in data):
                    count[data['status']] += 1
                    stat['summary'][data['status']] += 1
                else:
                    count['new'] += 1
                    stat['summary']['new'] += 1
            stat['tasks'][task_id] = count.copy()

        return stat, STATUS_OK

    """
    ========================================
        Task Operations:
            GET:
    ========================================
    """

    def get_task(self, dataset_id, task_id):
        dataset, __ = self.database.get_dataset(dataset_id)

        if task_id.startswith('M'):
            count = {'checked': 0, 'new': 0, 'to_check': 0, 'garbage': 0, 'labeled': 0}
            with open(os.path.join(self.database.storage_root, dataset_id, 'predefined_tasks', task_id + '.csv')) as csvfile:
                spamreader = csv.reader(csvfile)
                task_list = []
                for row in spamreader:
                    data, status = self.database.get_meta(dataset_id, row[0])

                    if (status == STATUS_OK) and ('status' in data):
                        count[data['status']] += 1
                        t = {
                            'id': row[0],
                            'status': data['status']
                        }
                    else:
                        count['new'] += 1
                        t = {
                            'id': row[0],
                            'status': 'new'
                        }
                    task_list.append(t)

            task = {
                'dataset': dataset_id,
                'summary': count,
                'task_id': task_id,
                'list': task_list
            }

            return task, STATUS_OK

        else:
            count = {'checked': 0, 'new': 0, 'to_check': 0, 'garbage': 0, 'labeled': 0}
            subsets = [dataset[i:i + self.__task_size]
                       for i in xrange(0, len(dataset), self.__task_size)]
            task_list = []
            for item in subsets[int(task_id)]:
                data, status = self.database.get_meta(dataset_id, item['id'])
                if (status == STATUS_OK) and ('status' in data):
                    count[data['status']] += 1
                    t = {
                        'id': item['id'],
                        'status': data['status']
                    }
                else:
                    count['new'] += 1
                    t = {
                        'id': item['id'],
                        'status': 'new'
                    }

                task_list.append(t)

            task = {
                'dataset': dataset_id,
                'summary': count,
                'task_id': task_id,
                'list': task_list
            }

            return task, STATUS_OK
