if adb shell wm size | grep -q "Override size"; then
    echo "Override size is set."
    for i in {1..5}; do
        # adb shell input swipe $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 + 180 + i*50)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) 100 1500
        adb shell input swipe $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 + 180 + i*50)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) 100 1000
        sleep 1
    done
    for i in {1..5}; do
        # adb shell input swipe $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 + 150 + i*50 )) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) - 10)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 + 150 + i*50 )) 1500
        adb shell input swipe $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 + 150 + i*50 )) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) - 10)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 + 150 + i*50 )) 1000
        sleep 1
    done
    adb shell input swipe $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 + 100)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 - 100)) 1500
    sleep 2
else
    echo "Override size is not set."
    for i in {1..5}; do
        # adb shell input swipe $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 + 180 + i*50 )) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) 100 1500
        adb shell input swipe $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 + 180 + i*50 )) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) 100 1000
        sleep 1
    done
    for i in {1..5}; do
        # adb shell input swipe $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 + 150 + i*50)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) - 10)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 + 150 + i*50)) 1500
        adb shell input swipe $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 + 150 + i*50)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) - 10)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 + 150 + i*50)) 1000
        sleep 1
    done
    adb shell input swipe $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 + 100)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 - 500)) 1500
    sleep 2
fi
check_internet_connection() {
    # Try to ping Google's DNS server (8.8.8.8)
    if adb shell "ping -c 1 8.8.8.8 > /dev/null 2>&1"; then
        echo "Internet connection is available."
        return 0  # Return success
    else
        echo "No internet connection. Please check your network."
        return 1  # Return failure
    fi
}
if adb shell wm size | grep -q "Override size"; then
    adb shell input swipe $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 + 100)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 - 500)) 1000
else
    adb shell input swipe $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 + 100)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 - 500)) 1000
fi
if adb shell ip addr show wlan0 | grep -q "inet"; then
    echo "Device is connected to Wi-Fi."
else
    echo "Device is not connected to Wi-Fi."
    adb shell svc wifi disable
    sleep 1
    adb shell svc wifi enable
    adb shell am start -a android.settings.WIFI_SETTINGS
    for i in {1..5}; do
        sleep 8
        if adb shell ip addr show wlan0 | grep -q "inet"; then
            echo "Device is connected to Wi-Fi."
            break
        else
            echo "Device is not connected to Wi-Fi."
            adb shell svc wifi enable
            if [ $i -eq 5 ]; then
                echo "Exiting script due to Device is not connected to Wi-Fi. $i attempts."
                exit 1
            fi
        fi
    done
    adb shell input keyevent 4
    adb shell input keyevent KEYCODE_HOME
fi
for attempt in {1..3}; do
    if ! check_internet_connection; then
        echo "No internet connection on attempt $attempt."
        # Only exit after the last (second) attempt if the connection is still unavailable
        if [ $attempt -eq 3 ]; then
            echo "Exiting script due to no internet connection after $attempt attempts."
            exit 1
        fi
        sleep 8
    else
        echo "Internet connection available on attempt $attempt."
        break
    fi
done
adb shell settings put global stay_on_while_plugged_in 15
sleep 2