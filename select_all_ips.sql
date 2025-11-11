-- Get anomaly scores for all IPs
SELECT
  ipAddress,
  total_attempts,
  failed_attempts,
  CENTROID_ID as cluster,
  NEAREST_CENTROIDS_DISTANCE[OFFSET(0)].DISTANCE as anomaly_score
FROM ML.PREDICT(
  MODEL `chennai-geniai.splunk_analytics.anomaly_model`,
  (
    SELECT
      ipAddress,
      COUNT(*) as total_attempts,
      COUNTIF(status = 'failure') as failed_attempts,
      COUNT(DISTINCT userPrincipalName) as unique_users,
      COUNTIF(errorCode = 50126) as brute_force_errors
    FROM `chennai-geniai.splunk_analytics.raw_auth_logs`
    GROUP BY ipAddress
  )
)
ORDER BY anomaly_score DESC
LIMIT 10;

-- Get risk predictions
SELECT
  ipAddress,
  userPrincipalName,
  total_attempts,
  failures,
  predicted_high_risk,
  predicted_high_risk_probs[OFFSET(0)].prob as risk_score
FROM ML.PREDICT(
  MODEL `chennai-geniai.splunk_analytics.risk_model`,
  (
    SELECT
      ipAddress,
      userPrincipalName,
      COUNT(*) as total_attempts,
      COUNTIF(status = 'failure') as failures,
      COUNTIF(status = 'failure') / COUNT(*) as failure_rate
    FROM `chennai-geniai.splunk_analytics.raw_auth_logs`
    GROUP BY ipAddress, userPrincipalName
  )
)
WHERE predicted_high_risk = TRUE
ORDER BY risk_score DESC;
