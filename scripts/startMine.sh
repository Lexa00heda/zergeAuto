#function
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
#checking wifi
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
        fi
    done
    adb shell input keyevent 4
    adb shell input keyevent KEYCODE_HOME
fi

adb shell settings put global stay_on_while_plugged_in 15
sleep 1

sleep 8
#internet checking
# if ! check_internet_connection; then
#     echo "Exiting script due to lack of internet connection."
#     # timeout 10s adb shell reboot
#     exit 1
# fi
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

fail_count=0
#installing termux
if adb shell "pm list packages | grep -q com.termux" || adb shell pm path com.termux > /dev/null 2>&1 ; then
    echo "termux App is already installed. Skipping installation."
else
    echo "termux App is not installed. Installing APK..."
    if adb shell "which curl > /dev/null"; then
        echo "curl is available on the device. Downloading APK..."
        while [ $fail_count -lt 1 ]; do
            if adb shell "timeout 60 curl -L -o /data/local/tmp/termux.apk https://github.com/termux/termux-app/releases/download/v0.119.0-beta.1/termux-app_v0.119.0-beta.1+apt-android-7-github-debug_arm64-v8a.apk"; then
                echo "Download Successful"
                adb shell "pm install  /data/local/tmp/termux.apk"
                echo "APK downloaded and installed via curl."
                break
            else
                fail_count=$((fail_count + 1))
                echo "Download Failed or Timeout (Attempt $fail_count/2). Retrying..."
                sleep 5
            fi
        done
        if [ $fail_count -ge 1 ]; then
            echo "Failed 2 times. Using adb install..."
            adb install termux.apk
            echo "APK installed using adb."
        fi
    else
        echo "curl is not available on the device. Using adb install..."
        adb install termux.apk
        echo "APK installed using adb."
    fi
    echo "APK installed."
fi
#timeout
if command -v timeout &> /dev/null; then
    echo "'timeout' command is available, using it."
    timeout 90s adb shell monkey -p com.termux -v 500
    timeout_status=$?
else
    echo "'timeout' command not found, using fallback timeout method."
    adb shell monkey -p com.termux -v 500 &
    timeout_status=$?
    monkey_pid=$!
    sleep 20
    # Check if the monkey test is still running
    if ps -p $monkey_pid > /dev/null; then
        echo "Timeout reached, killing monkey test..."
        kill $monkey_pid  # Kill the monkey test process
    else
        echo "Monkey test completed within the timeout."
    fi
fi
sleep 4
# Check if timeout happened
if [ $timeout_status -eq 124 ]; then
    echo "The monkey command timed out."
else
    echo "The monkey command completed or was terminated by another reason."
fi

for i in {1..3}; do
    output=$(adb shell "run-as com.termux files/usr/bin/sh -lic 'export PATH=/data/data/com.termux/files/usr/bin:$PATH; export LD_PRELOAD=/data/data/com.termux/files/usr/lib/libtermux-exec.so; export HOME=/data/data/com.termux/files/home; cd $HOME;' 2>&1")
    if [[ "$output" == *"No such file or directory"* ]]; then
        adb shell am force-stop com.termux
        sleep 2
        # adb shell am start -n com.termux/.HomeActivity --display 0
        adb shell am start -n com.termux/.HomeActivity
        if [ $i -eq 2 ]; then
            echo "termux not opened $i time"
            sleep 25
        elif [ $i -eq 3 ]; then
            echo "termux didn't opened after $i retry"
            exit 1
        else
            echo "termux not opened $i time"
            sleep 10
        fi
    else
        echo "termux opened"
        exit 0
        break
    fi
done