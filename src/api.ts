let protocol = 'http://';
let server = 'dev.skinreader.cn'; // 开发服务器公网IP

if (process.env.NODE_ENV === 'production') {
  protocol = window.location.protocol + '//';
  server = window.location.host.replace(/:\d+/, '') + (window.location.port ? `:${window.location.port}` : '');
}
const api = {
  // 服务器地址
  server: protocol + server,
  // graphql地址
  graphql: protocol + server + '/graphql',
  // 图片地址
  imageSrc: protocol + server + '/doctor_images/',
};

export default api;
