# Install EPEL repository for additional packages (CentOS 7)
sudo yum install epel-release -y

# Install Android tools and tmux
sudo yum install android-tools -y
sudo yum install tmux -y

# Create tmux sessions
tmux new-session -d -s 1 'bash -c "./rdb &"; bash'  # Start session 1
tmux new-session -d -s 2 'bash'  # Start session 2
tmux new-session -d -s 3 'bash'  # Start session 3

# Attach to session 1 (if needed)
# tmux attach-session -t 1
