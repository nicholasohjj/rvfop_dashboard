CREATE OR REPLACE FUNCTION check_isprohuman()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM groups
        WHERE group_id = NEW.deductor_id AND isprohuman = true
    ) THEN
        RAISE EXCEPTION 'deductor_id does not meet isprohuman requirement.';
    END IF;

     IF NOT EXISTS (
        SELECT 1 FROM groups
        WHERE group_id = NEW.group_id AND isprohuman = false
    ) THEN
        RAISE EXCEPTION 'group_id does not meet isprohuman = false requirement.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM groups
        WHERE group_id = NEW.deductor_id
        AND total_points < NEW.points_deducted
    ) THEN
        RAISE EXCEPTION 'points_deducted exceeds total_points for deductor_id.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM groups
        WHERE group_id = NEW.group_id
        AND total_points < NEW.points_deducted -- This assumes a similar constraint applies; adjust as necessary.
    ) THEN
        RAISE EXCEPTION 'points_deducted exceeds total_points for group_id.';
    END IF;

    RETURN NEW;



END;
$$ LANGUAGE plpgsql;

DROP TRIGGER trigger_check_isprohuman ON deductions;


CREATE TRIGGER trigger_check_isprohuman
BEFORE INSERT OR UPDATE ON deductions
FOR EACH ROW EXECUTE FUNCTION check_isprohuman();
