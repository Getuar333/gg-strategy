# G.G Strategy - Deployment Guide

## 🌐 Production Deployment

### Frontend Deployment Options

#### Option 1: Netlify (Recommended)

1. **Build the project:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Connect to Netlify:**
   - Visit https://netlify.com
   - Click "New site from Git"
   - Connect GitHub/GitLab/Bitbucket
   - Choose repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Deploy!

3. **Environment Variables:**
   - In Netlify Dashboard → Site Settings → Build & Deploy → Environment
   - Add: `VITE_API_URL=https://your-backend-api.com`

#### Option 2: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Set environment variables in Vercel dashboard**

#### Option 3: AWS S3 + CloudFront

1. **Build:**
   ```bash
   npm run build
   ```

2. **Upload to S3:**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

### Backend Deployment Options

#### Option 1: Render (Recommended)

1. **Push to GitHub**
2. **Create Render Account:** https://render.com
3. **Create Web Service:**
   - Repository: Select your GitHub repo
   - Branch: main
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Environment Variables:**
   ```
   DB_HOST=your-rds-endpoint
   DB_USER=dbuser
   DB_PASSWORD=dbpassword
   DB_NAME=gg_strategy
   JWT_SECRET=your-long-random-secret
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=https://your-frontend.netlify.app
   NODE_ENV=production
   ```

#### Option 2: Heroku

1. **Install Heroku CLI**
2. **Login:** `heroku login`
3. **Create app:** `heroku create your-app-name`
4. **Set environment variables:**
   ```bash
   heroku config:set DB_HOST=...
   ```
5. **Deploy:** `git push heroku main`

#### Option 3: DigitalOcean App Platform

1. **Create DigitalOcean Account**
2. **Create App from GitHub**
3. **Configure environment**
4. **Deploy**

### Database Deployment

#### AWS RDS

1. **Create RDS MySQL Instance**
2. **Configure Security Groups** (allow from backend)
3. **Run SQL schema:**
   ```bash
   mysql -h your-rds-endpoint -u admin -p < database/gg_strategy.sql
   ```

#### DigitalOcean Databases

1. **Create MySQL Cluster**
2. **Get connection string**
3. **Import schema**

#### Google Cloud SQL

1. **Create Cloud SQL Instance**
2. **Configure connectivity**
3. **Import database

## 🔐 Production Checklist

### Security
- [ ] Change JWT_SECRET to long random string
- [ ] Use strong database password
- [ ] Enable HTTPS everywhere
- [ ] Set CORS to specific domain
- [ ] Enable database encryption at rest
- [ ] Use environment variables for all secrets
- [ ] Enable database backups
- [ ] Set up database monitoring
- [ ] Use prepared statements (already done)
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Enable logging and monitoring

### Performance
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Implement database query optimization
- [ ] Enable caching headers
- [ ] Minify and bundle frontend
- [ ] Use database indexes (already configured)
- [ ] Monitor API response times
- [ ] Set up auto-scaling if needed

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Enable application monitoring
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up alerts for critical errors
- [ ] Monitor database performance
- [ ] Track application metrics

## 📊 Production Environment Variables

### Backend `.env` (Production)

```env
# Database
DB_HOST=production-rds-endpoint.amazonaws.com
DB_USER=dbadmin
DB_PASSWORD=YourLongStrongPassword123!
DB_NAME=gg_strategy
DB_PORT=3306

# JWT
JWT_SECRET=your-long-random-secret-key-minimum-32-characters
JWT_EXPIRE=7d

# Server
PORT=80
NODE_ENV=production

# Email
EMAIL_USER=noreply@ggstrategy.com
EMAIL_PASS=your-gmail-app-password

# URLs
FRONTEND_URL=https://www.ggstrategy.com
API_URL=https://api.ggstrategy.com
```

## 🚀 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy G.G Strategy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy Frontend to Netlify
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      run: |
        cd frontend
        npm install
        npm run build
        npx netlify-cli deploy --prod --dir=dist
    
    - name: Deploy Backend to Render
      env:
        RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
      run: |
        # Render auto-deploys on push to main
        echo "Backend deployment triggered"
```

## 🌍 Domain Setup

### Frontend Domain

1. **Get domain:** namecheap.com, Google Domains, etc.
2. **Update DNS:**
   - For Netlify: Point to Netlify DNS
   - For Vercel: Use Vercel nameservers
   - For S3: Point to CloudFront distribution

### Backend Domain

1. **Create API subdomain:** api.ggstrategy.com
2. **Point to Render/Heroku deployment**
3. **Set up HTTPS (Let's Encrypt)**

## 📈 Scaling Considerations

### Database
- Enable read replicas for high traffic
- Implement query optimization
- Use connection pooling
- Regular maintenance and backups

### Backend
- Enable auto-scaling groups
- Use load balancers
- Implement caching (Redis)
- Monitor resource usage

### Frontend
- Use CDN for static assets
- Implement lazy loading
- Code splitting
- Cache invalidation strategy

## 🔍 Monitoring & Alerts

### Sentry Setup (Error Tracking)

1. **Create Sentry account:** sentry.io
2. **Backend integration:**
   ```javascript
   import * as Sentry from "@sentry/node";
   Sentry.init({ dsn: "your-sentry-dsn" });
   app.use(Sentry.Handlers.errorHandler());
   ```

### Datadog/New Relic (APM)

1. **Install monitoring agent**
2. **Configure dashboards**
3. **Set up alerts**

## 🆘 Rollback Plan

If deployment fails:

1. **Frontend:** Netlify/Vercel has one-click rollback
2. **Backend:** Git revert and redeploy
3. **Database:** Point to backup and restore if needed

```bash
# Rollback backend
git revert HEAD
git push
# Redeploy from your platform
```

## 📞 Support & Maintenance

### Regular Maintenance
- Update dependencies monthly
- Security patches immediately
- Database optimization quarterly
- Log review weekly

### Contact & Support
- Monitor status page
- Set up team alerts
- Document runbooks
- Regular backup testing

---

**Ready for production! 🎉**
