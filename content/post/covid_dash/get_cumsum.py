import matplotlib.pyplot as plt, cmasher as cmr, pandas as pd
import numpy as np, os, sys, networkx as nx, warnings

warnings.simplefilter("ignore")
plt.style.use("fivethirtyeight spooky".split())


df = pd.read_pickle("data.pkl")


def get_rank(row):
    return np.percentile(row["Total_reported_cumsum"])


print(df.columns)
df["Total_reported_cumsum"] = df["Total_reported"].cumsum()

df["Total_reported_ranked"] = df.groupby("date").map(get_rank)
with open("nl_merged.json", "w") as f:
    json.dump(df.to_json(), f)
print(df)
