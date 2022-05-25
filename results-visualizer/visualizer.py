from cProfile import label
import pandas as pd
import numpy as np
import json
import matplotlib.pyplot as plt
import seaborn as sns
from io import StringIO
import csv
from csv import reader
# %matplotlib inline
import scipy.stats as stats

import pprint
from statsmodels.stats.power import TTestIndPower
from scipy.stats import ttest_ind
import pingouin as pg
from collections import Counter

json_results_path = './jsonBin/results.json'


# Extract the record entries from json files

# json_dict_records = {}
# json_dict_metadata = {}

# f = open('../jsonBin/results.json', 'r')
# json_data = json.load(f)

# for key in range(len(json_data)):
#     json_dict_records[key] = (json_data[key]['record'])
#     json_dict_metadata[key] = (json_data[key]['metadata'])
# # # Generate a csv file from json results from
# # print(json_dict_records)
# exel_file = pd.DataFrame(json_dict_records).to_excel('complete.xlsx')


# csv_file = pd.read_csv('Results.csv')
# print(csv_file)


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

# Check for duplicate values


# def find_multi_participant(l_participent: dict):
#     d = {}
#     result = ''
#     multi_participation_participantId = []

#     for i in l_participent:
#         # print(l_participent[i]['uuid'])
#         if(len(l_participent[i]['uuid'])) == len(set(l_participent[i]['uuid'])):
#             result = ("no duplicates")
#         else:
#             result = ("includes duplicates")

#     return result


# includes_duplicate = find_multi_participant(participant_uuid)
# print(includes_duplicate)

# create variables for all Questions
df = pd.read_excel('complete.xlsx')
# df_new = pd.read_excel('New_Results.xlsx')
# df = pd.concat([df_new, df], ignore_index=True)
# print(len(df))

q_total = ['q_PRIV1', 'q_PRIV2', 'q_PRIV3', 'q_PRIV4', 'q_PRIV5', 'q_PRIV6', 'q_TRUST1', 'q_TRUST2', 'q_TRUST3', 'q_TRUST4',
           'q_TRUST5', 'q_IUIPC1', 'q_IUIPC2', 'q_IUIPC3', 'q_IUIPC4', 'q_IUIPC5', 'q_IUIPC6', 'q_IUIPC7', 'q_COMMIT1', 'q_COMMIT2', 'q_COMMIT3']
df['q_total'] = df[q_total].mean(axis=1)

q_privacy = ['q_PRIV1', 'q_PRIV2', 'q_PRIV3', 'q_PRIV4', 'q_PRIV5', 'q_PRIV6']
df['q_privacy'] = df[q_privacy].mean(axis=1)

q_trust = ['q_TRUST1', 'q_TRUST2', 'q_TRUST3', 'q_TRUST4', 'q_TRUST5']
df['q_trust'] = df[q_trust].mean(axis=1)

q_iuipc = ['q_IUIPC1', 'q_IUIPC2', 'q_IUIPC3',
           'q_IUIPC4', 'q_IUIPC5', 'q_IUIPC6', 'q_IUIPC7']
df['q_iuipc'] = df[q_iuipc].mean(axis=1)

q_commitment = ['q_COMMIT1', 'q_COMMIT2', 'q_COMMIT3']
df['q_commitment'] = df[q_commitment].mean(axis=1)


# # number of responses
df = df[df['response_yn'] != 'yes|no']
len(df)

# data cleaning
df = df[df['response_yn'] != 'yes|yes']
len(df)

# number of privacy conditions
len(df[df['condition'] == 'privacy_priming'])

# number of errors
# df['number_of_errors'] = df['transcript'].apply(
#     lambda string: string.count('Sorry'))


# # Analysis

df_124 = df[(df['condition'] == "control") | (
    df['condition'] == "privacy_priming")]

df_124['condition'].head()


fig, axes = plt.subplots(3, 2, figsize=(20, 20))

sns.boxplot(x='condition', y='q_total', data=df,
            ax=axes[0, 0], order=["control", "privacy_priming"])
axes[0, 0].axhline(np.mean(df[df['condition'] == 'control']
                   ['q_total']), ls='--', color='red')
axes[0, 0].set(xlabel='Conditions', ylabel='Average across all scales')

sns.boxplot(x='condition', y='q_trust', data=df,
            ax=axes[0, 1], order=["control", "privacy_priming"])
axes[0, 1].axhline(np.mean(df[df['condition'] == 'control']
                   ['q_trust']), ls='--', color='red')
axes[0, 1].set(xlabel='Conditions', ylabel='Trust in chatbot')
sns.boxplot(x='condition', y='q_privacy', data=df,
            ax=axes[1, 0], order=["control", "privacy_priming"])
axes[1, 0].axhline(np.mean(df[df['condition'] == 'control']
                   ['q_privacy']), ls='--', color='red')
axes[1, 0].set(xlabel='Conditions', ylabel='Privacy perception of chatbot')

sns.boxplot(x='condition', y='q_iuipc', data=df,
            ax=axes[1, 1], order=["control", "privacy_priming"])
axes[1, 1].axhline(np.mean(df[df['condition'] == 'control']
                   ['q_iuipc']), ls='--', color='red')
axes[1, 1].set(xlabel='Conditions', ylabel='Privacy concerns (IUIPC)')


sns.boxplot(x='condition', y='q_commitment', data=df,
            ax=axes[2, 1], order=["control", "privacy_priming"])
axes[2, 1].axhline(np.mean(df[df['condition'] == 'control']
                   ['q_commitment']), ls='--', color='red')
axes[2, 1].set(xlabel='Conditions', ylabel='Commitment for chatbot')

# plt.show()


# Do privacy messages affect user choices?

# percentages = []
# conditions = ["control", "privacy_priming"]

# for c in conditions:
#     percentages.append((len(df[(df['condition'] == c) & (df['response_yn'] == "yes")])/len(df[(df['condition'] == c)]),
#                        len(df[(df['condition'] == c) & (df['response_yn'] == "no")])/len(df[(df['condition'] == c)])))

# df_percentages = pd.DataFrame(
#     percentages, index=conditions, columns=['Yes', 'No'])
# print(df_percentages)

# yes = df_percentages['Yes']
# no = df_percentages['No']

# x = np.arange(len(conditions))  # the label locations
# width = 0.35  # the width of the bars

# fig, ax = plt.subplots(figsize=(10, 8))
# rects1 = ax.bar(x + width/2, no, width, label='No')
# rects2 = ax.bar(x - width/2, yes, width, label='Yes')

# # Add some text for labels, title and custom x-axis tick labels, etc.
# ax.set_ylabel('Percentage')
# ax.set_title('Percentage of chosing "Yes" or "No"')
# ax.set_xticks(x)
# ax.set_xticklabels(conditions)
# ax.legend()
# plt.show()
# # # T-Test

ttst_avg = ttest_ind(df[df['condition'] == 'privacy_priming']
                     ['q_total'], df[df['condition'] == 'control']['q_total'])


ttst_priv_perception = ttest_ind(df[df['condition'] == 'privacy_priming']
                                 ['q_privacy'], df[df['condition'] == 'control']['q_privacy'])


ttst_trust = ttest_ind(df[df['condition'] == 'privacy_priming']
                       ['q_trust'], df[df['condition'] == 'control']['q_trust'])

ttst_iuipc = ttest_ind(df[df['condition'] == 'privacy_priming']
                       ['q_iuipc'], df[df['condition'] == 'control']['q_iuipc'])

ttst_commit = ttest_ind(df[df['condition'] == 'privacy_priming']
                        ['q_commitment'], df[df['condition'] == 'control']['q_commitment'])

print("T-Test for avg combined scale", ttst_avg)
print("T-Test for privacy perception", ttst_priv_perception)
print("T-Test for trust", ttst_priv_perception)
print("T-Test for privacy concerns (IUIPC)", ttst_iuipc)
print("T-Test for commitment", ttst_commit)
print("")


# Are privacy perceptions influenced by conversational privacy?

# df_delete = df[(df['condition'] == 'privacy_priming') | (
#     df['condition'] == 'control')]

# plt.figure(figsize=(10, 10))

# sns.boxplot(x='condition', y='Privacy Perceptions', data=df_delete)
# plt.title(
#     'Privacy perception for data deletion without and with conversational privacy')

# ttst_data_deletion = ttest_ind(df_delete[df_delete['condition'] == 'control']['q_privacy'],
#                                df_delete[df_delete['condition'] == 'privacy_priming']['q_privacy'])

# print("T-Test for privacy perception ", ttst_data_deletion)


# #  Power Analysis for Privacy Perceptions


# effect_size = pg.compute_effsize(df[df['condition'] == 'privacy_priming']
#                                  ['q_privacy'], df[df['condition'] == 'control']['q_privacy'], eftype='cohen')
# alpha = 0.05  # significance level
# power = 0.8

# power_analysis = TTestIndPower()
# sample_size = power_analysis.solve_power(effect_size=effect_size,
#                                          power=power,
#                                          alpha=alpha)

# print('Required sample size: {0:.2f}'.format(sample_size))

# plt.show()

# # Test auf Normalverteilung
# # Um einen Zusammenhangstest zwischen den Kontrollgruppen und den Bewertungen der Privacy festzustellen,
# # muss zunächst untersucht werden ob die einzelnen Ergebnisse normalverteilt sind.
# # Shapiro-Wilk-Test
normal_test_privacy_control = stats.shapiro(df[df['condition'] == 'control']
                                            ['q_privacy'])
normal_test_privacy_privacy_priming = stats.shapiro(df[df['condition'] == 'privacy_priming']
                                                    ['q_privacy'])

normal_test_trust_control = stats.shapiro(df[df['condition'] == 'control']
                                          ['q_trust'])

normal_test_trust_privacy_priming = stats.shapiro(df[df['condition'] == 'privacy_priming']
                                                  ['q_trust'])

normal_test_iuipc_control = stats.shapiro(df[df['condition'] == 'control']
                                          ['q_iuipc'])

normal_test_iuipc_privacy_priming = stats.shapiro(df[df['condition'] == 'privacy_priming']
                                                  ['q_iuipc'])


print(normal_test_privacy_control)
print(normal_test_privacy_privacy_priming)
print(normal_test_trust_control)
print(normal_test_trust_privacy_priming)
print(normal_test_iuipc_control)
print(normal_test_iuipc_privacy_priming)

# FDR Adjusted P-values Benjamin Hochberg Procedure

p_values = []
p_values = [normal_test_privacy_control.pvalue, normal_test_privacy_privacy_priming.pvalue,
            normal_test_trust_control.pvalue, normal_test_trust_privacy_priming.pvalue, normal_test_iuipc_control.pvalue, normal_test_iuipc_privacy_priming.pvalue]

#print("P-Values for Normality test", p_values)

# first assign rank
rank = 1
len_p_val_list = len(p_values)
p_adj_lst = []

for p in p_values:
    fdr_adj_p_val = p*len_p_val_list/rank
    rank += 1
    p_adj_lst.append(
        {
            "p_val": p,
            "fdr_adj_p_val": fdr_adj_p_val
        }
    )
for obj in p_adj_lst:
    if obj['fdr_adj_p_val'] >= 0.05:
        print(obj)
# answers = []
# f = open('../jsonBin/results.json', 'r')
# data = json.load(f)
# for i in range(len(data)):
#     # print(i)
#     answers.append(data[i]['record']['condition'])

# print(answers)

# normal = []
# for i in range(50):
#     normal.append(1)
#     normal.append(0)
# print(normal)
# W, p = stats.shapiro(normal)
# print('Shapiro-Wilk: W:{0} p:{1}'.format(W, p))
# D, p = stats.kstest(normal, 'norm')
# print('Kolmogorov-Smirnow: D:{0} p:{1}'.format(D, p))
# bla = np.random.rand(15, 2)
# print(bla)
# stats.probplot(normal, plot=plt)
# plt.title('Verteilung der Experimentalbedingungen')
# plt.ylabel('Anzahl der Teilnehmer')
# plt.xlabel('Experimentalbedingungen')
# plt.bar(answers, 'control', width=0.4, label='Controlled')
# plt.bar(answers, 'privacy_priming', width=0.4, label='Privacy')
# plt.hist(answers)
plt.show()

# print(data)
# ttest_ind(df[df['condition']=='data_priming']['q_total'], df[df['condition']=='control']['q_total'])
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
# df = pd.read_csv('Bank_Privacy_Dialogue_results_180620.csv')
