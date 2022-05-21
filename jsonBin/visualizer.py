import pandas as pd
import numpy as np
import json
import matplotlib.pyplot as plt
import seaborn as sns
from io import StringIO
import csv
from csv import reader
# %matplotlib inline
import pprint


# json_results_path = './jsonBin/results.json'


# Extract the record entries from json files

json_dict_records = {}
json_dict_metadata = {}

f = open('../jsonBin/Results.json', 'r')
json_data = json.load(f)

for key in range(len(json_data)):
    json_dict_records[key] = (json_data[key]['record'])
    json_dict_metadata[key] = (json_data[key]['metadata'])
# # Generate a csv file from json results from
# print(json_dict_records)
# exel_file = pd.DataFrame((json_dict_records)).to_excel('Results.xlsx')


csv_file = pd.read_csv('Results.csv')
# print(csv_file)


def create_participant_list(list: dict):
    participant_list = {}
    for i in list:
        # print(list[i]['id'])
        participant_list[list[i]['id']] = {}
        participant_list[list[i]['id']]['uuid'] = json_dict_records[i]['n_firstLetterNameMother']+json_dict_records[i]['n_firstLetterNameFather']+json_dict_records[i]['n_firstLetterBirthplace'] + \
            json_dict_records[i]['n_lastDigitBirthYear'] + \
            json_dict_records[i]['n_lastDigitBirthDay']

        # participant_list[list[i]['id']
        #                  ]['n_firstLetterNameMother'] = json_dict_records[i]['n_firstLetterNameMother']
        # participant_list[list[i]['id']
        #                  ]['n_firstLetterNameFather'] = json_dict_records[i]['n_firstLetterNameFather']
        # participant_list[list[i]['id']
        #                  ]['n_firstLetterBirthplace'] = json_dict_records[i]['n_firstLetterBirthplace']
        # participant_list[list[i]['id']
        #                  ]['n_lastDigitBirthYear'] = json_dict_records[i]['n_lastDigitBirthYear']
        # participant_list[list[i]['id']
        #                  ]['n_lastDigitBirthDay'] = json_dict_records[i]['n_lastDigitBirthDay']

    return participant_list


participant_uuid = create_participant_list(json_dict_metadata)

# Check for duplicate values


def find_multi_participant(l_participent: dict):
    d = {}
    result = ''
    multi_participation_participantId = []

    for i in l_participent:
        print(l_participent[i]['uuid'])
        if(len(l_participent[i]['uuid'])) == len(set(l_participent[i]['uuid'])):
            result = ("no duplicates")
        else:
            result = ("includes duplicates")

    return result


includes_duplicate = find_multi_participant(participant_uuid)
print(includes_duplicate)
# writer = pd.ExcelWriter('Results.xlsx', engine='xlsxwriter')
# json_dict.to_excel(writer, sheetname='Results', index=false)
# workbook = writer.book
# worksheet = writer.sheets['Results']
# writer.save()
# with open('Results.csv', 'w') as csv_file:
#     w = csv.DictWriter(csv_file, json_dict.keys())
#     w.writeheader()
#     w.writerow(json_dict)
# csv_file = open('Results.csv', 'w')
# write = csv.writer(csv_file)
# write.writerow(json_data.keys())
# df = pd.read_csv('Bank_Privacy_Dialogue_results_180620.csv')
