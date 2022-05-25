# var XMLHttpRequest = require('xhr2');

# let req = new XMLHttpRequest();

# req.onreadystatechange = () => {
#   if (req.readyState == XMLHttpRequest.DONE) {
#     let response = (JSON.parse(req.responseText));
#     response.forEach(element => {

#         let req1 = new XMLHttpRequest();
#         req.open("GET", "https://api.jsonbin.io/v3/c/uncategorized/bins/62710ce138be296761fbb574", true);
# req.setRequestHeader("Content-Type", "application/json");
# req.setRequestHeader("X-Master-Key", "$2b$10$OpqpX1ClKRaQhj8QhbE/q.GYv2TZsb.RMyu1c8qIuye9Ki5scgBue");
# req.send();
#         console.log(element)
#     });
#   }
# };
# #627a56d6019db46796998228
# #6271238f38be296761fbbce7
# #62710ce138be296761fbb574
# req.open("GET", "https://api.jsonbin.io/v3/c/uncategorized/bins/62710ce138be296761fbb574", true);
# req.setRequestHeader("Content-Type", "application/json");
# req.setRequestHeader("X-Master-Key", "$2b$10$OpqpX1ClKRaQhj8QhbE/q.GYv2TZsb.RMyu1c8qIuye9Ki5scgBue");
# req.send();


import re
import requests
import json
import pandas as pd
import asyncio
import aiohttp

from io import StringIO
binsArray = []


async def getBins():

    url = 'https://api.jsonbin.io/v3/c/uncategorized/bins/6278ec6138be296761fe99da'
    headers = {
        'X-Master-Key': '$2b$10$OpqpX1ClKRaQhj8QhbE/q.GYv2TZsb.RMyu1c8qIuye9Ki5scgBue'
    }
    data = {}
    req = requests.get(url, json=data, headers=headers)
    io = StringIO(req.text)
    bins = json.load(io)
    binHeaders = {
        'X-Master-Key': '$2b$10$OpqpX1ClKRaQhj8QhbE/q.GYv2TZsb.RMyu1c8qIuye9Ki5scgBue'
    }

    for _bin in bins:
        binUrl = 'https://api.jsonbin.io/v3/b/{}'.format(_bin["record"])
        req = requests.get(binUrl, json=binsArray, headers=binHeaders)
        bin = req.json()
        binsArray.append(bin)
# binData = {}
# binReq = await requests.get(binUrl, json=binData, headers=binHeaders).json();

# url = 'http://jsonplaceholder.typicode.com/users'
# data = {}
# req = requests.get(url, json=data);

# for _user in req:
#     #with open('results.json', 'w') as f:
#     bins.append(json.load(StringIO(_user)))
#     #print(bins)


async def main():
    await asyncio.gather(getBins())
    print("I have waited for it")
    with open('results.json', 'rb') as f:
        if f.read(0) == '':
            f.seek(0)
            with open('results.json', 'w') as file:
                json.dump(binsArray, file)
        else:
            with open('results.json') as json_file:
                print("its not empty")
                data = json.load(json_file)
                # print(data)
                data.append(
                    binsArray)
            with open('results.json', 'w') as bla:
                json.dump(data, bla, indent=4)


# asyncio.run(main())
substring = 'Daten für die nächste Berechnung speichern?'
with open('results.json', 'r') as json_file:

    results = json.load(json_file)
    # print(len(resultsFile))
    # print(resultsFile[0])

    for i in range(len(results)):
        # if substring in results[i]['record']['transcript']:
        #     results[i]['record']['condition'] = 'control'
        if 'Daten für die nächste Berechnung speichern?; [user] JA' or 'Daten für die nächste Berechnung speichern?; [user] ja' or 'Daten für die nächste Berechnung speichern?; [user] speichern' in results[i]['record']['transcript']:
            results[i]['record']['response_yn'] = 'yes'
            results[i]['record']['condition'] = 'control'

        if 'Daten für die nächste Berechnung speichern?; [user] Nein' or 'Daten für die nächste Berechnung speichern?; [user] nein' or 'Daten für die nächste Berechnung speichern?; [user] ne' in results[i]['record']['transcript']:
            results[i]['record']['response_yn'] = 'no'
            results[i]['record']['condition'] = 'control'

        # else:
        if 'dich löschen?; [user] nein;' or 'dich löschen?; [user] Nein;' or 'dich löschen?; [user] ne;' in results[i]['record']['transcript']:
            results[i]['record']['response_yn'] = 'no'
            results[i]['record']['condition'] = 'privacy_priming'

        if 'dich löschen?; [user] ja;' or 'dich löschen?; [user] Ja;' or 'dich löschen?; [user] Jo;' in results[i]['record']['transcript']:
            results[i]['record']['response_yn'] = 'yes'
            results[i]['record']['condition'] = 'privacy_priming'

    # print(results)
    with open('results.json', 'r') as chick:
        data = json.load(chick)
        data.append(results)
    with open('results.json', 'w') as bla:
        json.dump(data, bla, indent=4)


# print(resultsFile[i]['record'])
# Append response and condition to all json objects that came later
# for i in range(len(resultsFile)):
#     print(resultsFile['0'])


# url = 'https://api.jsonbin.io/v3/c/uncategorized/bins'
# headers = {
# 'X-Master-Key': '$2b$10$OpqpX1ClKRaQhj8QhbE/q.GYv2TZsb.RMyu1c8qIuye9Ki5scgBue'
# }
# data = {}
# req = requests.get(url, json=data, headers=headers)
# io = StringIO(req.text)
# bins = json.load(io);
# binHeaders = {
# 'X-Master-Key': '$2b$10$OpqpX1ClKRaQhj8QhbE/q.GYv2TZsb.RMyu1c8qIuye9Ki5scgBue'
# }
# async with aiohttp.ClientSession(headers=binHeaders) as session:

#     for _bin in bins:
#             binUrl = 'https://api.jsonbin.io/v3/b/{}'.format(_bin["record"])
#             async with session.get(url=binUrl) as resp:
#                 bin = await resp.json()
#                 with open('results.json', 'w') as f:
#                     json.dump(bin, f)
#                 print(bin)
# binData = {}
# binReq = await requests.get(binUrl, json=binData, headers=binHeaders).json();

# with open('results.json', 'w') as f:
#         json.dump(binReq, f)
# df = pd.read_json(binReq.text);
# print(json.load(StringIO(binReq.text)))
# print(json.load(io))

# asyncio.run(main())
