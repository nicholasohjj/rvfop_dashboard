-- Seed data for `houses`
INSERT INTO houses (name, total_points) VALUES
('Aonyx', 0),        -- A small-clawed otter
('Chelonia', 0),     -- A genus of turtle
('Manis', 0),        -- A genus of pangolins
('Orcaella', 0),     -- A genus of dolphin
('Panthera', 0),     -- A genus of big cats
('Rusa', 0),         -- A genus of deer
('Strix', 0);        -- A genus of owl

-- Dynamically insert groups for each house
-- For 'Aonyx'
INSERT INTO groups (name, house_id, total_points, isprohuman) VALUES
('A1', (SELECT house_id FROM houses WHERE name = 'Aonyx'), 0, false),
('A2', (SELECT house_id FROM houses WHERE name = 'Aonyx'), 0, false),
('A3', (SELECT house_id FROM houses WHERE name = 'Aonyx'), 0, false);

-- For 'Chelonia'
INSERT INTO groups (name, house_id, total_points, isprohuman) VALUES
('C1', (SELECT house_id FROM houses WHERE name = 'Chelonia'), 0, false),
('C2', (SELECT house_id FROM houses WHERE name = 'Chelonia'), 0, false),
('C3', (SELECT house_id FROM houses WHERE name = 'Chelonia'), 0, false);

-- For 'Manis'
INSERT INTO groups (name, house_id, total_points, isprohuman) VALUES
('M1', (SELECT house_id FROM houses WHERE name = 'Manis'), 0, false),
('M2', (SELECT house_id FROM houses WHERE name = 'Manis'), 0, false),
('M3', (SELECT house_id FROM houses WHERE name = 'Manis'), 0, false);

-- For 'Orcaella'
INSERT INTO groups (name, house_id, total_points, isprohuman) VALUES
('O1', (SELECT house_id FROM houses WHERE name = 'Orcaella'), 0, false),
('O2', (SELECT house_id FROM houses WHERE name = 'Orcaella'), 0, false),
('O3', (SELECT house_id FROM houses WHERE name = 'Orcaella'), 0, false);

-- For 'Panthera'
INSERT INTO groups (name, house_id, total_points, isprohuman) VALUES
('P1', (SELECT house_id FROM houses WHERE name = 'Panthera'), 0, false),
('P2', (SELECT house_id FROM houses WHERE name = 'Panthera'), 0, false),
('P3', (SELECT house_id FROM houses WHERE name = 'Panthera'), 0, false);

-- For 'Rusa'
INSERT INTO groups (name, house_id, total_points, isprohuman) VALUES
('R1', (SELECT house_id FROM houses WHERE name = 'Rusa'), 0, false),
('R2', (SELECT house_id FROM houses WHERE name = 'Rusa'), 0, false),
('R3', (SELECT house_id FROM houses WHERE name = 'Rusa'), 0, false);

-- For 'Strix'
INSERT INTO groups (name, house_id, total_points, isprohuman) VALUES
('S1', (SELECT house_id FROM houses WHERE name = 'Strix'), 0, false),
('S2', (SELECT house_id FROM houses WHERE name = 'Strix'), 0, false),
('S3', (SELECT house_id FROM houses WHERE name = 'Strix'), 0, false);