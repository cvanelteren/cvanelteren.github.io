import pandas as pd, requests, numpy as np


def load_data(fp):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36"
    }
    with requests.Session() as s:
        dl = s.get(fp, headers=headers).content.decode("utf-8")
    return dl


fp = "https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_per_dag.csv"
icfp = "https://lcps.nu/wp-content/uploads/covid-19.csv"


dl = load_data(fp)

# load covid_cases data
tmp = dl.splitlines()
c = tmp.pop(0)
tmp = [i.split(";") for i in tmp]

df = pd.DataFrame(tmp, columns=c.split(";"))
conversion = dict(
    Total_reported=int,
    Hospital_admission=int,
    Deceased=int,
    Date_of_report=np.datetime64,
    Date_of_publication=np.datetime64,
)
# df = df.astype(conversion);

# load ic data
icdl = load_data(icfp)
tmp = icdl.splitlines()
c = tmp.pop(0)
tmp = [i.split(",") for i in tmp]

ic = pd.DataFrame(tmp, columns=c.split(","))
ic = ic.replace("", np.nan)
conversion = {c: float if c != "Datum" else np.datetime64 for c in ic.columns[1:]}

# ic = ic.astype(conversion)
ic["Datum"] = pd.to_datetime(ic["Datum"], format="%d-%m-%Y")
ic = ic.reindex(index=ic.index[::-1])

import json

with open("./nl.json", "r") as f:
    gj = json.load(f)

import geopandas as gpd

gemeentegrenzen = gpd.GeoDataFrame.from_file("nl.json")
print("mergin files")
df = pd.merge(
    df,
    gemeentegrenzen.loc[:, "statcode geometry".split()],
    right_on="statcode",
    left_on="Municipality_code",
)
df = gpd.GeoDataFrame(df)

df.to_pickle("data.pkl")
