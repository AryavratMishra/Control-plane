const http = require('http');
const fs = require('fs');
const path = require('path');
const { router } = require('./server/routes/router');

const PORT = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, 'public');
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml' };

const server = http.createServer(async (req,res)=>{
  if (req.url.startsWith('/api/')) return router(req,res);
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  const file = pathname === '/' ? path.join(publicDir,'index.html') : path.join(publicDir, pathname.replace(/^\//,''));
  if (!file.startsWith(publicDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200,{ 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
server.listen(PORT,()=>console.log(`ControlPlane v3 running at http://localhost:${PORT}`));
