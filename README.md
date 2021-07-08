# stranded-deep

[![Build Status](https://app.travis-ci.com/reergymerej/stranded-deep.svg?branch=master)](https://app.travis-ci.com/reergymerej/stranded-deep)

You have a compass and the will to survive.  For each island, record references
to other islands you see.  This will help map the world.

* tests - `yarn test`
* watch - `yarn watch`
* dev mode - `yarn dev --inspect`

## Format

    ## Rice
    * 180 short, (next) Tire
    * ???

    ## Tire Island
    * 000   short distance, Rice Island (origin)
    * 030  far
    * 280 medium (next target) Bat Island

    ## Bat Island
    * 060 - far, looks like I've harvested already
    * 100 - Tire Island (origin)
    * 230 - crazy far, looks untouched
    * 320 - far, boats, lots of shrubs/rocks (next island)

    * 010 - far
    * 060 - super far
    * 095 - super far
    * 140 - close (origin)
    * 320 - 1:35 next

    * 060 - close
    * 140 - 1:35 origin
    * 310 - 1:15 next
    * 350 - super far

    * 030 - close
    * 090 - super far
    * 120 - 1:15 origin
    * 320 - 1:15 next

    * 050 - super far
    * 080 - medium
    * 140 - 1:15 origin
    * 250 - 1:00 next
    * 310 - medium
    * 340 - super far

    * 010 - medium
    * 070 - 1:00 origin
    * 110 - far
    * 280 - 1:30 next
--------------------------------------------------------------------------------



