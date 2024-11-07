# adb shell input swipe 500 1500 500 0 2000 
if adb shell wm size | grep -q "Override size"; then
    echo "Override size is set."
    adb shell input swipe $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 + 100)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 - 100)) 2000
else
    echo "Override size is not set."
    adb shell input swipe $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 + 100)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 - 100)) 2000
fi
sleep 1
adb shell am force-stop com.termux
sleep 2
adb shell am start -n com.termux/.HomeActivity --display 0
sleep 4
adb shell input keyevent 66
adb shell input keyevent 4
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