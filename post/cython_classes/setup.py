from setuptools import setup
from Cython.Build import cythonize
from setuptools.extension import Extension
import numpy as np, os

os.environ["CC"] = "g++-10"
exts = [
    Extension(
        "chicken",
        sources=["cychicken.pyx", "chicken.cpp"],
        include_dirs=[np.get_include(), "."],
        language="c++",
    )
]

setup(ext_modules=cythonize(exts))
