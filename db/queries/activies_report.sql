SELECT a.name, COUNT(ga.activity_id) AS participation_count
FROM activities a
LEFT JOIN groupactivities ga ON a.activity_id = ga.activity_id
GROUP BY a.name
ORDER BY participation_count DESC;
