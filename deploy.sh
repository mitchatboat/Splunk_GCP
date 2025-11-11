#!/bin/bash
# deploy.sh - Deploy Next.js dashboard to Cloud Run

set -e

PROJECT_ID="chennai-geniai"
SERVICE_NAME="splunk-analytics-dashboard"
REGION="us-central1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Deploying Splunk Analytics Dashboard to Cloud Run..."
echo "================================================"
echo "Project: $PROJECT_ID"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo "================================================"
echo ""

# Set project
echo "📋 Setting GCP project..."
gcloud config set project $PROJECT_ID

# Build and push Docker image
echo ""
echo "🐳 Building Docker image..."
gcloud builds submit --tag $IMAGE_NAME

# Deploy to Cloud Run
echo ""
echo "☁️  Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --timeout 60 \
  --set-env-vars GCP_PROJECT_ID=$PROJECT_ID

# Get the service URL
echo ""
echo "================================================"
echo "✅ Deployment complete!"
echo "================================================"
echo ""
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
echo "🌐 Dashboard URL: $SERVICE_URL"
echo ""
echo "📊 Open your dashboard:"
echo "   $SERVICE_URL"
echo ""
echo "🔄 To redeploy, run: ./deploy.sh"
echo ""
