adb shell am force-stop com.termux
sleep 2
adb shell am start -n com.termux/.HomeActivity --display 0
sleep 4
#checking wifi
if adb shell ip addr show wlan0 | grep -q "inet"; then
    echo "Device is connected to Wi-Fi."
else
    echo "Device is not connected to Wi-Fi."
    adb shell svc wifi disable
    sleep 1
    adb shell svc wifi enable
    adb shell am start -a android.settings.WIFI_SETTINGS
    for i in {1..7}; do
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
fi
adb shell "run-as com.termux sh -c 'export PATH=/data/data/com.termux/files/usr/bin:\$PATH; export LD_PRELOAD=/data/data/com.termux/files/usr/lib/libtermux-exec.so; export HOME=/data/data/com.termux/files/home; cd \$HOME; source ~/.bashrc; apt clean;apt-get clean; yes | pkg install git -y; git clone https://github.com/Lexa00heda/verusMinings.git; cd verusMinings; chmod +x install.sh'"
for i in {1..5}; do
        echo "Checking termux mining on attempt $i..."
        adb shell "run-as com.termux truncate -s 0 /data/data/com.termux/files/home/verusMinings/nohup.out"
        sleep 3
        adb shell am force-stop com.termux
        sleep 1
        adb shell monkey -p com.termux -v 1
        adb shell am start -n com.termux/.HomeActivity --display 0
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
        sleep 1
        adb shell am start -n com.samsung.rtlassistant/.TransparentView 
        sleep 1
        adb shell am start com.samsung.rtlassistant
        if adb shell "run-as com.termux test ! -s /data/data/com.termux/files/home/verusMinings/nohup.out"; then
            echo "File is empty. Script not running in termux"
        else
            if adb shell "run-as com.termux cat /data/data/com.termux/files/home/verusMinings/nohup.out | grep -q 'CANNOT'" ; then
                echo "Miner dependacy issue"
            else
                echo "Script is running in termux"
                exit 0
                break
            fi
        fi
done
echo "Mining script did not start after 5 attempts."
exit 1