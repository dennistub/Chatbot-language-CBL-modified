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
from statsmodels.stats.power import TTestIndPower
from scipy.stats import ttest_ind
import pingouin as pg

# json_results_path = './jsonBin/results.json'


# # Extract the record entries from json files

# json_dict_records = {}
# json_dict_metadata = {}

# f = open('../jsonBin/Results.json', 'r')
# json_data = json.load(f)

# for key in range(len(json_data)):
#     json_dict_records[key] = (json_data[key]['record'])
#     json_dict_metadata[key] = (json_data[key]['metadata'])
# # # Generate a csv file from json results from
# print(json_dict_records)
# exel_file = pd.DataFrame((json_dict_records)).to_excel('New_Results.xlsx')


# #csv_file = pd.read_csv('Results.csv')
# # print(csv_file)


# def create_participant_list(list: dict):
#     participant_list = {}
#     for i in list:
#         # print(list[i]['id'])
#         participant_list[list[i]['id']] = {}
#         participant_list[list[i]['id']]['uuid'] = json_dict_records[i]['n_firstLetterNameMother']+json_dict_records[i]['n_firstLetterNameFather']+json_dict_records[i]['n_firstLetterBirthplace'] + \
#             json_dict_records[i]['n_lastDigitBirthYear'] + \
#             json_dict_records[i]['n_lastDigitBirthDay']

#         # participant_list[list[i]['id']
#         #                  ]['n_firstLetterNameMother'] = json_dict_records[i]['n_firstLetterNameMother']
#         # participant_list[list[i]['id']
#         #                  ]['n_firstLetterNameFather'] = json_dict_records[i]['n_firstLetterNameFather']
#         # participant_list[list[i]['id']
#         #                  ]['n_firstLetterBirthplace'] = json_dict_records[i]['n_firstLetterBirthplace']
#         # participant_list[list[i]['id']
#         #                  ]['n_lastDigitBirthYear'] = json_dict_records[i]['n_lastDigitBirthYear']
#         # participant_list[list[i]['id']
#         #                  ]['n_lastDigitBirthDay'] = json_dict_records[i]['n_lastDigitBirthDay']

#     return participant_list


# participant_uuid = create_participant_list(json_dict_metadata)

# # Check for duplicate values


# def find_multi_participant(l_participent: dict):
#     d = {}
#     result = ''
#     multi_participation_participantId = []

#     for i in l_participent:
#         print(l_participent[i]['uuid'])
#         if(len(l_participent[i]['uuid'])) == len(set(l_participent[i]['uuid'])):
#             result = ("no duplicates")
#         else:
#             result = ("includes duplicates")

#     return result


# includes_duplicate = find_multi_participant(participant_uuid)
# print(includes_duplicate)

# create variables for all Questions
df = pd.read_excel('Results_Mit_Condition_Und_Response.xlsx')
df_new = pd.read_excel('New_Results.xlsx')
df_combined = pd.concat([df_new, df], ignore_index=True)
print(len(df_combined))

q_total = ['q_PRIV1', 'q_PRIV2', 'q_PRIV3', 'q_PRIV4', 'q_PRIV5', 'q_PRIV6', 'q_TRUST1', 'q_TRUST2', 'q_TRUST3', 'q_TRUST4',
           'q_TRUST5', 'q_IUIPC1', 'q_IUIPC2', 'q_IUIPC3', 'q_IUIPC4', 'q_IUIPC5', 'q_IUIPC6', 'q_IUIPC7', 'q_COMMIT1', 'q_COMMIT2', 'q_COMMIT3']
df_combined['q_total'] = df_combined[q_total].mean(axis=1)

q_privacy = ['q_PRIV1', 'q_PRIV2', 'q_PRIV3', 'q_PRIV4', 'q_PRIV5', 'q_PRIV6']
df_combined['q_privacy'] = df_combined[q_privacy].mean(axis=1)

q_trust = ['q_TRUST1', 'q_TRUST2', 'q_TRUST3', 'q_TRUST4', 'q_TRUST5']
df_combined['q_trust'] = df_combined[q_trust].mean(axis=1)

q_iuipc = ['q_IUIPC1', 'q_IUIPC2', 'q_IUIPC3',
           'q_IUIPC4', 'q_IUIPC5', 'q_IUIPC6', 'q_IUIPC7']
df_combined['q_iuipc'] = df_combined[q_iuipc].mean(axis=1)

q_commitment = ['q_COMMIT1', 'q_COMMIT2', 'q_COMMIT3']
df_combined['q_commitment'] = df_combined[q_commitment].mean(axis=1)


# # number of responses
df_combined = df_combined[df_combined['response_yn'] != 'yes|no']
len(df_combined)

# data cleaning
df_combined = df_combined[df_combined['response_yn'] != 'yes|yes']
len(df_combined)

# number of privacy conditions
len(df_combined[df_combined['condition'] == 'privacy_priming'])

# number of errors
df_combined['number_of_errors'] = df_combined['transcript'].apply(
    lambda string: string.count('Sorry'))


# # Analysis

df_combined_124 = df_combined[(df_combined['condition'] == "control") | (
    df_combined['condition'] == "privacy_priming")]

df_combined_124['condition'].head()


fig, axes = plt.subplots(2, 2, figsize=(20, 20))

sns.boxplot(x='condition', y='q_total', data=df_combined,
            ax=axes[0, 0], order=["control", "privacy_priming"])
axes[0, 0].axhline(np.mean(df_combined[df_combined['condition'] == 'control']
                   ['q_total']), ls='--', color='red')
axes[0, 0].set(xlabel='Conditions', ylabel='Average across all scales')

sns.boxplot(x='condition', y='q_trust', data=df_combined,
            ax=axes[0, 1], order=["control", "privacy_priming"])
axes[0, 1].axhline(np.mean(df_combined[df_combined['condition'] == 'control']
                   ['q_trust']), ls='--', color='red')
axes[0, 1].set(xlabel='Conditions', ylabel='Trust in chatbot')
sns.boxplot(x='condition', y='q_privacy', data=df_combined,
            ax=axes[1, 0], order=["control", "privacy_priming"])
axes[1, 0].axhline(np.mean(df_combined[df_combined['condition'] == 'control']
                   ['q_privacy']), ls='--', color='red')
axes[1, 0].set(xlabel='Conditions', ylabel='Privacy perception of chatbot')

sns.boxplot(x='condition', y='q_iuipc', data=df_combined,
            ax=axes[1, 1], order=["control", "privacy_priming"])
axes[1, 1].axhline(np.mean(df_combined[df_combined['condition'] == 'control']
                   ['q_iuipc']), ls='--', color='red')
axes[1, 1].set(xlabel='Conditions', ylabel='Trust measured by IUIPC scale')


sns.boxplot(x='condition', y='q_commitment', data=df_combined,
            ax=axes[1, 1], order=["control", "privacy_priming"])
axes[1, 1].axhline(np.mean(df_combined[df_combined['condition'] == 'control']
                   ['q_commitment']), ls='--', color='red')
axes[1, 1].set(xlabel='Conditions', ylabel='Commitment for chatbot')

# plt.show()


# Do privacy messages affect user choices?

percentages = []
conditions = ["control", "privacy_priming"]

for c in conditions:
    percentages.append((len(df_combined[(df_combined['condition'] == c) & (df_combined['response_yn'] == "yes")])/len(df_combined[(df_combined['condition'] == c)]),
                       len(df_combined[(df_combined['condition'] == c) & (df_combined['response_yn'] == "no")])/len(df_combined[(df_combined['condition'] == c)])))

df_percentages = pd.DataFrame(
    percentages, index=conditions, columns=['Yes', 'No'])
# print(df_percentages)

yes = df_percentages['Yes']
no = df_percentages['No']

x = np.arange(len(conditions))  # the label locations
width = 0.35  # the width of the bars

fig, ax = plt.subplots(figsize=(10, 8))
rects1 = ax.bar(x + width/2, no, width, label='No')
rects2 = ax.bar(x - width/2, yes, width, label='Yes')

# Add some text for labels, title and custom x-axis tick labels, etc.
ax.set_ylabel('Percentage')
ax.set_title('Percentage of chosing "Yes" or "No"')
ax.set_xticks(x)
ax.set_xticklabels(conditions)
ax.legend()

# T-Test

ttst_avg = ttest_ind(df_combined[df_combined['condition'] == 'privacy_priming']
                     ['q_total'], df_combined[df_combined['condition'] == 'control']['q_total'])


ttst_priv_perception = ttest_ind(df_combined[df_combined['condition'] == 'privacy_priming']
                                 ['q_privacy'], df_combined[df_combined['condition'] == 'control']['q_privacy'])


ttst_trust = ttest_ind(df_combined[df_combined['condition'] == 'privacy_priming']
                       ['q_trust'], df_combined[df_combined['condition'] == 'control']['q_trust'])

ttst_iuipc = ttest_ind(df_combined[df_combined['condition'] == 'privacy_priming']
                       ['q_iuipc'], df_combined[df_combined['condition'] == 'control']['q_iuipc'])

print("Test auf Normalverteilung für Privacy Condition", ttst_avg)
print("Test auf Normalverteilung für Privacy Perception", ttst_priv_perception)
print("Test auf Normalverteilung für Trust", ttst_priv_perception)
print("Test auf Normalverteilung für Trust nach IUIPC", ttst_iuipc)


df_delete = df_combined[(df_combined['condition'] == 'privacy_priming') | (
    df['condition'] == 'control')]
df_combined_info = df_combined[(df_combined['condition'] == 'control')]

plt.figure(figsize=(10, 10))

sns.boxplot(x='condition', y='q_privacy', data=df_delete)
plt.title('Trust for data deletion in control and privacy condition')

ttst_data_deletion = ttest_ind(df_delete[df_delete['condition'] == 'control']['q_privacy'],
                               df_delete[df_delete['condition'] == 'privacy_priming']['q_privacy'])

print("Test auf Normalverteilung für Privacy Conditions", ttst_data_deletion)


#  Power Analysis for Privacy Perceptions


effect_size = pg.compute_effsize(df_combined[df_combined['condition'] == 'privacy_priming']
                                 ['q_privacy'], df_combined[df_combined['condition'] == 'control']['q_privacy'], eftype='cohen')
alpha = 0.05  # significance level
power = 0.8

power_analysis = TTestIndPower()
sample_size = power_analysis.solve_power(effect_size=effect_size,
                                         power=power,
                                         alpha=alpha)

print('Required sample size: {0:.2f}'.format(sample_size))


# plt.show()

#ttest_ind(df[df['condition']=='data_priming']['q_total'], df[df['condition']=='control']['q_total'])
# [Text(0, 0.5, 'Commitment for chatbot'), Text(0.5, 0, 'Conditions')]
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
# df_combined = pd.read_csv('Bank_Privacy_Dialogue_results_180620.csv')
