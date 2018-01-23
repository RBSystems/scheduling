drop table if exists events;
create table events (
  id integer primary key autoincrement,
  _end_timezone text,
  _start_timezone text,
  adjacent_meeting_count integer,
  allow_new_time_proposal numeric
  appointment_reply_time numeric,
  appointment_sequence_number integer,
  body text,
  changekey text,
  conference_type integer,
  conflicting_meeting_count integer,
  culture text,
  datetime_created numeric,
  datetime_received numeric,
  datetime_sent numeric,
  display_to text,
  duration text,
  end text,
  has_attachments numeric,
  importance text,
  is_all_day numeric,
  is_associated numeric,
  is_cancelled numeric,
  is_draft numeric,
  is_from_me numeric,
  is_meeting numeric,
  is_recurring numeric,
  is_resend numeric,
  is_response_requested numeric,
  is_submitted numeric,
  is_unmodified numeric,
  item_class text,
  item_id text,
  last_modified_name text,
  last_modified_time numeric,
  legacy_free_busy_status text,
  location text,
  meeting_request_was_sent numeric,
  mime_content text,
  my_response_type text,
  reminder_due_by numeric,
  reminder_is_set numeric,
  reminder_minutes_before_start integer,
  sensitivity text,
  size integer,
  start text,
  subject text,
  text_body text,
  type text,
  uid text not null
);
create unique index eventsuid ON events(uid);