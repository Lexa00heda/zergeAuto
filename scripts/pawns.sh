if adb shell "pm list packages | grep -q com.iproyal.android" || adb shell pm path com.iproyal.android > /dev/null 2>&1 ; then
    echo "Iproyal App is already installed....already working"
    adb shell "am start -n com.iproyal.android/.activity.MainActivity"
    adb shell uiautomator dump /sdcard/window_dump.xml && adb shell cat /sdcard/window_dump.xml | grep -qi "Stop Sharing\|TRAFFIC SHARED" > /dev/null
    if [ $? -eq 0 ]; then
        echo "Found 'balance' or 'connected' in the UI dump."
        exit 0
    else
        echo "Neither 'balance' nor 'connected' found in the UI dump."
        sleep 1
    fi
else
    echo "Iproyal App is not installed before...may be new device or deleting"
fi
#install
if adb shell "pm list packages | grep -q com.iproyal.android" || adb shell pm path com.iproyal.android > /dev/null 2>&1 ; then
    echo "pawns App is already installed. Skipping installation."
else
    echo "pawns is not installed. Installing APK..."
    adb install pawns.apk
    echo "APK installed."
fi
adb install pawns.apk
sleep 2
adb shell am force-stop com.iproyal.android
sleep 2
adb shell settings put system accelerometer_rotation 0
# adb shell monkey -p com.iproyal.android -v 2
adb shell "am start -n com.iproyal.android/.activity.MainActivity"
sleep 4
adb shell uiautomator dump /sdcard/window_dump.xml
adb shell cat /sdcard/window_dump.xml | sed 's/\(text="Next"[^"]*\)/\n\1/g' | grep 'text="Next"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
adb shell cat /sdcard/window_dump.xml | sed 's/\(text="Next"[^"]*\)/\n\1/g' | grep 'text="Next"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
adb shell cat /sdcard/window_dump.xml | sed 's/\(text="Next"[^"]*\)/\n\1/g' | grep 'text="Next"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
adb shell cat /sdcard/window_dump.xml | sed 's/\(text="Next"[^"]*\)/\n\1/g' | grep 'text="Next"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
sleep 4
adb shell uiautomator dump /sdcard/window_dump.xml
adb shell cat /sdcard/window_dump.xml | sed 's/\(text="Continue with Email"[^"]*\)/\n\1/g' | grep 'text="Continue with Email"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input keyevent 66
adb shell input keyevent 61
adb shell input text "lexa31heda@gmail.com"
adb shell input keyevent 61
adb shell input text "Lexa@heda12"
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input keyevent 66
sleep 4
adb shell am force-stop com.iproyal.android
sleep 2
adb shell settings put system accelerometer_rotation 0
adb shell "am start -n com.iproyal.android/.activity.MainActivity"
sleep 2
adb shell uiautomator dump /sdcard/window_dump.xml
adb shell cat /sdcard/window_dump.xml | sed 's/\(text="Home"[^"]*\)/\n\1/g' | grep 'text="Home"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
sleep 4
adb shell uiautomator dump /sdcard/window_dump.xml
adb shell cat /sdcard/window_dump.xml | sed 's/\(NAF="true" index="14"[^"]*\)/\n\1/g' | grep 'NAF="true" index="14"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
sleep 2
adb shell input keyevent 61
adb shell input keyevent KEYCODE_DPAD_UP
adb shell input keyevent 66
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input keyevent 66
sleep 2
adb shell cat /sdcard/window_dump.xml | sed 's/\(text="Share Internet"[^"]*\)/\n\1/g' | grep 'text="Share Internet"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input keyevent KEYCODE_DPAD_UP
adb shell input keyevent 66
sleep 1
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input keyevent 66
sleep 6
adb shell uiautomator dump /sdcard/window_dump.xml && adb shell cat /sdcard/window_dump.xml | grep -qi "Stop Sharing\|TRAFFIC SHARED" > /dev/null
if [ $? -eq 0 ]; then
    echo "Found 'balance' or 'connected' in the UI dump."
    adb shell input keyevent KEYCODE_HOME
    exit 0
else
    echo "Neither 'balance' nor 'connected' found in the UI dump."
    exit 1
fi