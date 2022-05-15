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
    
    url = 'https://api.jsonbin.io/v3/c/uncategorized/bins' 
    headers = {
    'X-Master-Key': '$2b$10$OpqpX1ClKRaQhj8QhbE/q.GYv2TZsb.RMyu1c8qIuye9Ki5scgBue'
    }
    data = {}
    req = requests.get(url, json=data, headers=headers)
    io = StringIO(req.text)
    bins = json.load(io);
    binHeaders = {
    'X-Master-Key': '$2b$10$OpqpX1ClKRaQhj8QhbE/q.GYv2TZsb.RMyu1c8qIuye9Ki5scgBue'
    }

    for _bin in bins:
            binUrl = 'https://api.jsonbin.io/v3/b/{}'.format(_bin["record"])
            req = requests.get(binUrl, json=binsArray, headers=binHeaders)
            bin = req.json()
            binsArray.append(bin);
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
    with open('results.json', 'w') as f:
        json.dump(binsArray, f)

asyncio.run(main())
    
    
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
                #df = pd.read_json(binReq.text);
                #print(json.load(StringIO(binReq.text)))
            #print(json.load(io))

#asyncio.run(main())
