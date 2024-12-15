adb install honey.apk
# adb shell monkey -p com.honeygain.make.money -v 2
adb shell "am start -n com.honeygain.make.money/com.honeygain.app.ui.splash.SplashActivity"
sleep 4
adb shell input keyevent 61
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 66
sleep 6
adb shell uiautomator dump /sdcard/window_dump.xml
adb shell cat /sdcard/window_dump.xml | sed 's/\(text="I agree to the Terms of Use"[^"]*\)/\n\1/g' | grep 'text="I agree to the Terms of Use"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
sleep 4
adb shell input keyevent KEYCODE_DPAD_DOWN
sleep 1
adb shell input keyevent KEYCODE_DPAD_DOWN
sleep 1
adb shell input keyevent KEYCODE_DPAD_DOWN
sleep 1
adb shell input keyevent 66
sleep 3
adb shell input keyevent 61
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 66
sleep 1
adb shell uiautomator dump /sdcard/window_dump.xml
adb shell cat /sdcard/window_dump.xml | sed 's/\(text="Done"[^"]*\)/\n\1/g' | grep 'text="Done"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
sleep 2
adb shell input keyevent 61
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 66
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 66
sleep 2
adb shell uiautomator dump /sdcard/window_dump.xml
adb shell cat /sdcard/window_dump.xml | sed 's/\(text="Log in"[^"]*\)/\n\1/g' | grep 'text="Log in"' -A 1 | tail -n 1 | awk -F'bounds="' '{print $2}' | awk -F'"' '{print $1}' | sed 's/\[\([^,]*\),\([^]]*\)\]\[\([^,]*\),\([^]]*\)\]/\1 \2 \3 \4/' | awk '{print ($1 + $3)/2, ($2 + $4)/2}' | xargs -I {} adb shell input tap {}
sleep 3
adb shell input keyevent 61
adb shell input keyevent 61
# adb shell input text "lexa31heda@gmail.com"
adb shell input text "sumeeshsubeesh@gmail.com"
adb shell input keyevent 61
# adb shell input text "Lexa@heda12"
adb shell input text "kajas5566"
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input keyevent 66
sleep 8