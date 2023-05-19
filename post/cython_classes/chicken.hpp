#ifndef chicken_hpp
#define chicken_hpp
#include <iostream>
class Chicken {
public:
  Chicken();
  Chicken(char *name);
  char *name;
  void peck();
};
#endif
