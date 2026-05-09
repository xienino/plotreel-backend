# 后端工程开发需求（对接前端plotreel）

## 1. 基础配置

- 运行端口：127.0.0.1:47845（需匹配前端proxy）；
- 支持环境：开发环境（dev）、测试环境（test）；
- 跨域：允许前端域名的跨域请求（前端是react-scripts启动的本地服务，默认端口3000）；
- 数据格式：所有接口返回JSON，统一格式：
  {
  "code": 200, // 200成功/非200失败
  "data": {},   // 业务数据
  "resMsg": [""]     // 提示信息
  }

## 2. 核心接口（按前端页面/功能拆分）

### 示例：用户模块

- 接口1: 检查是否更新

  - 请求方式: POST
  - 路径：/pnt/api/upgrade/last
  - 请求参数：无
  - 返回data: {data:{resData:{remark:Boolean, upgradeType: Boolean}}}
- 接口2: 获取mtk

  - 请求方式：POST
  - 路径：/videomaker/aihost/getMtk
  - 请求参数：无
  - 返回data:{resData:{password:String,account: String,mtk:String}}

## 3. 技术栈要求（可选，指定后端技术）

- 后端框架：Node.js Express；
- 数据库：MongoDB；
- 其他：需要接口参数校验、日志记录、简单的权限校验（如token验证）。

安装依赖：
npm install
启动开发环境：
npm run dev
启动生产/测试环境：
npm start
或 NODE_ENV=test npm start
