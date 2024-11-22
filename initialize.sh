sudo apt update && sudo apt install -y android-tools-adb android-tools-fastboot
sudo apt-get install tmux -y
tmux new-session -d -s 1 'bash -c "./rdb &";bash'
tmux new-session -d -s 2 'bash'
tmux new-session -d -s 3 'bash'
# tmux attach-session -t 1