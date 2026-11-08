CREATE TABLE step_entries (
                              id        UUID PRIMARY KEY,
                              user_id   UUID    NOT NULL REFERENCES users (id) ON DELETE CASCADE,
                              step_date DATE    NOT NULL,
                              steps     INTEGER NOT NULL CHECK (steps >= 0),
                              CONSTRAINT uq_step_entries_user_date UNIQUE (user_id, step_date)
);