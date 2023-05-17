import std/bitops

proc Q_rsqrt(number: float32): float32 =
  # computes fast inverse square root
  var i: uint32
  var x2: float32

  let threehalfs: float32 = 1.5

  x2 = number * 0.5
  result = number

  # evil hacks
  i = (cast[ptr uint32](result.addr))[]
  i = 0x5f3759df - (i.rotateRightBits(1)) # negate exponent
  result = (cast[ptr float32](i.addr))[]

  # Newton step: integration
  result = result * (threehalfs - (x2 * result * result))
  result = result * (threehalfs - (x2 * result * result))

echo Q_rsqrt(4) # should print ~ 0.5
