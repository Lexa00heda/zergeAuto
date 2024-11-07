if adb shell wm size | grep -q "Override size"; then
    echo "Override size is set."
    adb shell input swipe $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 + 100)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '/Override size/ {print $3}' | cut -d'x' -f2) / 2 - 100)) 2000
else
    echo "Override size is not set."
    adb shell input swipe $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 + 100)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f1) / 2)) $(($(adb shell wm size | awk '{print $3}' | cut -d'x' -f2) / 2 - 100)) 2000
fi
adb shell svc wifi disable
sleep 1
adb shell svc wifi enable 
sleep 8
adb shell am force-stop com.termux
sleep 2
adb shell monkey -p com.termux -v 1
# adb shell am start -n com.termux/.HomeActivity --display 1
sleep 4
if
adb shell "run-as com.termux sh -c 'export PATH=/data/data/com.termux/files/usr/bin:\$PATH; export LD_PRELOAD=/data/data/com.termux/files/usr/lib/libtermux-exec.so; export HOME=/data/data/com.termux/files/home; cd \$HOME; source ~/.bashrc; yes | pkg install git -y; git clone https://github.com/Lexa00heda/verusMinings.git; cd verusMinings; chmod +x install.sh'"
sleep 4
# adb shell "run-as com.termux files/usr/bin/bash -lic 'export PATH=/data/data/com.termux/files/usr/bin:$PATH; export LD_PRELOAD=/data/data/com.termux/files/usr/lib/libtermux-exec.so; cat verusMinings/nohup.out'"  
adb shell monkey -p com.termux -v 1
sleep 4
adb shell input keyevent 66
sleep 1
adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 66
sleep 1
adb shell input keyevent 66
sleep 1
adb shell input text "cd%sverusMiningss"
sleep 1
adb shell input keyevent 66
sleep 1
adb shell input text "cd%sverusMinings"
sleep 1
adb shell input keyevent 66
sleep 1
adb shell input text "nohup%s./install.sh"
sleep 1
adb shell input keyevent 66
sleep 4
adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 66
sleep 12
adb shell input keyevent KEYCODE_APP_SWITCH
sleep 1
adb shell input keyevent KEYCODE_DPAD_DOWN
sleep 1
adb shell input keyevent KEYCODE_ENTER
sleep 1
adb shell input keyevent KEYCODE_HOME