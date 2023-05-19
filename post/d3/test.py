import pandas as pd, networkx as nx

g = nx.duplication_divergence_graph(10, .2)

nl = nx.node_link_data(g)

tmp = []
for node in nl["nodes"]:
    tmp.append(dict(name = node["id"]))
pd.DataFrame(tmp).to_csv("./nodes.csv")

tmp = []
for link in nl["links"]:
    print(link)
    tmp.append(link)
pd.DataFrame(tmp).to_csv("./edges.csv")
print(pd.DataFrame(tmp))
