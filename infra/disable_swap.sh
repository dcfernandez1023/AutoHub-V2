swapoff -a
systemctl disable --now dphys-swapfile
dphys-swapfile uninstall 2>/dev/null || sudo rm -f /var/swap

# Verify
swapon --show
free -h