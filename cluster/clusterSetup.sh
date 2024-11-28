#!/bin/bash
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
kubectl exec -it $(kubectl get pods | tail -n +2 | awk '{print $1}' | head -n 1) -- /bin/bash