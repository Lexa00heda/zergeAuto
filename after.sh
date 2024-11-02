adb shell am force-stop com.termux
sleep 2
adb shell monkey -p com.termux -v 1
sleep 4
adb shell input keyevent 66
sleep 1
adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 66
sleep 1
adb shell input keyevent 66
sleep 1
adb shell input text "cd%sverusMiningss"
sleep 1
adb shell input keyevent 66
sleep 1
adb shell input text "cd%sverusMinings"
sleep 1
adb shell input keyevent 66
sleep 1
adb shell input text "nohup%s./install.sh"
sleep 1
adb shell input keyevent 66
sleep 4
adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 66
sleep 12
adb shell input keyevent KEYCODE_APP_SWITCH
sleep 1
adb shell input keyevent KEYCODE_DPAD_DOWN
sleep 1
adb shell input keyevent KEYCODE_ENTER