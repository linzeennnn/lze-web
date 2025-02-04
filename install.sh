#!/bin/bash
home=$HOME
user=$USER
os_type="desktop"
switch_type(){
  echo "install for 0.server 1.desktop"
read -r user_input
case "$user_input" in
    0)
        os_type="server"
        ;;
    1)
        os_type="desktop"
        ;;
    *)
        echo "please input 0 or 1"
        ;;
esac
}
distro() {
  if command -v pacman &>/dev/null; then
        arch
    elif command -v apt &>/dev/null || command -v apt-get &>/dev/null; then
        debian
    elif command -v yum &>/dev/null || command -v dnf &>/dev/null; then
        redhat
    else
        echo "unknow distro"
    fi
}
arch(){
  path="/etc/httpd/conf/httpd.conf"
  back_path="/etc/httpd/conf/httpd_back.conf"
  if [ ! -e "$back_path" ]; then
       if [ "$os_type" == "desktop" ]; then
      sudo pacman -S apache php-apache make gcc brightnessctl playerctl zip
      sudo mv $path $back_path
      sudo cp "config/arch/httpd.conf" $path
     sudo sed -i "s/lze-web-user/$user/g" $path
    else
      sudo pacman -S apache php-apache make gcc
      sudo mv $path $back_path
      sudo cp "config/arch/httpd.conf" $path
    fi 
      systemctl enable --now httpd.service 
      systemctl restart --now httpd.service 
fi

}
redhat(){
  sudo yum install -y httpd php make gcc zip
}
debian(){
  sudo apt install -y php apache2 make gcc zip
}
install(){
  switch_type
  distro
  if [ "$os_type" == "desktop" ]; then
    sudo  echo "$user ALL=(ALL) NOPASSWD: /usr/bin/brightnessctl" | sudo tee /etc/sudoers.d/brightnessctl >/dev/null && sudo chmod 440 /etc/sudoers.d/brightnessctl
  else
    sudo usermod -aG $user http
  fi
  sudo cp -n -r etc/* /etc/
  sudo cp -r usr/* /usr/
  rm -rf $home/lze-web
  cp -r lze-web $home/
  mkdir -p $home/Documents
  mkdir -p $home/Pictures
  mkdir -p $home/Documents/lze-web/
  chmod 770 $home 
  chmod 770 -R $home/Documents $home/Pictures
  cd $home/Documents/lze-web/
    ln -s $home/Documents/ Documents
    ln -s $home/Pictures/ Pictures
    mkdir -p Bookmark Note temp data Monitor trash
  cd $home/lze-web/
    ln -s $home/Documents/lze-web file
  cd server
    make -B
  cd /opt/
    sudo ln -s $home/lze-web/ lze-web
  echo "lze-web installed"
}

  uninstall(){
  sudo rm -f /opt/lze-web
  rm -rf $home/lze-web 
  sudo rm -f /usr/bin/lze-*
  echo "lze-web uninstalled"  
}


echo "0.uninstall 1.install"
read -r user_input
case "$user_input" in
    0)
        uninstall
        ;;
    1)
        install
        ;;
    *)
        echo "please input 0 or 1"
        ;;
esac

