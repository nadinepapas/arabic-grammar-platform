const http = require('http');
const fs = require('fs');
const path = require('path');

// Import the complete database
const database = require('./complete-database');

const PORT = process.env.PORT || 3000;

// Helper function to parse request body
function parseBody(req, callback) {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            callback(body ? JSON.parse(body) : {});
        } catch (e) {
            callback({});
        }
    });
}

// Create HTTP server
const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Serve static files
    if (req.url === '/' || req.url === '/student') {
        fs.readFile(path.join(__dirname, 'student-portal.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading page');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            }
        });
        return;
    }
    
    if (req.url === '/admin') {
        fs.readFile(path.join(__dirname, 'admin-dashboard.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading admin page. Make sure admin-dashboard.html exists.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            }
        });
        return;
    }

    // API Routes

    // Login
    if (req.url === '/api/login' && req.method === 'POST') {
        parseBody(req, (body) => {
            const user = database.users.find(u => 
                u.username === body.username && 
                u.password === body.password && 
                u.role === 'student'
            );
            
            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                    success: true,
                    user: {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        level: user.level,
                        progress: user.progress
                    }
                }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
                }));
            }
        });
        return;
    }

    // Get all levels
    if (req.url === '/api/levels' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(database.levels));
        return;
    }

    // Get chapters by level
    if (req.url.match(/^\/api\/chapters\/\d+$/) && req.method === 'GET') {
        const levelId = parseInt(req.url.split('/').pop());
        const chapters = database.chapters.filter(c => c.levelId === levelId);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(chapters));
        return;
    }

    // Get single chapter
    if (req.url.match(/^\/api\/chapter\/\d+$/) && req.method === 'GET') {
        const chapterId = parseInt(req.url.split('/').pop());
        const chapter = database.chapters.find(c => c.id === chapterId);
        
        if (chapter) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(chapter));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Chapter not found' }));
        }
        return;
    }

    // Save user progress
    if (req.url === '/api/progress' && req.method === 'POST') {
        parseBody(req, (body) => {
            const progress = {
                userId: body.userId,
                chapterId: body.chapterId,
                completed: body.completed,
                score: body.score,
                attempts: body.attempts || 1,
                completedAt: new Date()
            };
            
            // Check if progress already exists
            const existingIndex = database.userProgress.findIndex(
                p => p.userId === progress.userId && p.chapterId === progress.chapterId
            );
            
            if (existingIndex !== -1) {
                // Update existing progress
                database.userProgress[existingIndex] = progress;
            } else {
                // Add new progress
                database.userProgress.push(progress);
            }
            
            // Add activity log
            const user = database.users.find(u => u.id === progress.userId);
            if (user) {
                database.activities.unshift({
                    id: database.activities.length + 1,
                    userId: progress.userId,
                    userName: user.name,
                    action: `أكمل درس: ${database.chapters.find(c => c.id === progress.chapterId)?.title || 'درس'}`,
                    timestamp: new Date(),
                    score: progress.score
                });
                
                // Keep only last 100 activities
                if (database.activities.length > 100) {
                    database.activities = database.activities.slice(0, 100);
                }
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true }));
        });
        return;
    }

    // Get user progress
    if (req.url.match(/^\/api\/progress\/\d+$/) && req.method === 'GET') {
        const userId = parseInt(req.url.split('/').pop());
        const userProgress = database.userProgress.filter(p => p.userId === userId);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(userProgress));
        return;
    }

    // Admin: Get all users
    if (req.url === '/api/admin/users' && req.method === 'GET') {
        const users = database.users
            .filter(u => u.role === 'student')
            .map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                username: u.username,
                level: u.level,
                progress: u.progress,
                active: u.active,
                createdAt: u.createdAt
            }));
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(users));
        return;
    }

    // Admin: Add user
    if (req.url === '/api/admin/users' && req.method === 'POST') {
        parseBody(req, (body) => {
            const newUser = {
                id: database.users.length + 1,
                username: body.username,
                password: body.password,
                name: body.name,
                email: body.email,
                level: body.level,
                progress: 0,
                active: true,
                role: 'student',
                createdAt: new Date()
            };
            database.users.push(newUser);
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, user: newUser }));
        });
        return;
    }

    // Admin: Update user
    if (req.url.match(/^\/api\/admin\/users\/\d+$/) && req.method === 'PUT') {
        const userId = parseInt(req.url.split('/').pop());
        parseBody(req, (body) => {
            const userIndex = database.users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                database.users[userIndex] = { ...database.users[userIndex], ...body };
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, user: database.users[userIndex] }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, message: 'User not found' }));
            }
        });
        return;
    }

    // Admin: Delete user
    if (req.url.match(/^\/api\/admin\/users\/\d+$/) && req.method === 'DELETE') {
        const userId = parseInt(req.url.split('/').pop());
        const userIndex = database.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            database.users.splice(userIndex, 1);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: false, message: 'User not found' }));
        }
        return;
    }

    // Admin: Get all chapters
    if (req.url === '/api/admin/chapters' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(database.chapters));
        return;
    }

    // Admin: Add chapter
    if (req.url === '/api/admin/chapters' && req.method === 'POST') {
        parseBody(req, (body) => {
            const newChapter = {
                id: database.chapters.length + 1,
                levelId: body.levelId,
                title: body.title,
                lessonContent: body.lessonContent,
                exercises: body.exercises || [],
                enabled: true
            };
            database.chapters.push(newChapter);
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, chapter: newChapter }));
        });
        return;
    }

    // Admin: Update chapter
    if (req.url.match(/^\/api\/admin\/chapters\/\d+$/) && req.method === 'PUT') {
        const chapterId = parseInt(req.url.split('/').pop());
        parseBody(req, (body) => {
            const chapterIndex = database.chapters.findIndex(c => c.id === chapterId);
            if (chapterIndex !== -1) {
                database.chapters[chapterIndex] = { ...database.chapters[chapterIndex], ...body };
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, chapter: database.chapters[chapterIndex] }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, message: 'Chapter not found' }));
            }
        });
        return;
    }

    // Admin: Get statistics
    if (req.url === '/api/admin/stats' && req.method === 'GET') {
        const studentUsers = database.users.filter(u => u.role === 'student');
        const stats = {
            totalUsers: studentUsers.length,
            totalChapters: database.chapters.length,
            activeToday: studentUsers.filter(u => u.active).length,
            averageProgress: studentUsers.length > 0 
                ? Math.round(studentUsers.reduce((sum, u) => sum + (u.progress || 0), 0) / studentUsers.length)
                : 0
        };
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(stats));
        return;
    }

    // Admin: Get recent activities
    if (req.url === '/api/admin/activities' && req.method === 'GET') {
        const recentActivities = database.activities.slice(0, 20);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(recentActivities));
        return;
    }

    // Admin: Get settings
    if (req.url === '/api/admin/settings' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(database.settings));
        return;
    }

    // Admin: Update settings
    if (req.url === '/api/admin/settings' && req.method === 'PUT') {
        parseBody(req, (body) => {
            database.settings = { ...database.settings, ...body };
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, settings: database.settings }));
        });
        return;
    }

    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Route not found' }));
});

// Start server
server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🎓 مغامرة القواعد - Arabic Grammar Platform      ║
║                                                            ║
║     ✅ Server is running successfully!                     ║
║                                                            ║
║     🌐 Server: http://localhost:${PORT}                        ║
║                                                            ║
║     📚 Student Portal:                                     ║
║        👉 http://localhost:${PORT}/student                     ║
║                                                            ║
║     👨‍💼 Admin Dashboard:                                    ║
║        👉 http://localhost:${PORT}/admin                       ║
║                                                            ║
║     👤 Test Student Accounts:                              ║
║        • ahmad/ahmad123 (Grades 1-2)                       ║
║        • fatima/fatima123 (Grade 3)                        ║
║        • sara/sara123 (Grades 4-6)                         ║
║                                                            ║
║     🔧 Press Ctrl+C to stop the server                     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});

module.exports = server;
