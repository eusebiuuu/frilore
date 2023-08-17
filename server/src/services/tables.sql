CREATE TABLE user_table (
  user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(20) NOT NULL UNIQUE,
  real_name VARCHAR(20) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE, -- add constraint
  country VARCHAR(30) NOT NULL,
  role VARCHAR(30) NOT NULL,
  birthday DATE,
  description VARCHAR(500) NOT NULL,
  is_verified BOOLEAN DEFAULT TRUE
);

CREATE TABLE project (
  project_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  description VARCHAR(300) NOT NULL,
  last_updates VARCHAR(100)[] NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE registration (
  registration_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES project ON DELETE CASCADE,
  user_id UUID REFERENCES user_table ON DELETE CASCADE,
  is_leader BOOLEAN DEFAULT FALSE
);
ALTER TABLE registration ADD CONSTRAINT UQ_registration UNIQUE(project_id, user_id);

CREATE TABLE message (
  message_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author UUID NOT NULL REFERENCES user_table(user_id) ON DELETE CASCADE,
  chat_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  content VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE list (
  list_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  project UUID REFERENCES project(project_id) ON DELETE CASCADE
);

CREATE TABLE task (
  task_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  priority VARCHAR(30) CONSTRAINT priority_constraint CHECK (priority = 'low' OR priority = 'high'),
  status VARCHAR(30) CONSTRAINT status_constraint CHECK 
    (status = 'pending' OR status = 'completed' OR status = 'to do'),
  deadline DATE NOT NULL,
  list UUID REFERENCES list(list_id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE assignment (
  assignment_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_table(user_id) ON DELETE CASCADE,
  task UUID REFERENCES task(task_id) ON DELETE CASCADE,
  type VARCHAR(30) CONSTRAINT type_constraint CHECK (type = 'reporter' OR type = 'assignee')
);
ALTER TABLE assignment ADD CONSTRAINT UQ_assignment UNIQUE(task, user_id);

CREATE TABLE notification (
  notification_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author UUID REFERENCES user_table(user_id) ON DELETE CASCADE,
  description VARCHAR(100) NOT NULL,
  type VARCHAR(50) CONSTRAINT notif_type_constr CHECK ()
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);