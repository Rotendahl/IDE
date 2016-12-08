import csv
import json


movies = []

with  open('movie1.csv', 'rb') as f:
    data = csv.reader(f)
    movies = list(data)





actors = []
links  = []
movies.pop(0)

for entry in movies:
    if not(entry[0] in actors):
        actors.append(entry[0])
    if not(entry[1] in actors):
        actors.append(entry[1])
    if not(entry[3] in actors):
        actors.append(entry[3])

for entry in movies:
    links.append({
        'title'  : entry[2],
        'source' : actors.index(entry[0]),
        'target' : actors.index(entry[1])
    })
    links.append({
        'title'  : entry[2],
        'source' : actors.index(entry[0]),
        'target' : actors.index(entry[3])
    })
    links.append({
        'title'  : entry[2],
        'source' : actors.index(entry[1]),
        'target' : actors.index(entry[3])
    })



movies = {"nodes" : actors, 'links' : links }

with open("data.json", 'w') as f:
     f.write(json.dumps(movies))
