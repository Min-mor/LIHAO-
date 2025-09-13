# 关于本仓库
## 前言
## 一、本仓库使用方法
 首先需要先在电脑上安装 Git 推荐使用 scoop 安装所需环境，安装所需工具的简易教程，请参考工具安装部分，安装完毕之后，在空白文件夹内右键使用 Git Bash Here 输入以下代码，即可完成所需操作。

 ````markdown
 ## 拉取整个仓库
 git clone http://154.222.28.16:3000/Top_Gun/Group_Work 
 
 ## 以下是提交
 ## 此操作是把文件夹下面的文件都添加进来
 git add . 
 
 ## “提交信息”里面换成你需要，如“first commit”
 git commit -m "提交信息" 

 ## 把本地仓库push到gitea上面
 git push origin master 
 ````

 也可使用 VSCode 上的 Git 功能，各取所需。如果想使用 VSCode 在此之前，请务必先拉取整个仓库之后，再使用。
 
 小结，多人协作的工作模式通常是这样：
 - 拉取源仓库的代码到本地
 - 创建本地 dev 分支
 - 在本地开发
 - 推送自己的修改，最好注明此次推送修改的内容
 - 如果推送失败，则因为远程分支比你的本地更新
 - 如果合并有冲突，则解决冲突，并在本地提交
 - 没有冲突或者解决掉冲突后，再次尝试推送
 - 如果提示 “no tracking information” ，则说明本地分支和远程分支的链接关系没有创建

## 仓库结构

````
./
├── assets/           #通用资源
├── backend/          #前端
├── frontend/         #后端
````

## 文档排版
  
### 1. 排版规范

#### 中英文标点

说明：在文档编写中，必须注意中英文标点符号的使用，在中文的文档中不要出现中英文符号混用的情况。常见符号，如下

| 说明   | 中文 | 英文 |
| ------ | ---- | ---- |
| 逗号   | ，   | ,    |
| 句号   | 。   | .    |
| 分号   | ；   | ;    |
| 问号   | ？   | ?    |
| 感叹号 | ！   | !    |

示例：

```markdown
## 错误写法 ❌
作为一名程序员,日常大部分的时间主要在埋头编码、调试.

## 推荐写法 ✅
作为一名程序员，日常大部分的时间主要在埋头编码、调试。
```



#### 专用名词拼写

示例：

```markdown
## 错误写法 ❌
我热爱 java 编程语言！

## 推荐写法 ✅
我热爱 Java 编程语言！
```



#### 英文左右空格

说明：遇到英文字符或单词，请在左右都加上空格，让文本阅读更加舒适。无论在文档还是平面设计中这也是规范之一，特别是苹果的设计语言中我们都可以看到这一点。

示例：

```markdown
## 错误写法 ❌
窄带LED背光组件使 MacBook Pro支持P3广色域显示，为照片和视频带来绚丽逼真的色彩。

## 推荐写法 ✅
窄带 LED 背光组件使 MacBook Pro 支持 P3 广色域显示，为照片和视频带来绚丽逼真的色彩。
```



#### 使用代码块和代码高亮

 ```markdown
## 代码高亮
先定位到你的目录，然后输入命令 `ls -al` 即可列出该目录下的所有文件。

## 代码块
​```java
public class HelloWorld {
       public static void main(String[] args) {
              System.out.println("我的第一个Java程序：Hello World。");
       }
}
​```
 ``` 

## 工具推荐以及安装方式

### Scoop 

#### 为什么使用 Scoop

在 Windows 下，搭建开发环境一直是一个复杂且困难的问题。由于没有一个统一的标准，导致各种开发环境的安装方式差异巨大，需要付出很多不必要的时间成本。而 Scoop 可以帮助你统一安装并管理常见的开发软件，省去了手动下载安装，配置环境变量等繁琐步骤。

例如安装 python 和 nodejs 只需要执行：

````
scoop install python
scoop install nodejs
````

#### 安装 Scoop

Scoop 需要 [Windows PowerShell 5.1](https://aka.ms/wmf5download) 或者 [PowerShell](https://aka.ms/powershell) 作为运行环境，如果你使用的是 Windows 10 及以上版本，Windows PowerShell 是内置在系统中的。而 Windows 7 内置的 Windows PowerShell 版本过于陈旧，你需要手动安装新版本的 PowerShell。

````
# 设置 PowerShell 执行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# 下载安装脚本
irm get.scoop.sh -outfile 'install.ps1'
# 执行安装, --ScoopDir 参数指定 Scoop 安装路径
.\install.ps1 -ScoopDir 'C:\Scoop'
````

#### 使用 Scoop
Scoop 的官方文档对于新手非常友好，推荐阅读 [官方文档](https://github.com/ScoopInstaller/Scoop) 或 [快速入门](https://github.com/ScoopInstaller/Scoop/wiki/Quick-Start) 。
### Git
推荐 [直接阅读](https://ideepspace.gitbooks.io/git/content/) 主要关注里面的分支管理以及里面的 *第五部分* 。