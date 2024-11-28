#!/bin/bash
check_pod_and_exec() {
    local attempt=0  # Initialize attempt counter
    local max_attempts=4  # Maximum number of attempts

    # Loop for up to 4 attempts
    while [ $attempt -lt $max_attempts ]; do
        # Increment attempt counter
        attempt=$((attempt + 1))
        
        # Get the pod status
        pod_status=$(kubectl get pods | tail -n +2 | awk '{print $3}' | head -n 1)
        
        # Check if the pod status is "Running"
        if [[ "$pod_status" == "Running" ]]; then
            # Get the pod name and execute the command inside the pod
            pod_name=$(kubectl get pods | tail -n +2 | awk '{print $1}' | head -n 1)
            echo "Pod is running. Executing command inside the pod..."
            kubectl exec -it "$pod_name" -- /bin/bash
            return 0  # Exit successfully after executing in the pod

        # Check if the pod status is "Pending"
        elif [[ "$pod_status" == "Pending" ]]; then
            # If the pod is pending, stop the script immediately
            echo "Pod is in 'Pending' state. Stopping the script."
            return 1  # Stop the script as pod is stuck in Pending state

        else
            # If pod is not running and not pending, wait 30 seconds and retry
            echo "Attempt $attempt: Pod is not running or pending. Waiting for 30 seconds..."
            sleep 30
        fi
    done

    # If we reach here, it means pod was not running after 4 attempts
    echo "Pod is not running after $max_attempts attempts. Exiting..."
    return 1  # Indicate failure after 4 retries
}
ARG_VALUE=$1
if [ -z "$ARG_VALUE" ]; then
  echo "Error: You must provide a value to replace 'argss'."
  exit 1
fi
kubeadm init --apiserver-advertise-address $(hostname -i) > out.txt 2>&1
export KUBECONFIG=/etc/kubernetes/admin.conf
$(grep -A 1 "kubeadm join" out.txt)
kubectl apply -f https://github.com/weaveworks/weave/releases/download/v2.8.1/weave-daemonset-k8s-1.11.yaml
sed -i "s/argss/$ARG_VALUE/" d.yaml
kubectl apply -f d.yaml
sleep 90
# kubectl exec -it $(kubectl get pods | tail -n +2 | awk '{print $1}' | head -n 1) -- /bin/bash
check_pod_and_exec