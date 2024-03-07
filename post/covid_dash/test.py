import geopandas as gpd
import json, requests, pandas as pd

geodata_url = "https://geodata.nationaalgeoregister.nl/cbsgebiedsindelingen/wfs?request=GetFeature&service=WFS&version=2.0.0&typeName=cbs_gemeente_2021_gegeneraliseerd&outputFormat=json"
gj = requests.get(geodata_url).json()
gemeentegrenzen = gpd.read_file(geodata_url)
gemeentegrenzen = gemeentegrenzen.to_crs("EPSG:4326")
print(gemeentegrenzen.columns)
print(gemeentegrenzen.statcode)
import json

gemeentegrenzen.to_pickle("nl.pkl")
gj = json.loads(gemeentegrenzen.to_json())

fn = "./nl.json"
with open(fn, "w") as f:
    json.dump(gj, f)
