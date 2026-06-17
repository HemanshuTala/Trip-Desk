-- Insert sample trips
INSERT INTO trips (name, destination, start_date, end_date, price_including_gst, total_seats, status, description) VALUES
('Himalayan Village Walk', 'Spiti Valley', '2025-06-15', '2025-06-22', 45000.00, 12, 'open', 'A slow walk through ancient villages in Spiti. Stay with local families, learn their crafts, and understand mountain life at its own pace.'),
('Coastal Foraging Journey', 'Goa', '2025-07-10', '2025-07-16', 38000.00, 8, 'open', 'Learn to identify and cook with coastal ingredients. Morning foraging walks, afternoon cooking sessions with local fishermen.'),
('Desert Star Camp', 'Rajasthan', '2025-08-05', '2025-08-11', 52000.00, 10, 'open', 'Sleep under the desert sky, learn astronomy from local guides, and experience the quiet beauty of the Thar desert.'),
('Coffee Trail Walk', 'Coorg', '2025-09-20', '2025-09-26', 42000.00, 14, 'closed', 'Walk through coffee plantations, understand the bean-to-cup process, and stay in heritage plantation homes.');

-- Insert sample leads
INSERT INTO leads (name, phone, email, trip_id, group_type, preferred_month, vibe_description) VALUES
('Priya Sharma', '+91 98765 43210', 'priya.sharma@email.com', 
 (SELECT id FROM trips WHERE name = 'Himalayan Village Walk'), 
 'solo', 'June 2025', 'I want to disconnect from city life and experience something authentic. Not looking for tourist spots, just real village life.'),
('Rahul Menon', '+91 87654 32109', 'rahul.menon@email.com',
 (SELECT id FROM trips WHERE name = 'Coastal Foraging Journey'),
 'friends', 'July 2025', 'A group of 4 friends who love cooking. We want to learn about local ingredients and cook together.'),
('Ananya Desai', '+91 76543 21098', 'ananya.desai@email.com',
 (SELECT id FROM trips WHERE name = 'Desert Star Camp'),
 'couple', 'August 2025', 'Our anniversary trip. We love stargazing and want something quiet and romantic.'),
('Vikram Singh', '+91 65432 10987', 'vikram.singh@email.com',
 (SELECT id FROM trips WHERE name = 'Himalayan Village Walk'),
 'family', 'June 2025', 'Family with 2 kids (12 and 15). Want them to see a different way of life and learn from local communities.');

-- Insert sample call logs
INSERT INTO call_logs (lead_id, notes, next_action) VALUES
((SELECT id FROM leads WHERE name = 'Priya Sharma'), 
 'Initial call. She is very interested in the Spiti trip. Works in tech, needs a break. Flexible with dates.',
 'Send detailed itinerary and follow up in 3 days'),
((SELECT id FROM leads WHERE name = 'Rahul Menon'),
 'Spoke with Rahul. Group of 4 confirmed. All love cooking. Asked about dietary restrictions.',
 'Send menu options and confirm dates'),
((SELECT id FROM leads WHERE name = 'Ananya Desai'),
 'Ananya called. Anniversary in August. Desert camp perfect for them. Asked about accommodation privacy.',
 'Send photos of camp setup and discuss privacy options');
