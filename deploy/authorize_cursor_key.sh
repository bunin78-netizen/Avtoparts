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
echo OK
