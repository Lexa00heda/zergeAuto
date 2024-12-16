if adb shell "pm list packages | grep -q com.earn_fm.app" || adb shell pm path com.earn_fm.app > /dev/null 2>&1 ; then
    echo "earnfm App is already installed....already working"
    adb shell input keyevent KEYCODE_HOME
    sleep 1
    adb shell "am start -n com.earn_fm.app/.MainActivity"
    sleep 1
    adb shell uiautomator dump /sdcard/window_dump.xml && adb shell cat /sdcard/window_dump.xml | grep -qi "Dashboard" > /dev/null
    if [ $? -eq 0 ]; then
        echo "Found 'balance' or 'connected' in the UI dump."
        exit 0
    else
        echo "Neither 'balance' nor 'connected' found in the UI dump."
        sleep 1
    fi
else
    echo "earnfm App is not installed before...may be new device or deleting"
    adb install earnfm.apk
    echo "APK installed."
fi
# adb shell am force-stop com.earn_fm.app
adb shell "am start -n com.earn_fm.app/.MainActivity"
sleep 2
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input keyevent 66
sleep 2
adb shell uiautomator dump /sdcard/window_dump.xml
adb shell cat /sdcard/window_dump.xml | sed 's/\(content-desc="I agree with the Terms of Use"[^"]*\)/\n\1/g' | grep 'content-desc="I agree with the Terms of Use"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
sleep 2
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input text "lexa31heda@gmail.com"
adb shell input keyevent 61
adb shell input text "Lexa@heda12"
adb shell input keyevent 61
adb shell input keyevent 66
sleep 4
adb shell uiautomator dump /sdcard/window_dump.xml
adb shell cat /sdcard/window_dump.xml | sed 's/\(content-desc="Connect"[^"]*\)/\n\1/g' | grep 'content-desc="Connect"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
sleep 4
adb shell uiautomator dump /sdcard/window_dump.xml
adb shell cat /sdcard/window_dump.xml | sed 's/\(content-desc="Allow"[^"]*\)/\n\1/g' | grep 'content-desc="Allow"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
sleep 2
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input keyevent 66
sleep 2
adb shell input keyevent 61
adb shell input keyevent 66
sleep 2
adb shell uiautomator dump /sdcard/window_dump.xml
adb shell cat /sdcard/window_dump.xml | sed 's/\(content-desc="Allow"[^"]*\)/\n\1/g' | grep 'content-desc="Allow"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
sleep 4
adb shell uiautomator dump /sdcard/window_dump.xml && adb shell cat /sdcard/window_dump.xml | grep -qi "Dashboard" > /dev/null
if [ $? -eq 0 ]; then
    echo "Found 'balance' or 'connected' in the UI dump."
    exit 0
else
    echo "Neither 'balance' nor 'connected' found in the UI dump."
    exit 1
fi