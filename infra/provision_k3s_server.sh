# NOTE: Add these (same line, space separated) to /boot/cmdline./txt or /boot/firmware/cmdline.txt
# systemd.unified_cgroup_hierarchy=1 cgroup_enable=memory cgroup_memory=1

echo "[INFO] Switching to root user"
sudo su -

echo "[INFO] Installing k3s..."
curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" sh -s
echo "[INFO] Installed k3s successfully"

echo "[INFO] Getting node token from /var/lib/rancher/k3s/server/node-token"
NODE_TOKEN=$(sudo cat /var/lib/rancher/k3s/server/node-token)
echo "$NODE_TOKEN"