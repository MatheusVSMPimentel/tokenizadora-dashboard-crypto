CREATE DATABASE IF NOT EXISTS userclient;
CREATE USER IF NOT EXISTS 'usrclient'@'%' IDENTIFIED BY 'SenhaDoUsuario123';
GRANT ALL PRIVILEGES ON userclient.* TO 'usrclient'@'%';
FLUSH PRIVILEGES;
