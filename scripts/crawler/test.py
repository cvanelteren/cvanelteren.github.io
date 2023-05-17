import proplot as plt, cmasher as cmr, pandas as pd,\
    numpy as np, os, sys, networkx as nx, warnings
from plexsim import models
from imi import infcy
from pathlib import Path

import json

g = nx.path_graph(3)
print(nx.node_link_data(g))

with open("test.json", 'r') as f:
    d = json.load(f)
#print(d["nodes"])
print(len(d["links"]))

e = []
for link in d["links"]:
    x = Path(link["source"]).name
    y = Path(link["target"]).name
    e.append((x,y))
e = np.array(e)
nodes = [{"id": i}  for i in np.unique(e) ]
print(nodes)
#with open("test.json", "w") as f:
#    json.dump({"nodes": nodes, "links": d["links"]}, f)
g = nx.from_edgelist(e)
nl = nx.node_link_data(g)
with open("test2.json", "w") as f:
    json.dump(nl,f)


from fa2 import ForceAtlas2
pos = ForceAtlas2().forceatlas2_networkx_layout(g)
fig, ax = plt.subplots()
nx.draw(g, pos, ax = ax, with_labels = True, node_size = 2000)
plt.show(block = 1)

