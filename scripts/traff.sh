if adb shell "pm list packages | grep -q com.traffmonetizer.client" || adb shell pm path com.traffmonetizer.client > /dev/null 2>&1 ; then
    echo "traff App is already installed....already working"
    adb shell input keyevent KEYCODE_HOME
    adb shell am force-stop com.packetshare.appv2
    sleep 2
    adb shell "am start -n com.traffmonetizer.client/.MainActivity"
    sleep 4
    adb shell uiautomator dump /sdcard/window_dump.xml && adb shell cat /sdcard/window_dump.xml | grep -qi "Service is running" > /dev/null
    if [ $? -eq 0 ]; then
        echo "Found 'balance' or 'connected' in the UI dump."
        exit 0
    else
        echo "Neither 'balance' nor 'connected' found in the UI dump."
        sleep 1
    fi
else
    echo "traff is not installed before...may be new device or deleting"
    adb install traff.apk
    echo "APK installed."
fi
adb shell "am start -n com.traffmonetizer.client/.MainActivity"
sleep 4
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input text "d5dfQjg72ADMhuLxCKnZISTRtxeqgiFLMy0ntzxTve8="
adb shell input keyevent 61
adb shell input keyevent 66
sleep 4
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input keyevent 66
sleep 4
adb shell uiautomator dump /sdcard/window_dump.xml && adb shell cat /sdcard/window_dump.xml | grep -qi "Service is running" > /dev/null
if [ $? -eq 0 ]; then
    echo "Found 'balance' or 'connected' in the UI dump."
    adb shell input keyevent KEYCODE_HOME
    exit 0
else
    echo "Neither 'balance' nor 'connected' found in the UI dump."
    exit 1
fi