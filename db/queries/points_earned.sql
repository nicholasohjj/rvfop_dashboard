SELECT h.name AS house_name, g.name AS group_name, SUM(ga.points_earned) AS total_points_earned
FROM groupactivities ga
JOIN groups g ON ga.group_id = g.group_id
JOIN houses h ON g.house_id = h.house_id
GROUP BY h.name, g.name
ORDER BY h.name, total_points_earned DESC;
