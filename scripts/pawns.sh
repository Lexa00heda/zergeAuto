adb install pawns.apk
sleep 2
adb shell am force-stop com.iproyal.android
sleep 2
adb shell settings put system accelerometer_rotation 0
# adb shell monkey -p com.iproyal.android -v 2
adb shell "am start -n com.iproyal.android/.activity.MainActivity"