adb install bear.apk
sleep 2
adb shell "am start -n com.packetshare.appv2/.welcome.WelcomeActivity"
sleep 4
if adb shell wm size | grep -q "Override size"; then
    echo "Override size is set."
    adb shell input tap $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) - 250))
else
    echo "Override size is not set."
    adb shell input tap $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) -250))
fi
sleep 8
adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61
adb shell input keyevent 66
sleep 2
# adb shell input tap 100 100
# adb shell input keyevent 66
adb shell input keyevent 61
adb shell input text "lexa31heda@gmail.com"
adb shell input keyevent 61
adb shell input text "kajas5612"
adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61
adb shell input keyevent 66
sleep 8
adb shell input keyevent 61 && adb shell input keyevent 61
adb shell input keyevent 66
sleep 6
adb shell input keyevent 61 && adb shell input keyevent 61
adb shell input keyevent 66
sleep 2
adb shell input keyevent 61 && adb shell input keyevent 61
adb shell input keyevent 66