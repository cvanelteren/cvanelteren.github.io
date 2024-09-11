from chicken import PyChicken

chicken = PyChicken("Carl")
# cdef Chicken chicken = Chicken(string("CARL"))
print(f"My name is {chicken.name}")
for i in range(10):
    chicken.peck()
