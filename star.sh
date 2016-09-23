#!/bin/bash
mkdir .robot
git clone https://github.com/xwartz/robot.git -b dev .robot
cd .robot
bash autorun.sh
exit 0