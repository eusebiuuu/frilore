CREATE TABLE user_table (
  user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(500) NOT NULL DEFAULT '',
  real_name VARCHAR(20) NOT NULL DEFAULT '',
  email VARCHAR(100) UNIQUE CONSTRAINT email_validation CHECK (email ~ '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'),
  country VARCHAR(50) NOT NULL DEFAULT 'Romania',
  role VARCHAR(30) NOT NULL DEFAULT '',
  birthday DATE,
  image_public_id VARCHAR(200),
  image_url VARCHAR(300) NOT NULL DEFAULT 'https://res.cloudinary.com/dwgihvjqj/image/upload/v1692532441/frilore/abstract-user-flat-4_pl9jts.png',
  google_id VARCHAR(100) UNIQUE,
  github_id VARCHAR(100) UNIQUE,
  description VARCHAR(500) NOT NULL DEFAULT '',
  last_login TIMESTAMP DEFAULT NOW()
);

CREATE TABLE project (
  project_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(300) NOT NULL,
  chat_id SERIAL UNIQUE NOT NULL,
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
  chat SERIAL NOT NULL REFERENCES project(chat_id) ON DELETE CASCADE,
  content VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE list (
  list_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  order_num INT,
  project UUID REFERENCES project(project_id) ON DELETE CASCADE
);

CREATE TABLE task (
  task_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  order_num INT,
  description VARCHAR(500) NOT NULL,
  priority VARCHAR(30) CONSTRAINT priority_constraint CHECK (priority = 'low' OR priority = 'high'),
  status VARCHAR(30) CONSTRAINT status_constraint CHECK 
    (status = 'pending' OR status = 'completed' OR status = 'to do'),
  deadline VARCHAR(20) NOT NULL DEFAULT '2023-04-02',
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
  user_id UUID REFERENCES user_table(user_id) ON DELETE CASCADE,
  content VARCHAR(100) NOT NULL,
  seen BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);