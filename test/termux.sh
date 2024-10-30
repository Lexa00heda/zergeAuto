adb shell input keyevent 26
sleep 1
adb shell input swipe 500 1500 500 500
sleep 1
adb shell input swipe 500 1500 500 500
sleep 1
adb install ./test/SWeb.apk
sleep 1
adb shell pm grant landau.sweb android.permission.WRITE_EXTERNAL_STORAGE
sleep 1
adb shell pm grant landau.sweb android.permission.READ_EXTERNAL_STORAGE
adb shell am start landau.sweb
sleep 3
# adb shell input keyevent 61
# sleep 1
# adb shell input keyevent 66
# sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 66
sleep 1
adb shell am force-stop landau.sweb 
sleep 1
adb shell am start -a android.intent.action.VIEW -d "https://github.com/termux/termux-app/releases/download/v0.119.0-beta.1/termux-app_v0.119.0-beta.1+apt-android-7-github-debug_arm64-v8a.apk" landau.sweb
sleep 5
adb shell input keyevent 61
sleep 1
adb shell input keyevent 61
sleep 1
# adb shell input keyevent 61
# sleep 1
adb shell input keyevent 66
sleep 18
adb shell "mv /sdcard/Download/termux-app_v0.119.0-beta.1+apt-android-7-github-debug_arm64-v8a.apk /data/local/tmp/"
sleep 1
adb shell pm install /data/local/tmp/termux-app_v0.119.0-beta.1+apt-android-7-github-debug_arm64-v8a.apk
sleep 1
adb shell "curl -L -o /data/local/tmp/termux.apk https://github.com/termux/termux-app/releases/download/v0.119.0-beta.1/termux-app_v0.119.0-beta.1+apt-android-7-github-debug_arm64-v8a.apk && pm install  /data/local/tmp/termux.apk"