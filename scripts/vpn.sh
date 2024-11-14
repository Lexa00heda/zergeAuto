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
sleep 4

for i in {1..7}; do
    echo "Checking connection on attempt $i..."
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
    adb shell "run-as com.termux truncate -s 0 /data/data/com.termux/files/home/verusMinings/nohup.out"
    # adb shell "run-as com.termux truncate -s 0 /data/data/com.termux/files/home/unmineable/nohup.out"
    sleep 3
    adb shell input keyevent KEYCODE_HOME
    sleep 8
    for i in {1..2}; do
        sleep 4
        if adb shell "run-as com.termux test ! -s /data/data/com.termux/files/home/verusMinings/nohup.out"; then
            echo "File is empty"
        else
            echo "File is not empty"
            if adb shell "run-as com.termux cat /data/data/com.termux/files/home/verusMinings/nohup.out | grep -q 'Verus Hashing'" || adb shell "run-as com.termux cat /data/data/com.termux/files/home/verusMinings/nohup.out | grep -q 'accepted'" || adb shell "run-as com.termux cat /data/data/com.termux/files/home/verusMinings/nohup.out | grep -q 'Stratum difficulty set to'" ; then
                    echo "Miner running succesfully"
                    is_running=true
                    break
            else
                    echo "Miner not connected"
                    is_running=false
            fi
        fi
    done
    if [ "$is_running" = true ]; then
        echo "Vpn connected Successfully"
        break
    else
        echo "Restarting vpn"
    fi
done