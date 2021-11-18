# Linux 系统切换到 root 用户

在 Linux 系统中需要 root 权限执行命令，有两种方式可以做到，一种是使用 `sudo` 临时切获得 root 用户的权限，一种是使用 `su` 切换到 root 用户。

## sudo 命令

```bash
sudo
```

按照提示输入密码，就可以得到超级用户的权限，默认的情况下 5 分钟 root 权限就会失效。

## sudo -i

```bash
sudo -i
```

通过这种方法输入当前管理员用户的密码就可以进到 root 用户。

## sudo su

```bash
sudo su
```

效果同 `su`，只是不需要 root 的密码，而是需要当前用户的密码。

## su

如果想一直使用 root 权限，可以通过 su 切换到 root 用户。第一次切换到 root 时，需要设置 root 用户的密码：

```bash
sudo passwd root
```

键入密码，然后执行 `su root` ，输入刚才的密码。

```bash
su root
```

## 退出到用户权限

使用 `su username` 或者 `exit` 回到用户权限。

```bash
su username
# or
exit
```

## Keywords

`linux` `root` `su` `sudo` `管理员权限` `切换`
