import nimpy
# types are "classes"
# they are similar to structs
type Chicken = ref object of PyNimObjectExperimental
   name: string

# on the structs we can define methods
proc set_name(self: Chicken, value : string) {.exportpy.}=
  self.name = value
proc get_name(self: Chicken): string  {.exportpy.}=
    self.name

proc peck(self: Chicken): void {.exportpy.} =
    echo "Peck peck!"


{.compile: "../cython_classes/chicken.cpp".}

type CChicken* {.header: "../cython_classes/chicken.hpp", importcpp: "Chicken".} = object
    name: cstring

# proc peck*(this: CChicken;): {.header: "../cython_classes/chicken.hpp", importcpp: "#.peck(@)".}
proc peck*(this: CChicken) {.header: "../cython_classes/chicken.hpp", importcpp: "#.peck(@)".}


var cchick = CChicken(name: "Carl")
var nchick = Chicken(name: "Betsy")
echo "We have two chickens now, introducing:"
echo nchick.name
echo cchick.name
for i in 1..10:
    nchick.peck()
    cchick.peck()
