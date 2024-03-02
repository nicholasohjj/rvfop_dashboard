-- Seed data for `groupactivities` linking groups with activities
INSERT INTO groupactivities (group_id, activity_id, completion_status, points_earned, tm_created)
VALUES
  ((SELECT group_id FROM groups WHERE name = 'O1'), (SELECT activity_id FROM activities WHERE name = 'Ice Breaker Session'), false, 0, now()),
  ((SELECT group_id FROM groups WHERE name = 'O1'), (SELECT activity_id FROM activities WHERE name = 'Campus Tour'), false, 0, now()),
  ((SELECT group_id FROM groups WHERE name = 'O2'), (SELECT activity_id FROM activities WHERE name = 'Team Building Games'), false, 0, now()),
  -- Add additional entries for each group and activity combination as needed
  ((SELECT group_id FROM groups WHERE name = 'O3'), (SELECT activity_id FROM activities WHERE name = 'Residential Life Orientation'), false, 0, now()),
  ((SELECT group_id FROM groups WHERE name = 'O3'), (SELECT activity_id FROM activities WHERE name = 'Sustainability Workshop'), false, 0, now());

-- Note: Replace 'G1', 'G2', 'G3', etc., with the actual group names from your database.
-- Similarly, replace activity names with those specific to your orientation programme.
