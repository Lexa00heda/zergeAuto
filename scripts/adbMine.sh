adb shell am force-stop com.myterm
sleep 2
# adb shell am start -n com.myterm/.HomeActivity --display 0
adb shell am start -n com.myterm/.HomeActivity
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
fi
adb shell "run-as com.myterm sh -c 'export PATH=/data/data/com.myterm/files/usr/bin:\$PATH; export LD_PRELOAD=/data/data/com.myterm/files/usr/lib/libtermux-exec.so; export HOME=/data/data/com.myterm/files/home; cd \$HOME; source ~/.bashrc; n; git clone https://github.com/Lexa00heda/verusMinings.git; cd verusMinings; chmod +x install.sh'"
# adb shell "run-as com.myterm sh -c 'export PATH=/data/data/com.myterm/files/usr/bin:\$PATH; export LD_PRELOAD=/data/data/com.myterm/files/usr/lib/libtermux-exec.so; export HOME=/data/data/com.myterm/files/home; cd \$HOME; source ~/.bashrc; apt clean;apt-get clean; yes | pkg install git -y; git clone https://github.com/Lexa00heda/verusMinings.git; cd verusMinings; chmod +x install.sh'"
for i in {1..6}; do
        echo "Checking termux mining on attempt $i..."
        if adb shell "run-as com.myterm test -d /data/data/com.myterm/files/home/verusMinings"; then 
            echo "verusMinings Directory present"; 
        else 
            echo "verusMinings Directory not present"; 
            adb shell "run-as com.myterm sh -c 'export PATH=/data/data/com.myterm/files/usr/bin:\$PATH; export LD_PRELOAD=/data/data/com.myterm/files/usr/lib/libtermux-exec.so; export HOME=/data/data/com.myterm/files/home; cd \$HOME; source ~/.bashrc; apt clean;apt-get clean; yes | pkg install git -y; git clone https://github.com/Lexa00heda/verusMinings.git; cd verusMinings; chmod +x install.sh'"
        fi
        adb shell "run-as com.myterm truncate -s 0 /data/data/com.myterm/files/home/verusMinings/nohup.out"
        sleep 3
        adb shell am force-stop com.myterm
        sleep 1
        adb shell "monkey -p com.myterm -v 1"
        adb shell "am start -n com.myterm/.HomeActivity"
        # if (( i % 2 == 0 )); then
        #     adb shell "am start -n com.myterm/.HomeActivity --display 1"
        # else
        #     adb "timeout 30 shell am start -n com.myterm/.HomeActivity --display 0"
        # fi
        sleep 4
        adb shell input keyevent 66
        sleep 1
        adb shell input keyevent 61 && adb shell input keyevent 61 && adb shell input keyevent 66
        # echo "cool"
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
        # sleep 500
        adb shell input keyevent KEYCODE_APP_SWITCH
        # sleep 1
        # adb shell input keyevent KEYCODE_DPAD_DOWN
        # sleep 1
        # adb shell input keyevent KEYCODE_ENTER
        sleep 1
        adb shell input keyevent KEYCODE_HOME
        # sleep 1
        # adb shell am start -n com.samsung.rtlassistant/.TransparentView 
        # sleep 1
        # adb shell am start com.samsung.rtlassistant
        if adb shell "run-as com.myterm test ! -s /data/data/com.myterm/files/home/verusMinings/nohup.out"; then
            echo "File is empty. Script not running in termux"
        else
            if adb shell "run-as com.myterm cat /data/data/com.myterm/files/home/verusMinings/nohup.out | grep -q 'CANNOT'" ; then
                echo "Miner dependacy issue"
            else
                echo "Script is running in termux"
                # sleep 500
                exit 0
                break
            fi
        fi
done
echo "Mining script did not start after 5 attempts."
exit 1