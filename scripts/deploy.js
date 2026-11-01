import { NodeSSH } from 'node-ssh'
import dotenv from 'dotenv'

// 加载.env文件中的环境变量
dotenv.config()

const ssh = new NodeSSH()

// 远程部署目录
const remoteDir = '/opt/shenxiu-music-ui'

// 执行SSH命令函数
async function executeCommand(ssh, command) {
  try {
    console.log(`执行命令: ${command}`)
    const result = await ssh.execCommand(command)

    // 输出stderr的内容用于调试，但不以此判断失败
    if (result.stderr) {
      console.log(`命令输出信息: ${result.stderr}`)
    }

    // 主要根据退出码来判断命令是否成功执行
    if (result.code === 0) {
      return true
    } else {
      console.error(`命令执行失败，退出码: ${result.code}`)
      return false
    }
  } catch (error) {
    console.error(`命令执行异常: ${error.message}`)
    return false
  }
}

// 构建并部署Docker镜像
async function buildAndDeployDocker(ssh) {
  try {
    // 进入部署目录
    const cdCommand = `cd ${remoteDir}`

    // 停止并删除旧容器
    console.log('停止并删除旧容器...')
    await executeCommand(
      ssh,
      `${cdCommand} && docker stop shenxiu-music || true && docker rm shenxiu-music || true`
    )

    // 删除旧镜像
    console.log('删除旧镜像...')
    await executeCommand(ssh, `${cdCommand} && docker rmi shenxiu-music-image || true`)

    // 构建新镜像
    console.log('构建新镜像...')
    const buildSuccess = await executeCommand(
      ssh,
      `${cdCommand} && docker build --no-cache -t shenxiu-music-image .`
    )
    if (!buildSuccess) {
      console.error('构建镜像失败')
      return false
    }

    // 运行新容器
    console.log('运行新容器...')
    const runSuccess = await executeCommand(
      ssh,
      `${cdCommand} && docker run -d --name shenxiu-music -p 81:81 shenxiu-music-image`
    )
    if (!runSuccess) {
      console.error('启动容器失败')
      return false
    }

    // 清理虚悬镜像
    console.log('清理虚悬镜像...')
    await executeCommand(ssh, 'docker image prune -f')

    return true
  } catch (error) {
    console.error('Docker部署过程中发生错误:', error.message)
    return false
  }
}

// 上传和部署一体化函数
async function deploy() {
  try {
    console.log('开始连接服务器...')

    // 连接到云服务器 从环境变量中读取
    await ssh.connect({
      host: process.env.SSH_HOST,
      port: process.env.SSH_PORT,
      username: process.env.SSH_USERNAME,
      password: process.env.SSH_PASSWORD
    })

    console.log('连接成功，开始上传...')

    // 确保远程部署目录存在并归属于当前SSH用户（/opt 默认root所有，直接SFTP上传会权限不足）
    console.log('确保远程部署目录存在...')
    const ensureDir = await executeCommand(
      ssh,
      `sudo mkdir -p ${remoteDir} && sudo chown -R ${process.env.SSH_USERNAME}:${process.env.SSH_USERNAME} ${remoteDir}`
    )
    if (!ensureDir) {
      console.error('无法创建远程部署目录')
      return
    }

    // 上传Dockerfile
    console.log('上传Dockerfile...')
    await ssh.putFile('./Dockerfile', `${remoteDir}/Dockerfile`)

    // 上传default.conf
    console.log('上传default.conf...')
    await ssh.putFile('./default.conf', `${remoteDir}/default.conf`)

    // 上传dist目录
    const localPath = './dist'
    const remotePath = `${remoteDir}/dist`

    console.log('上传dist目录...')
    const uploadSuccess = await ssh.putDirectory(localPath, remotePath, {
      recursive: true,
      concurrency: 5,
      validate: () => true // 默认全部文件上传
    })

    if (uploadSuccess) {
      console.log('上传成功')

      // 执行Docker部署
      console.log('开始部署...')
      const deploySuccess = await buildAndDeployDocker(ssh)
      if (deploySuccess) {
        console.log('部署完成!')
      } else {
        console.error('部署失败!')
      }
    } else {
      console.error('上传失败')
    }
  } catch (e) {
    console.error('部署过程中发生错误:', e)
  } finally {
    // 关闭SSH连接
    if (ssh.isConnected()) {
      ssh.dispose()
      console.log('SSH连接已关闭')
    }
  }
}

// 执行部署
deploy()
