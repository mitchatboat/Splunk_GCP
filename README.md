# Splunk to GCP Analytics Dashboard

🎯 **Real-time security analytics dashboard with BigQuery ML integration**

Showcases the **4 Pillars of Analytics**:
1. **Descriptive**: What happened?
2. **Diagnostic**: Why did it happen?
3. **Predictive**: What will happen? (ML-powered)
4. **Prescriptive**: What should we do?

---

## 🚀 Quick Deploy to Cloud Run (5 minutes)

### Prerequisites
- ✅ BigQuery dataset `splunk_analytics` with `raw_auth_logs` table
- ✅ ML models trained (`anomaly_model`, `risk_model`)
- ✅ Google Cloud SDK installed and authenticated

### Deploy Steps

```bash
# 1. Upload to Cloud Shell
# Upload the entire nextjs-dashboard folder to Cloud Shell

# 2. Navigate to folder
cd nextjs-dashboard

# 3. Make deploy script executable
chmod +x deploy.sh

# 4. Deploy!
./deploy.sh
```

**That's it!** Your dashboard will be live in ~5 minutes at:
```
https://splunk-analytics-dashboard-XXXXX.run.app
```

---

## 🏗️ Local Development (Optional)

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Open: http://localhost:3000

---

## 📊 Features

### Real-Time Dashboard
- Auto-refreshes every 60 seconds
- Live event counters
- Timeline charts showing attack patterns

### 4 Pillars Visualization

**1. Descriptive Analytics**
- Total events, failures, unique IPs
- Timeline chart (successes vs failures)
- Top failed login attempts

**2. Diagnostic Analytics**
- Root cause analysis
- Spike period investigation
- Error code correlation

**3. Predictive Analytics**
- ML anomaly detection scores
- Risk prediction with probabilities
- Visual charts of threat levels

**4. Prescriptive Analytics**
- Automated recommendations
- Risk-based action prioritization
- One-click remediation (simulated)

---

## 🎨 Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Next.js API Routes
- **Database**: Google BigQuery
- **ML**: BigQuery ML (K-Means, Logistic Regression)
- **Deployment**: Google Cloud Run

---

## 📁 Project Structure

```
nextjs-dashboard/
├── app/
│   ├── api/analytics/          # API routes
│   │   ├── descriptive/
│   │   ├── diagnostic/
│   │   ├── predictive/
│   │   └── prescriptive/
│   ├── layout.js               # Root layout
│   ├── page.js                 # Main dashboard
│   └── globals.css             # Global styles
├── lib/
│   └── bigquery.js             # BigQuery client & queries
├── Dockerfile                  # Cloud Run container
├── deploy.sh                   # Deployment script
└── package.json                # Dependencies
```

---

## 🔧 Configuration

### Environment Variables

The app uses Application Default Credentials, so no additional auth setup needed when running on Cloud Run!

If running locally, set:
```bash
export GCP_PROJECT_ID="chennai-geniai"
gcloud auth application-default login
```

### BigQuery Schema Required

**Dataset**: `chennai-geniai.splunk_analytics`

**Table**: `raw_auth_logs`
```sql
- timestamp: TIMESTAMP
- userPrincipalName: STRING
- ipAddress: STRING
- status: STRING
- errorCode: INTEGER
- logType: STRING
```

**ML Models**:
- `anomaly_model` (K-Means clustering)
- `risk_model` (Logistic regression)

---

## 🎯 Demo Script (For Montana CIO)

### Opening (30 seconds)
*"This is our live security analytics dashboard, processing authentication logs in real-time on Google Cloud."*

### Descriptive (1 minute)
*"Here's what's happening right now: [point to stats]. This timeline shows authentication patterns over the past 24 hours. Notice the spike? Let's investigate..."*

### Diagnostic (1 minute)
*"Drilling down, we see IP 203.0.113.45 is responsible for the spike - 147 failed login attempts from user svc_acct_881. This is a brute force attack."*

### Predictive (1 minute)
*"Our BigQuery ML models detected this automatically. The anomaly score is 8.7 - very high. The risk prediction model gives this a 94% probability of being malicious."*

### Prescriptive (1 minute)
*"The system recommends: IMMEDIATE - Suspend account and block IP. We could automate this with one click, or integrate with your existing SIEM for automated response."*

### Close (30 seconds)
*"All of this - from ingestion to ML predictions - runs on BigQuery. Query time: 2.3 seconds to scan millions of events. Cost: ~$3/day for this demo scale."*

---

## 🔄 Continuous Updates

The dashboard auto-refreshes every 60 seconds. To manually refresh, click the refresh button in the header.

### To Update Data
```bash
# Data is live from BigQuery
# No manual refresh needed - queries run in real-time
```

### To Redeploy Dashboard
```bash
./deploy.sh
```

---

## 💰 Cost Estimate

**Cloud Run**:
- Free tier: 2 million requests/month
- Beyond: ~$0.40 per million requests

**BigQuery**:
- Storage: $0.02/GB/month (first 10GB free)
- Queries: $5/TB scanned
- For this demo: ~$3-5/day

**Total POC Cost**: ~$100-150/month

---

## 🐛 Troubleshooting

### Dashboard shows "Loading..." forever
```bash
# Check Cloud Run logs
gcloud run services logs read splunk-analytics-dashboard --region us-central1

# Common issue: BigQuery permissions
# Solution: Grant Cloud Run service account BigQuery Data Viewer role
```

### API errors in browser console
```bash
# Check API route logs
# Open browser DevTools → Network tab
# Click failing request → Response

# Usually: Missing ML models
# Solution: Run model training queries first
```

### Deploy fails
```bash
# Enable required APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com

# Check quota limits
gcloud compute project-info describe --project=chennai-geniai
```

---

## 📚 Additional Resources

- [BigQuery ML Docs](https://cloud.google.com/bigquery/docs/bqml-introduction)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

## ✅ Checklist for Demo

Before presenting:
- [ ] Dashboard loads without errors
- [ ] All 4 pillars show data
- [ ] Charts render correctly
- [ ] Refresh button works
- [ ] ML predictions display
- [ ] Recommendations show up

During demo:
- [ ] Start with big picture (4 pillars)
- [ ] Walk through each pillar in order
- [ ] Emphasize "real-time" and "automated"
- [ ] Show ML predictions
- [ ] End with actionable recommendations

---

## 🎉 You're Ready!

Your dashboard is now live on Cloud Run, powered by BigQuery ML, showcasing the full power of GCP for security analytics!

**Demo URL**: Check deploy.sh output after running

**Questions?** Check the troubleshooting section above.
