CREATE OR REPLACE MODEL `chennai-geniai.splunk_analytics.anomaly_model`
OPTIONS(
  model_type='KMEANS',
  num_clusters=3,
  distance_type='EUCLIDEAN'
) AS
SELECT
  ipAddress,
  COUNT(*) as total_attempts,
  COUNTIF(status = 'failure') as failed_attempts,
  COUNT(DISTINCT userPrincipalName) as unique_users,
  COUNTIF(errorCode = 50126) as brute_force_errors
FROM `chennai-geniai.splunk_analytics.raw_auth_logs`
GROUP BY ipAddress
HAVING total_attempts > 5;
