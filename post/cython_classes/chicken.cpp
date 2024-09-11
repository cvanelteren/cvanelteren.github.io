#include "chicken.hpp"

Chicken::Chicken() { this->name = "HELP I HAVE NO NAME"; }
Chicken::Chicken(char *name) { this->name = name; }

void Chicken::peck() { std::cout << "Peck peck!" << std::endl; }
