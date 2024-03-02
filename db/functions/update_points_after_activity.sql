CREATE OR REPLACE FUNCTION update_points_after_activity()
RETURNS TRIGGER AS
$$
BEGIN
    -- Update the group's total points
    UPDATE groups SET total_points = total_points + NEW.points_earned
    WHERE group_id = NEW.group_id;

    -- Get house_id from the group
    DECLARE
        _house_id uuid;
    BEGIN
        SELECT house_id INTO _house_id FROM groups WHERE group_id = NEW.group_id;

        -- Update the house's total points
        UPDATE houses SET total_points = total_points + NEW.points_earned
        WHERE house_id = _house_id;

        RETURN NEW;
    END;
END;
$$
LANGUAGE plpgsql;
