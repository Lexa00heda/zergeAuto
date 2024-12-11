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