SELECT h.name AS house_name, g.name AS group_name, g.total_points
FROM groups g
JOIN houses h ON g.house_id = h.house_id
ORDER BY h.name, g.total_points DESC;
