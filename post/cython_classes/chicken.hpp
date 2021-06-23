#ifndef chicken_hpp
#define chicken_hpp
#include <iostream>
class Chicken {
public:
  Chicken();
  Chicken(std::string name);
  std::string name;
  void peck();
};
#endif
