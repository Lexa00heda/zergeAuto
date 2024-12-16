# if adb shell wm size | grep -q "Override size"; then
#     echo "Override size is set."
#     adb shell input tap $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) -250))
# else
#     echo "Override size is not set."
#     adb shell input tap $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) - 250))
# fi
if adb shell "pm list packages | grep -q com.packetshare.appv2" || adb shell pm path com.packetshare.appv2 > /dev/null 2>&1 ; then
    echo "packet share App is already installed....already working"
    adb shell input keyevent KEYCODE_HOME
    sleep 1
    adb shell "am start -n com.packetshare.appv2/.welcome.WelcomeActivity"
    sleep 4
    adb shell uiautomator dump /sdcard/window_dump.xml && adb shell cat /sdcard/window_dump.xml | grep -qi "balance\|Equivalent\|consumption\|share to friends\|Home\|congratulation" > /dev/null
    if [ $? -eq 0 ]; then
        echo "Found 'balance' or 'connected' in the UI dump."
        exit 0
    else
        echo "Neither 'balance' nor 'connected' found in the UI dump."
        sleep 1
    fi
else
    echo "packetshare App is not installed before...may be new device or deleting"
    adb install packet.apk
    echo "APK installed."
fi
#install
# if adb shell "pm list packages | grep -q com.packetshare.appv2" || adb shell pm path com.packetshare.appv2 > /dev/null 2>&1 ; then
#     echo "packetshare App is already installed. Skipping installation."
# else
#     echo "packershare is not installed. Installing APK..."
#     adb install packet.apk
#     echo "APK installed."
# fi
sleep 2
adb shell settings put system accelerometer_rotation 0
# adb shell monkey -p com.packetshare.appv2 -v 2
adb shell "am start -n com.packetshare.appv2/.welcome.WelcomeActivity"
sleep 6
adb shell input keyevent KEYCODE_HOME
sleep 2
adb shell am force-stop com.packetshare.appv2
sleep 2
adb shell "am start -n com.packetshare.appv2/.welcome.WelcomeActivity"
sleep 8
adb shell input keyevent KEYCODE_DPAD_DOWN
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 66
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 66
sleep 10
adb shell am force-stop com.packetshare.appv2
sleep 2
adb shell "am start -n com.packetshare.appv2/.welcome.WelcomeActivity"
sleep 15
adb shell input keyevent 66
# adb shell input keyevent 61
adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61
adb shell input keyevent 66
sleep 2
# adb shell input keyevent 61
adb shell input text "lexa31heda@gmail.com"
# adb shell input text "sumeeshsubeesh@gmail.com"
adb shell input keyevent 61
adb shell input text "kajas5612"
adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61
adb shell input keyevent 66
sleep 8
adb shell input keyevent KEYCODE_DPAD_DOWN
sleep 1
adb shell input keyevent KEYCODE_DPAD_DOWN
sleep 1
adb shell input keyevent KEYCODE_DPAD_DOWN
sleep 1
adb shell input keyevent 66
sleep 6
# adb shell input keyevent 61
adb shell input keyevent KEYCODE_DPAD_DOWN
sleep 1
adb shell input keyevent KEYCODE_DPAD_DOWN
# adb shell input keyevent 61
adb shell input keyevent 66
sleep 3
adb shell input keyevent 61
adb shell input keyevent 61
sleep 1
adb shell input keyevent 66
sleep 8
adb shell input keyevent KEYCODE_HOME
sleep 1
adb shell "am start -n com.packetshare.appv2/.welcome.WelcomeActivity"
sleep 4
adb shell uiautomator dump /sdcard/window_dump.xml && adb shell cat /sdcard/window_dump.xml | grep -qi "balance\|Equivalent to\|consumption\|share to friends\|Home\|congratulation" > /dev/null
if [ $? -eq 0 ]; then
    echo "Found 'balance' or 'connected' in the UI dump."
    adb shell input keyevent KEYCODE_HOME
    exit 0
else
    echo "Neither 'balance' nor 'connected' found in the UI dump."
    exit 1
fi