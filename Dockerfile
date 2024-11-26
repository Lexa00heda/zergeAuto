# Use the official lightweight Debian-based image
FROM debian:bullseye-slim

# Set environment variables
WORKDIR /app
ENV DEBIAN_FRONTEND=noninteractive
ENV ANDROID_SDK_HOME=/app/.android
ENV HOME=/app


RUN apt-get update && \
apt-get install -y procps && \
apt-get clean

# Install dependencies
RUN apt-get update && apt-get install -y \
curl \
git \
bash \
ca-certificates \
&& apt-get clean

# RUN mkdir -p /app && rm -rf /app/*


RUN git clone https://github.com/Lexa00heda/zergeAuto.git .
RUN git config --global --add safe.directory /app
# Install Node.js (latest version from NodeSource repository)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs \
  && apt-get clean

RUN apt-get update && \
  apt-get install -y \
  android-tools-adb \
  android-tools-fastboot \
  tmux \
  && apt-get clean

  
RUN mkdir -p /app/.android && \
  chmod 777 /app/.android

# Set the working directory inside the container

# Clone the GitHub repository (replace <repository_url> with actual repo URL)

RUN chmod 777 /app/user.json
RUN chmod 777 /app/cookies/cookies*.txt

EXPOSE 5037

# Set up environment variables if needed
ENV ADB_HOST=localhost
ENV ADB_PORT=5037
# Make the initialize.sh script executable
# RUN  ./initialize.sh

# Default command to run the initialize script and node index.js
ENTRYPOINT ["bash", "-c", "/app/initializecentos.sh && tmux new-session -d -s 4 'node index.js $1' && sleep infinity"]

# # Allow the user to pass arguments to the container (overrides default CMD)
# CMD ["--defaultArgument=value"]
