if adb shell "pm list packages | grep -q com.app.repocket" || adb shell pm path com.app.repocket > /dev/null 2>&1 ; then
    echo "repocket App is already installed. Skipping installation."
else
    echo "repocket is not installed. Installing APK..."
    adb install-multiple ./repocket/com_app_repocket_v3.1.0.apk ./repocket/config.xxhdpi.apk ./repocket/config.es.apk ./repocket/config.en.apk ./repocket/config.arm64_v8a.apk
    # adb install repocket.apk
    echo "APK installed."
fi
adb shell am force-stop com.app.repocket
sleep 1
adb shell settings put system accelerometer_rotation 0
adb shell "am start -n com.app.repocket/.MainActivity"
sleep 6
adb shell input keyevent 61
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent KEYCODE_DPAD_UP
sleep 1
adb shell input keyevent 66
sleep 1
adb shell am force-stop com.app.repocket
sleep 2
adb shell "am start -n com.app.repocket/.MainActivity"
sleep 3
adb shell input keyevent KEYCODE_DPAD_DOWN
sleep 1
adb shell input keyevent KEYCODE_DPAD_DOWN
sleep 1
adb shell input keyevent KEYCODE_DPAD_DOWN
sleep 1
adb shell input keyevent KEYCODE_DPAD_DOWN
sleep 1
adb shell input keyevent 66
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input text "sumeeshsubeesh@gmail.com"
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input text "kajas5566"
sleep 1
adb shell input keyevent 61
sleep 6
adb shell uiautomator dump /sdcard/window_dump.xml
adb shell cat /sdcard/window_dump.xml | sed 's/\(content-desc="Login"[^"]*\)/\n\1/g' | grep 'content-desc="Login"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
sleep 6
adb shell uiautomator dump /sdcard/window_dump.xml
adb shell cat /sdcard/window_dump.xml | sed 's/\(content-desc="Enable"[^"]*\)/\n\1/g' | grep 'content-desc="Enable"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
sleep 4
adb shell input keyevent 61
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 66
sleep 2
adb shell cat /sdcard/window_dump.xml | sed 's/\(content-desc="Enable"[^"]*\)/\n\1/g' | grep 'content-desc="Enable"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
sleep 2
adb shell cat /sdcard/window_dump.xml | sed 's/\(content-desc="Enable"[^"]*\)/\n\1/g' | grep 'content-desc="Enable"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
sleep 2
adb shell "am start -n com.app.repocket/.MainActivity"
sleep 2
adb shell uiautomator dump /sdcard/window_dump.xml && adb shell cat /sdcard/window_dump.xml | grep -qi "balance\|stop sharing\|profile" > /dev/null
if [ $? -eq 0 ]; then
    echo "Found 'balance' or 'connected' in the UI dump."
    adb shell input keyevent KEYCODE_HOME
    exit 0
else
    echo "Neither 'balance' nor 'connected' found in the UI dump."
    exit 1
fi
# adb shell input keyevent KEYCODE_HOME