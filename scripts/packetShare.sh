adb install bear.apk
sleep 2
# adb shell "am start -n com.packetshare.appv2/.welcome.WelcomeActivity"
adb shell am force-stop com.packetshare.appv2
sleep 2
adb shell monkey -p com.packetshare.appv2 -v 2
sleep 12
if adb shell wm size | grep -q "Override size"; then
    echo "Override size is set."
    adb shell input tap $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) -250))
else
    echo "Override size is not set."
    adb shell input tap $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) - 250))
fi
sleep 8
adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 61
adb shell input keyevent 66
sleep 2
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
sleep 3
adb shell input keyevent 61
sleep 1
adb shell input keyevent 61
adb shell input keyevent 66