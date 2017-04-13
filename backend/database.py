import os
import json
import urllib
import csv
from http_code import *


class Database(object):
    """docstring for Database"""

    def __init__(self, storage_root, config_root):
        self.storage_root = storage_root
        self.config_root = config_root
        self._data_list = {}

        for dataset_id in os.listdir(self.storage_root):

            self._data_list[dataset_id] = []

            try:
                f = open(os.path.join(self.storage_root,
                                      dataset_id, 'list.csv'), 'r')
                for data in csv.reader(f):

                    self._data_list[dataset_id].append(
                        {'id': data[0], 'file_name': data[1]})
                f.close()
            except Exception, e:
                if dataset_id in self._data_list:
                    del self._data_list[dataset_id]

    def get_config(self, config_name):

        try:
            with open(os.path.join(self.config_root, config_name + '.json')) as f:
                config = json.load(f)

            return config, STATUS_OK
        except Exception, e:

            return None, STATUS_NOT_FOUND

    """
    ========================================
        Datasets Operations: 
            GET:
    ========================================
    """

    def get_datasets(self):

        return self._data_list.keys(), STATUS_OK

    """
    ========================================
        Dataset Operations: 
            GET:
            PUT:
            DELETE:
    ========================================
    """

    def get_dataset(self, dataset_id):

        if dataset_id in self._data_list:
            return self._data_list[dataset_id], STATUS_OK
        else:
            return None, STATUS_NOT_FOUND

    def put_dataset(self, dataset_id):

        directory = os.path.join(self.storage_root, dataset_id)
        if not os.path.exists(directory):
            os.makedirs(directory)

        return STATUS_OK

    def delete_dataset(self, dataset_id):

        directory = os.path.join(self.storage_root, dataset_id)
        try:
            if os.path.exists(directory):
                os.rmdir(directory)
            return STATUS_OK
        except Exception, e:
            return STATUS_NOT_FOUND

    """
    ========================================
        Data(Image) Operations: 
            GET:
            PUT:
            DELETE:
    ========================================
    """

    def get_image(self, dataset_id, data_id):
        """Get data-image"""

        file_name = self._fname(dataset_id, data_id, 'image')

        if os.path.isfile(file_name):
            return file_name, STATUS_OK
        else:
            return None, STATUS_NOT_FOUND

    def put_image_by_file(self, dataset_id, data_id, image_file):
        """Put data-image by file"""

        if image_file:
            file_dir = self._dir(dataset_id, data_id, 'image')
            file_name = self._fname(dataset_id, data_id, 'image')

            # If directory not exist, create it
            if not os.path.exists(file_dir):
                os.makedirs(file_dir)

            # Remove old image
            if os.path.isfile(file_name):
                os.remove(file_name)

            # Store new image
            image_file.save(file_name)

            return STATUS_OK
        else:
            return STATUS_BAD_REQUEST

    def put_image_by_url(self, dataset_id, data_id, image_url):
        """Put data-image by url"""

        try:
            file_dir = self._dir(dataset_id, data_id, 'image')
            file_name = self._fname(dataset_id, data_id, 'image')

            # If directory not exist, create it
            if not os.path.exists(file_dir):
                os.makedirs(file_dir)

            # Remove old image
            if os.path.isfile(file_name):
                os.remove(file_name)

            urllib.urlretrieve(image_url, file_name)

            return STATUS_OK
        except Exception, e:
            return STATUS_BAD_REQUEST

    def delete_image(self, dataset_id, data_id):
        """Delete data-image"""

        file_name = self._fname(dataset_id, data_id, 'image')

        # Delete data
        if os.path.isfile(file_name):
            os.remove(file_name)

        return STATUS_OK

    """
    ========================================
        Data(Meta) Operations: 
            GET:
            PUT:
            DELETE:
    ========================================
    """

    def get_meta(self, dataset_id, data_id):
        """Get data-meta"""

        file_name = self._fname(dataset_id, data_id, 'meta')

        if os.path.isfile(file_name):

            # Load data
            with open(file_name, 'r') as json_file:
                data = json.load(json_file)

            return data, STATUS_OK

        else:
            return None, STATUS_NOT_FOUND

    def put_meta(self, dataset_id, data_id, new_data):
        """Put data-meta"""

        file_name = self._fname(dataset_id, data_id, 'meta')

        if os.path.isfile(file_name):

            # Load old data
            with open(file_name, 'r') as json_file:
                old_data = json.load(json_file)

            # Compare the diff of new and old data
            diff = self._diff_meta(new_data, old_data)

            # Store new data
            with open(file_name, 'w') as json_file:
                json.dump(new_data, json_file)

            return diff, STATUS_OK

        else:
            file_dir = self._dir(dataset_id, data_id, 'meta')

            # If directory not exist, create it
            if not os.path.exists(file_dir):
                os.makedirs(file_dir)

            # Store new data
            with open(file_name, 'w') as json_file:
                json.dump(new_data, json_file)

            return None, STATUS_OK

    def delete_meta(self, dataset_id, data_id):
        """Delete data-meta"""
        file_name = self._fname(dataset_id, data_id, 'meta')

        # Delete data
        if os.path.isfile(file_name):
            os.remove(file_name)

        return STATUS_OK

    """
    ========================================
        Functions
            
    ========================================
    """

    def _diff_meta(self, new_data, old_data):
        """Calculate the diffetence of new and old data"""
        return None

    def _fname(self, dataset_id, data_id, data_type, extension=''):
        data_id = int(data_id)
        if data_type == 'meta':
            return os.path.join(self.storage_root, dataset_id, data_type, '{}.json'.format(self._data_list[dataset_id][data_id]['file_name']))
        elif data_type == 'image':
            return os.path.join(self.storage_root, dataset_id, data_type, '{}.jpg'.format(self._data_list[dataset_id][data_id]['file_name']))
        else:
            return os.path.join(self.storage_root, dataset_id, data_type, '{}.{}'.format(self._data_list[dataset_id][data_id]['file_name'], extension))

    def _dir(self, dataset_id, data_id, data_type):
        return os.path.join(self.storage_root, dataset_id, data_type)
