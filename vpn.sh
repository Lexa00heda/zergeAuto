if adb shell "pm list packages | grep -q com.pandavpn.androidproxy"; then
    echo "panda vpn App is already installed. Skipping installation."
else
    echo "panda vpn App is not installed. Installing APK..."
    if adb shell "which curl > /dev/null"; then
        echo "curl is available on the device. Downloading APK..."
        adb shell "curl -L -o /data/local/tmp/panda.apk https://dl.aecoe.xyz/PandaAdmin/android/panda_pro_normal_7.0.5_177_1407_10140119_release.apk && pm install  /data/local/tmp/panda.apk"
        echo "APK downloaded and installed via curl."
    else
        echo "curl is not available on the device. Using adb install..."
        adb install panda.apk
        echo "APK installed using adb."
    fi
    echo "APK installed."
fi
adb shell monkey -p com.pandavpn.androidproxy -v 1
sleep 10
# adb shell input keyevent 61
# adb shell input keyevent 61
# adb shell input keyevent 66
# sleep 1
adb shell am force-stop com.pandavpn.androidproxy
sleep 2
adb shell monkey -p com.pandavpn.androidproxy -v 1
sleep 2
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input keyevent 66
sleep 1
adb shell am force-stop com.pandavpn.androidproxy
sleep 2
adb shell monkey -p com.pandavpn.androidproxy -v 1
sleep 2
adb shell input keyevent 61
adb shell input keyevent 61
adb shell input keyevent 66
# adb shell input keyevent KEYCODE_HOME
sleep 4
adb shell am force-stop com.pandavpn.androidproxy
sleep 2
adb shell monkey -p com.pandavpn.androidproxy -v 1
sleep 3
if adb shell wm size | grep -q "Override size"; then
    echo "Override size is set."
    adb shell input swipe $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 + 100)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 - 100)) 2000
else
    echo "Override size is not set."
    adb shell input swipe $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 + 100)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 - 100)) 2000
fi
sleep 4
adb shell input keyevent 61
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 61
sleep 1
adb shell input keyevent 66
sleep 1
# adb shell input swipe $(($(adb shell wm size | awk '/Physical size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Physical size/ {print $3}' | cut -d'x' -f2) / 2 + 100)) $(($(adb shell wm size | awk '/Physical size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Physical size/ {print $3}' | cut -d'x' -f2) / 2 - 100)) 2000
# adb shell input swipe $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 + 100)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 - 100)) 2000
# adb shell input keyevent KEYCODE_HOME
# sleep 4
# adb shell am force-stop com.pandavpn.androidproxy
# sleep 2
# adb shell monkey -p com.pandavpn.androidproxy -v 1
# sleep 3
# adb shell input swipe $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 + 100)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 - 100)) 2000
# sleep 4
# adb shell input keyevent 61
# sleep 1
# adb shell input keyevent 61
# sleep 1
# adb shell input keyevent 61
# sleep 1
# adb shell input keyevent 66
# sleep 1
# adb shell input keyevent KEYCODE_HOME
