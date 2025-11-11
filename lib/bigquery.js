// lib/bigquery.js
const { BigQuery } = require('@google-cloud/bigquery');

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'chennai-geniai';
const DATASET = 'splunk_analytics';

const bigquery = new BigQuery({
  projectId: PROJECT_ID,
});

// Descriptive Analytics: Current state
async function getDescriptiveAnalytics() {
  const query = `
    SELECT
      COUNT(*) as total_events,
      COUNTIF(status = 'failure') as total_failures,
      COUNTIF(status = 'success') as total_successes,
      COUNT(DISTINCT ipAddress) as unique_ips,
      COUNT(DISTINCT userPrincipalName) as unique_users,
      ROUND(COUNTIF(status = 'failure') / COUNT(*) * 100, 2) as failure_rate
    FROM \`${PROJECT_ID}.${DATASET}.raw_auth_logs\`
  `;

  const [rows] = await bigquery.query(query);
  return rows[0];
}

// Top Failed Login Sources
async function getTopFailedLogins() {
  const query = `
    SELECT
      ipAddress,
      userPrincipalName,
      COUNT(*) as failed_attempts,
      MIN(timestamp) as first_seen,
      MAX(timestamp) as last_seen
    FROM \`${PROJECT_ID}.${DATASET}.raw_auth_logs\`
    WHERE status = 'failure'
    GROUP BY ipAddress, userPrincipalName
    HAVING failed_attempts > 5
    ORDER BY failed_attempts DESC
    LIMIT 10
  `;

  const [rows] = await bigquery.query(query);
  return rows;
}

// Diagnostic Analytics: Root cause analysis
async function getDiagnosticAnalysis() {
  const query = `
    WITH failure_spikes AS (
      SELECT
        TIMESTAMP_TRUNC(timestamp, HOUR) as hour,
        COUNT(*) as failures
      FROM \`${PROJECT_ID}.${DATASET}.raw_auth_logs\`
      WHERE status = 'failure'
      GROUP BY hour
      HAVING failures > 10
    )
    SELECT
      l.ipAddress,
      l.userPrincipalName,
      COUNT(*) as failure_count,
      ARRAY_AGG(DISTINCT l.errorCode IGNORE NULLS) as error_codes,
      STRING_AGG(DISTINCT l.logType, ', ' LIMIT 3) as log_types
    FROM \`${PROJECT_ID}.${DATASET}.raw_auth_logs\` l
    INNER JOIN failure_spikes s ON TIMESTAMP_TRUNC(l.timestamp, HOUR) = s.hour
    WHERE l.status = 'failure'
    GROUP BY l.ipAddress, l.userPrincipalName
    ORDER BY failure_count DESC
    LIMIT 10
  `;

  const [rows] = await bigquery.query(query);
  return rows;
}

// Predictive Analytics: ML-based anomaly detection
async function getPredictiveAnalytics() {
  const query = `
    SELECT
      ipAddress,
      total_attempts,
      failed_attempts,
      CENTROID_ID as cluster,
      NEAREST_CENTROIDS_DISTANCE[OFFSET(0)].DISTANCE as anomaly_score
    FROM ML.PREDICT(
      MODEL \`${PROJECT_ID}.${DATASET}.anomaly_model\`,
      (
        SELECT
          ipAddress,
          COUNT(*) as total_attempts,
          COUNTIF(status = 'failure') as failed_attempts,
          COUNT(DISTINCT userPrincipalName) as unique_users,
          COUNTIF(errorCode = 50126) as brute_force_errors
        FROM \`${PROJECT_ID}.${DATASET}.raw_auth_logs\`
        GROUP BY ipAddress
      )
    )
    ORDER BY anomaly_score DESC
    LIMIT 15
  `;

  const [rows] = await bigquery.query(query);
  return rows;
}

// Risk Predictions
async function getRiskPredictions() {
  const query = `
    SELECT
      ipAddress,
      userPrincipalName,
      total_attempts,
      failures,
      predicted_high_risk,
      predicted_high_risk_probs[OFFSET(0)].prob as risk_score
    FROM ML.PREDICT(
      MODEL \`${PROJECT_ID}.${DATASET}.risk_model\`,
      (
        SELECT
          ipAddress,
          userPrincipalName,
          COUNT(*) as total_attempts,
          COUNTIF(status = 'failure') as failures,
          COUNTIF(status = 'failure') / COUNT(*) as failure_rate
        FROM \`${PROJECT_ID}.${DATASET}.raw_auth_logs\`
        GROUP BY ipAddress, userPrincipalName
      )
    )
    WHERE predicted_high_risk = TRUE
    ORDER BY risk_score DESC
    LIMIT 10
  `;

  const [rows] = await bigquery.query(query);
  return rows;
}

// Prescriptive Analytics: Recommendations
async function getPrescriptiveRecommendations() {
  const query = `
    WITH risk_assessment AS (
      SELECT
        ipAddress,
        userPrincipalName,
        COUNT(*) as total_events,
        COUNTIF(status = 'failure') as auth_failures,
        COUNTIF(errorCode = 50126) as brute_force_attempts,
        MAX(timestamp) as last_activity
      FROM \`${PROJECT_ID}.${DATASET}.raw_auth_logs\`
      GROUP BY ipAddress, userPrincipalName
    )
    SELECT
      ipAddress,
      userPrincipalName,
      total_events,
      auth_failures,
      brute_force_attempts,
      last_activity,
      CASE
        WHEN auth_failures > 50 THEN 95
        WHEN auth_failures > 20 THEN 85
        WHEN auth_failures > 10 THEN 70
        ELSE 50
      END as risk_score,
      CASE
        WHEN auth_failures > 50 THEN 'IMMEDIATE: Suspend account and block IP address'
        WHEN auth_failures > 20 THEN 'HIGH PRIORITY: Quarantine user and investigate'
        WHEN auth_failures > 10 THEN 'MEDIUM: Enable MFA and alert security team'
        ELSE 'LOW: Continue monitoring'
      END as recommended_action,
      CASE
        WHEN auth_failures > 50 THEN TRUE
        ELSE FALSE
      END as trigger_automated_action
    FROM risk_assessment
    WHERE auth_failures > 0
    ORDER BY risk_score DESC, auth_failures DESC
    LIMIT 20
  `;

  const [rows] = await bigquery.query(query);
  return rows;
}

// Timeline data for charts
async function getTimelineData() {
  const query = `
    SELECT
      TIMESTAMP_TRUNC(timestamp, HOUR) as hour,
      COUNT(*) as total_events,
      COUNTIF(status = 'failure') as failures,
      COUNTIF(status = 'success') as successes
    FROM \`${PROJECT_ID}.${DATASET}.raw_auth_logs\`
    GROUP BY hour
    ORDER BY hour DESC
    LIMIT 24
  `;

  const [rows] = await bigquery.query(query);
  return rows.reverse(); // Oldest first for timeline
}

module.exports = {
  getDescriptiveAnalytics,
  getTopFailedLogins,
  getDiagnosticAnalysis,
  getPredictiveAnalytics,
  getRiskPredictions,
  getPrescriptiveRecommendations,
  getTimelineData,
};
