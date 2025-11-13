CREATE DATABASE IF NOT EXISTS music_festival;
USE music_festival;

CREATE TABLE IF NOT EXISTS festivals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  festival_name VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional sample data
INSERT INTO festivals (festival_name) VALUES
('Mulungushi Music Fest'),
('Rock Zambia 2025'),
('Jazz Fusion Night'),
('Campus Soundwave'),
('Cultural Beats 2025');
