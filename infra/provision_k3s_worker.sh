# Usage: ./provision_k3s_worker.sh <NODE_TOKEN> <SERVER_IP> <NODE_NAME>

# Check that we got 3 arguments
if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <NODE_TOKEN> <SERVER_IP> <NODE_NAME>"
  exit 1
fi

NODE_TOKEN="$1"
SERVER_IP="$2"
NODE_NAME="$3"

echo "[INFO] Using NODE_TOKEN=$NODE_TOKEN"
echo "[INFO] Using SERVER_IP=$SERVER_IP"
echo "[INFO] Using NODE_NAME=$NODE_NAME"

# Run the k3s install command
curl -sfL https://get.k3s.io | \
  K3S_TOKEN="$NODE_TOKEN" \
  K3S_URL="https://$SERVER_IP:6443" \
  K3S_NODE_NAME="$NODE_NAME" \
  sh -

# ./provision_k3s_worker.sh K101482635da961a4ad6832e8c73005ad82db9e17261649f04217b63d812a09b09b::server:e80f1ac985f89183cdf45a9ce477282a 10.0.0.97 node0