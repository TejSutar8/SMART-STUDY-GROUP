CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  college VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Subjects (
  id SERIAL PRIMARY KEY,
  subject_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE UserSubjects (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES Users(id) ON DELETE CASCADE,
  subject_id INT REFERENCES Subjects(id) ON DELETE CASCADE,
  skill_level VARCHAR(40) NOT NULL,
  availability_time VARCHAR(40) NOT NULL,
  UNIQUE(user_id, subject_id)
);

CREATE TABLE StudyGroups (
  id SERIAL PRIMARY KEY,
  group_name VARCHAR(120) NOT NULL,
  subject_id INT REFERENCES Subjects(id),
  schedule_time VARCHAR(40) NOT NULL,
  created_by INT REFERENCES Users(id)
);

CREATE TABLE GroupMembers (
  id SERIAL PRIMARY KEY,
  group_id INT REFERENCES StudyGroups(id) ON DELETE CASCADE,
  user_id INT REFERENCES Users(id) ON DELETE CASCADE,
  UNIQUE(group_id, user_id)
);

CREATE TABLE Messages (
  id SERIAL PRIMARY KEY,
  group_id INT REFERENCES StudyGroups(id) ON DELETE CASCADE,
  user_id INT REFERENCES Users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Ratings (
  id SERIAL PRIMARY KEY,
  group_id INT REFERENCES StudyGroups(id) ON DELETE CASCADE,
  rated_user INT REFERENCES Users(id) ON DELETE CASCADE,
  rating INT NOT NULL,
  feedback TEXT
);
