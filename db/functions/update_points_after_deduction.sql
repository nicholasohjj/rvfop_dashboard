CREATE OR REPLACE FUNCTION update_points_after_deduction()
RETURNS TRIGGER AS $$
BEGIN
    -- Decrease total_points for the group_id
    UPDATE groups
    SET total_points = total_points - NEW.points_deducted
    WHERE group_id = NEW.group_id;

    -- If deductor_id is different from group_id, decrease its total_points as well
    IF NEW.deductor_id IS DISTINCT FROM NEW.group_id THEN
        UPDATE groups
        SET total_points = total_points - NEW.points_deducted
        WHERE group_id = NEW.deductor_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
