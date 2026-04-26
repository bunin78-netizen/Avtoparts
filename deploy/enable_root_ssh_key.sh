#!/bin/sh
set -eu

key='ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMekQ3dmn5MKJ9nbWagecCfH/4VzW2+QUFmkzcuM46gI cursor-autoparts-deploy'

mkdir -p /root/.ssh
chmod 700 /root/.ssh
touch /root/.ssh/authorized_keys
if ! grep -qxF "$key" /root/.ssh/authorized_keys; then
  printf '%s\n' "$key" >> /root/.ssh/authorized_keys
fi
chmod 600 /root/.ssh/authorized_keys
chown -R root:root /root/.ssh

if [ -f /etc/ssh/sshd_config ]; then
  cp /etc/ssh/sshd_config /etc/ssh/sshd_config.cursor.bak
  sed -i 's/^[#[:space:]]*PubkeyAuthentication .*/PubkeyAuthentication yes/' /etc/ssh/sshd_config
  sed -i 's/^[#[:space:]]*PermitRootLogin .*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
  grep -q '^PubkeyAuthentication ' /etc/ssh/sshd_config || printf '\nPubkeyAuthentication yes\n' >> /etc/ssh/sshd_config
  grep -q '^PermitRootLogin ' /etc/ssh/sshd_config || printf '\nPermitRootLogin prohibit-password\n' >> /etc/ssh/sshd_config
fi

systemctl reload ssh 2>/dev/null || systemctl reload sshd 2>/dev/null || service ssh reload 2>/dev/null || service sshd reload 2>/dev/null || true
echo OK
