if adb shell "pm list packages | grep -q com.ipcheck" || adb shell pm path com.ipcheck > /dev/null 2>&1 ; then
    echo "flutter App is already installed....already working"
    adb shell input keyevent KEYCODE_HOME
    sleep 1
    adb shell "am start -n com.ipcheck/.MainActivity"
    sleep 4
    adb shell uiautomator dump /sdcard/window_dump.xml && adb shell cat /sdcard/window_dump.xml | grep -qi "start service" > /dev/null
    if [ $? -eq 0 ]; then
        echo "Found 'balance' or 'connected' in the UI dump."
        exit 0
    else
        echo "Neither 'balance' nor 'connected' found in the UI dump."
        sleep 1
    fi
else
    echo "flutter App is not installed before...may be new device or deleting"
    # Install APK based on architecture
    ARCH=$(adb shell getprop ro.product.cpu.abi)
    if [[ "$ARCH" == "arm64-v8a" ]]; then
        echo "Installing APK for ARM 64-bit (arm64-v8a)"
        adb install flutter.apk
    elif [[ "$ARCH" == "armeabi-v7a" ]]; then
        echo "Installing APK for ARM 32-bit (armeabi-v7a)"
        adb install flutter-v7a.apk
    else
        echo "Unknown architecture: $ARCH"
    fi
    echo "APK installed."
fi
sleep 2
adb shell "am start -n com.ipcheck/.MainActivity"
sleep 2
adb shell input keyevent 61
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 66
sleep 2
adb shell uiautomator dump /sdcard/window_dump.xml
adb shell cat /sdcard/window_dump.xml | sed 's/\(content-desc="start service"[^"]*\)/\n\1/g' | grep 'content-desc="start service"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
adb shell uiautomator dump /sdcard/window_dump.xml && adb shell cat /sdcard/window_dump.xml | grep -qi "start service" > /dev/null
if [ $? -eq 0 ]; then
    echo "Found 'balance' or 'connected' in the UI dump."
    sleep 4
    # adb shell svc wifi disable
    # sleep 2
    # adb shell svc wifi enable
    sleep 2
    adb shell input keyevent KEYCODE_HOME
    exit 0
else
    echo "Neither 'balance' nor 'connected' found in the UI dump."
    exit 1
fi