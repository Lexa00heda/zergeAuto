adb shell svc wifi disable
sleep 2
adb shell svc wifi enable
sleep 6
adb shell settings put global stay_on_while_plugged_in 15
sleep 1
if adb shell "pm list packages | grep -q com.termux"; then
    echo "termux App is already installed. Skipping installation."
else
    echo "termux App is not installed. Installing APK..."
    if adb shell "which curl > /dev/null"; then
        echo "curl is available on the device. Downloading APK..."
        adb shell "curl -L -o /data/local/tmp/termux.apk https://github.com/termux/termux-app/releases/download/v0.119.0-beta.1/termux-app_v0.119.0-beta.1+apt-android-7-github-debug_arm64-v8a.apk && pm install  /data/local/tmp/termux.apk"
        echo "APK downloaded and installed via curl."
    else
        echo "curl is not available on the device. Using adb install..."
        adb install termux.apk
        echo "APK installed using adb."
    fi
    echo "APK installed."
fi
adb shell monkey -p com.termux -v 500
sleep 4