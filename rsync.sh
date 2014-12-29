#!/bin/sh
#
while true;
do rsync -avt --delete --exclude=.meteor/ --exclude=client/lib/css /home/jeremy/Desktop/VM_Share/iterate /home/jeremy/Documents/ ;
sleep 5;
done
