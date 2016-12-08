import csv
import json

"""
    Program variabeles
"""
mainActor = 'Robert Downey Jr.'


movies = []
with  open('movie1.csv', 'rb') as f:
    data = csv.reader(f)
    movies = list(data)

# Create actor list
for entry in movies:
    actors.extend([entry[0], entry[1], entry[3]])

actors = []
actors = list(set(actors))


links  = []
for entry in movies:
    links.append({'title' : entry[2], 'source' : entry[0], 'target' : entry[1]})
    links.append({'title' : entry[2], 'source' : entry[0], 'target' : entry[3]})
    links.append({'title' : entry[2], 'source' : entry[1], 'target' : entry[3]})


# Checks if the given person has bin in a movie with that person.
def coStarWith(actor1, actor2):
    for link in links:
        if((link['source'] == actor1 and link['target'] == actor2) or
           (link['source'] == actor2 and link['target'] == actor1)):
            return True
    return False


# Returns a list of people that knows anyone in the list
def getConnection(downyList):
    connections   = []
    for actor in actors:
        for downeyCon in downyList:
            if coStarWith(actor, downeyCon):
                connections.append(actor)
                break
    return connections


down1  = getConnection([mainActor])
print down1
down2  = getConnection(down1)
print down2
down3  = getConnection(down2)

actors = [mainActor]

actors.extend(down1); actors.extend(down2) ; actors.extend(down3)
actors = list(set(actors))

i = 0
while (i < len(links)):
    if (links[i]["source"] in actors and links[i]["target"] in actors):
        links[i]["source"] = actors.index(links[i]["source"])
        links[i]["target"] = actors.index(links[i]["target"])
        i += 1
    else:
        links.pop(i)


nodes = []
for i in range(len(actors)):
    entry = {'name' : actors[i]}
    group = 0
    for j in range(len(downys)):
        if entry['name'] in downys[j]:
            group = j + 1
            break
    entry['group'] = group
    nodes.append(entry)


movies = {"nodes" : nodes, 'links' : links }


with open("data.json", 'w') as f:
     f.write(json.dumps(movies))
