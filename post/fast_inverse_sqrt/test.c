#include <stdio.h>
float q_sqrt(float number) {
  long i;
  float x2, y;
  printf("%d\n", sizeof(i));
  const float threehalfs = 1.5F;

  x2 = number * 0.5F;
  y = number;
  i = *(long *)&y;
  i = 0x5f3759df - (i >> 1);
  y = y * (threehalfs - (x2 * y * y));
  y = y * (threehalfs - (x2 * y * y));
  return y;
}

int main() {
  float x = q_sqrt(16);
  printf("testing %f", x);
}
