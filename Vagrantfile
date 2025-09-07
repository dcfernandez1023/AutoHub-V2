# Vagrantfile — Debian 12
# Uses vagrant-disksize to set primary disk sizes on creation.
# Machines:
#   - server  : 1 CPU, 2GB  RAM, 20GB disk, 192.168.56.11
#   - node-0  : 1 CPU, 2GB  RAM, 20GB disk, 192.168.56.21
#   - node-1  : 1 CPU, 2GB  RAM, 20GB disk, 192.168.56.22

# Enabling legacy iptables
# sudo iptables-legacy -F
# sudo ip6tables-legacy -F
# sudo update-alternatives --set iptables /usr/sbin/iptables-legacy
# sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
# sudo reboot


Vagrant.configure("2") do |config|
  # Base image
  config.vm.box = "debian/bookworm64"
  # Optional: speed up runs a bit and avoid syncing the project dir
  config.vm.synced_folder ".", "/vagrant", disabled: true
  # Optional: silence update check
  config.vagrant.plugins = ["vagrant-disksize"]

  # ---------- Control-plane server ----------
  config.vm.define "server" do |m|
    m.vm.hostname = "server"
    m.vm.network "private_network", ip: "192.168.56.11"
    m.disksize.size = "20GB"
    m.vm.provider "virtualbox" do |vb|
      vb.name   = "server"
      vb.cpus   = 2
      vb.memory = 2048
      vb.gui    = false
    end
      m.vm.provision "shell", inline: <<-SHELL
        set -eux
        apt-get update
        apt-get install -y curl ca-certificates gnupg lsb-release
        modprobe overlay || true
        modprobe br_netfilter || true
        cat >/etc/sysctl.d/kubernetes.conf <<EOF
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
        sysctl --system
        swapoff -a || true
        sed -ri 's/^([^#].*swap)/# \\1/' /etc/fstab || true
      SHELL
  end

  # ---------- Worker node-0 ----------
  config.vm.define "node-0" do |m|
    m.vm.hostname = "node-0"
    m.vm.network "private_network", ip: "192.168.56.21"
    m.disksize.size = "20GB"
    m.vm.provider "virtualbox" do |vb|
      vb.name   = "node-0"
      vb.cpus   = 2
      vb.memory = 2048
      vb.gui    = false
    end
      m.vm.provision "shell", inline: <<-SHELL
        set -eux
        apt-get update
        apt-get install -y curl ca-certificates gnupg lsb-release
        modprobe overlay || true
        modprobe br_netfilter || true
        cat >/etc/sysctl.d/kubernetes.conf <<EOF
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
        sysctl --system
        swapoff -a || true
        sed -ri 's/^([^#].*swap)/# \\1/' /etc/fstab || true
      SHELL
  end

  # ---------- Worker node-1 ----------
  config.vm.define "node-1" do |m|
    m.vm.hostname = "node-1"
    m.vm.network "private_network", ip: "192.168.56.22"
    m.disksize.size = "20GB"
    m.vm.provider "virtualbox" do |vb|
      vb.name   = "node-1"
      vb.cpus   = 2
      vb.memory = 2048
      vb.gui    = false
    end
      m.vm.provision "shell", inline: <<-SHELL
        set -eux
        apt-get update
        apt-get install -y curl ca-certificates gnupg lsb-release
        modprobe overlay || true
        modprobe br_netfilter || true
        cat >/etc/sysctl.d/kubernetes.conf <<EOF
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
        sysctl --system
        swapoff -a || true
        sed -ri 's/^([^#].*swap)/# \\1/' /etc/fstab || true
      SHELL
  end
end
