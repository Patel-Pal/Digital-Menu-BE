const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173', 'https://digital-menu-builder.vercel.app','https://digital-menu-fe.vercel.app','https://digitalmenu.devinpro.co.in'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io available globally
global.io = io;

// Socket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_shop', (shopId) => {
    socket.join(`shop_${shopId}`);
    console.log(`Socket ${socket.id} joined shop_${shopId}`);
  });
  
  socket.on('join_customer', (deviceId) => {
    socket.join(`customer_${deviceId}`);
    console.log(`Socket ${socket.id} joined customer_${deviceId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173', 'https://digital-menu-builder.vercel.app','https://digital-menu-fe.vercel.app','https://digitalmenu.devinpro.co.in'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/menus', require('./routes/menus'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/menu-items', require('./routes/menuItems'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/billing', require('./routes/billing'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Digital Menu API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
