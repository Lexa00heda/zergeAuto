adb shell svc wifi disable
sleep 2
adb shell svc wifi enable
sleep 6
adb shell settings put global stay_on_while_plugged_in 15
sleep 1
# adb install termux.apk
# sleep 2
# adb shell monkey -p com.termux -v 1

adb shell "curl -L -o /data/local/tmp/termux.apk https://github.com/termux/termux-app/releases/download/v0.119.0-beta.1/termux-app_v0.119.0-beta.1+apt-android-7-github-debug_arm64-v8a.apk && pm install  /data/local/tmp/termux.apk"
adb shell monkey -p com.termux -v 10