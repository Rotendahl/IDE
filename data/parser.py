import csv
import json


movies = []

with  open('movie1.csv', 'rb') as f:
    data = csv.reader(f)
    movies = list(data)




actorsIndex = []
actors = []
links  = []
movies.pop(0)

for entry in movies:
    if not(entry[0] in actorsIndex):
        actors.append({'name' : entry[0]})
        actorsIndex.append(entry[0])
    if not(entry[1] in actorsIndex):
        actors.append({'name' : entry[1]})
        actorsIndex.append(entry[1])
    if not(entry[3] in actorsIndex):
        actors.append({'name' : entry[3]})
        actorsIndex.append(entry[3])
print actorsIndex

for entry in movies:
    links.append({
        'title'  : entry[2],
        'source' : actorsIndex.index(entry[0]),
        'target' : actorsIndex.index(entry[1]),
        'value'  : 1
    })
    links.append({
        'title'  : entry[2],
        'source' : actorsIndex.index(entry[0]),
        'target' : actorsIndex.index(entry[3]),
        'value'  : 1
    })
    links.append({
        'title'  : entry[2],
        'source' : actorsIndex.index(entry[1]),
        'target' : actorsIndex.index(entry[3]),
        'value'  : 1
    })



movies = {"nodes" : actors, 'links' : links }

with open("data.json", 'w') as f:
     f.write(json.dumps(movies))
