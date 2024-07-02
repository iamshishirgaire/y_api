CREATE
OR REPLACE FUNCTION trigger_set_timestamps() 
RETURNS TRIGGER AS $$ 
BEGIN IF TG_OP = 'INSERT' 
THEN NEW.created_at = now();
NEW.updated_at = now();
ELSIF TG_OP = 'UPDATE' 
THEN NEW.updated_at = now();
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE rec RECORD;
BEGIN FOR rec IN (
    SELECT
        tablename
    FROM
        pg_tables
    WHERE
        schemaname = 'public'
) LOOP EXECUTE format(
    '
            CREATE TRIGGER set_timestamps_%I
            BEFORE INSERT OR UPDATE ON %I
            FOR EACH ROW
            EXECUTE PROCEDURE trigger_set_timestamps();',
    rec.tablename,
    rec.tablename
);
END LOOP;
END $$;