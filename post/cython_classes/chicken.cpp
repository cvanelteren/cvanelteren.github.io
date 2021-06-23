#include "chicken.hpp"

Chicken::Chicken() { this->name = "HELP I HAVE NO NAME"; }
Chicken::Chicken(std::string name) { this->name = name; }

void Chicken::peck() { std::cout << "Peck peck!" << std::endl; }
