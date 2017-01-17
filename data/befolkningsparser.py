import csv
import sys
import json

people = {}#'københavn' : {'1977' : 13337,  }




with open('befolkning.csv', 'rU') as data:
    reader = csv.DictReader(data)
    fields =  reader.fieldnames
    nr = 0
    for row in reader:
        name = 'FEEEEEEEJL'
        years = {}
        for key in row:
            if key == 'Kommune':
                name = row[key]
            else:
                years[key] = int(row[key])
        people[name] = years


with open("kommuner.geojson", 'r') as mapData:
    maps = json.load(mapData)


with open('kommunerBefolking.geojson', 'w') as outData:
        outData.write(json.dumps(maps))


print("Data is saved")
