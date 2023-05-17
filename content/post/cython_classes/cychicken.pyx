from cychicken cimport Chicken, string
cdef class PyChicken:
    # defines class property
    # can be put into pxd files
    cdef Chicken *cpp_chicken

    # normal class init
    def __init__(self, name: str):
        # need to convert string to binary
        # for cpp strings
        self.cpp_chicken = new Chicken(f"{name}".encode('utf8'))

    # ensures that point is deleted when object is
    # destroyed
    def __dealloc__(self):
        del self.cpp_chicken

    # wrap the peck function
    def peck(self):
        self.cpp_chicken.peck()

    # wrap the name property
    @property
    def name(self):
        return self.cpp_chicken.name.decode('utf8')


