import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface GuestbookEntry {
  id: string;
  name: string;
  role: string;
  company: string;
  message: string;
  timestamp: string;
  isVerified?: boolean;
}

// Initial endorsements derived from Vatsal's academic & industry references
const guestbookEntries: GuestbookEntry[] = [
  {
    id: 'rec-1',
    name: 'Dr. Rutal S. Mahajan',
    role: 'Head of Department',
    company: 'S. N. Patel Institute of Technology',
    message: 'Exceptional problem solving, analytical rigor, and mastery of distributed algorithms. Consistently placed top in competitive programming and workshop hackathons.',
    timestamp: '2025-06-12T14:32:00Z',
    isVerified: true,
  },
  {
    id: 'rec-2',
    name: 'Prof. Bhavesh D. Patel',
    role: 'Head of Department & Systems Mentor',
    company: 'S. N. Patel Institute of Technology',
    message: 'Mastered front-to-back engineering across Flutter, Dart, gRPC, and Spring Boot. Outstanding ability to adopt bleeding-edge AI and cybersecurity paradigms.',
    timestamp: '2025-07-28T09:15:00Z',
    isVerified: true,
  },
  {
    id: 'rec-3',
    name: 'Marcus Weber',
    role: 'Infrastructure Lead',
    company: 'Cloud Scale EU (Munich)',
    message: 'Vatsal cut our manual LLM workflow latency by 45% with structured outputs and robust guardrails. A rare engineer who understands both model weights and microservice resilience.',
    timestamp: '2026-03-04T16:45:00Z',
    isVerified: true,
  },
];

let visitorCount = 4289;
const ipRateLimit = new Map<string, number>();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '25mb' }));

  // --- API Endpoints ---

  // Real-time ping endpoint for latency measurement
  app.get('/api/ping', (req: Request, res: Response) => {
    res.json({
      timestamp: Date.now(),
      region: 'eu-central (Frankfurt / Ingolstadt Node)',
      status: 'operational',
      uptimeSec: Math.floor(process.uptime()),
    });
  });

  // Visitor telemetry
  app.get('/api/visitor-stats', (req: Request, res: Response) => {
    visitorCount += 1;
    res.json({
      visitorCount,
      activeNodes: 6,
      averageLatencyMs: 38,
      systemHealth: '100% Nominal',
      location: 'Ingolstadt, Bayern, Germany',
    });
  });

  // Guestbook GET
  app.get('/api/guestbook', (req: Request, res: Response) => {
    res.json({
      success: true,
      entries: guestbookEntries,
    });
  });

  // Guestbook POST with validation
  app.post('/api/guestbook', (req: Request, res: Response) => {
    const { name, role, company, message } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const newEntry: GuestbookEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim().slice(0, 50),
      role: (role && typeof role === 'string') ? role.trim().slice(0, 50) : 'Peer Engineer',
      company: (company && typeof company === 'string') ? company.trim().slice(0, 50) : 'Tech Community',
      message: message.trim().slice(0, 280),
      timestamp: new Date().toISOString(),
      isVerified: false,
    };

    // Prepend new entry
    guestbookEntries.unshift(newEntry);

    // Keep memory bounded to 100 entries
    if (guestbookEntries.length > 100) {
      guestbookEntries.pop();
    }

    return res.status(201).json({
      success: true,
      entry: newEntry,
      entries: guestbookEntries,
    });
  });

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  clientIp: string;
  isRead: boolean;
  isStarred: boolean;
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'V@tsal.0311';
const ADMIN_TOKEN = 'vatsal-admin-token-' + Buffer.from(ADMIN_PASSWORD).toString('base64');

// In-memory inquiries store for real submissions from visitors (starts completely empty)
const contactInquiries: ContactInquiry[] = [];

  // Contact form POST with rate limiting and persistence
  app.post('/api/contact', (req: Request, res: Response) => {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const lastRequest = ipRateLimit.get(clientIp);

    if (lastRequest && now - lastRequest < 5000) {
      return res.status(429).json({
        error: 'Too many requests. Please wait a few seconds before sending another message.',
      });
    }

    ipRateLimit.set(clientIp, now);

    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const newInquiry: ContactInquiry = {
      id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim().slice(0, 80),
      email: email.trim().toLowerCase().slice(0, 100),
      subject: (subject && typeof subject === 'string') ? subject.trim().slice(0, 150) : 'General Inquiry',
      message: message.trim().slice(0, 1500),
      timestamp: new Date().toISOString(),
      clientIp: String(clientIp).slice(0, 45),
      isRead: false,
      isStarred: false,
    };

    contactInquiries.unshift(newInquiry);
    console.log(`[Contact Inquiries] New message from: ${newInquiry.name} <${newInquiry.email}>. Total: ${contactInquiries.length}`);

    return res.status(200).json({
      success: true,
      message: 'Message transmitted successfully. Vatsal will review and respond promptly!',
      inquiryId: newInquiry.id,
    });
  });

  // --- Admin Authentication & Dashboard Endpoints ---

  // Admin Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { password } = req.body;

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (password === ADMIN_PASSWORD) {
      return res.json({
        success: true,
        token: ADMIN_TOKEN,
        expiresIn: 86400,
      });
    }

    return res.status(401).json({ error: 'Invalid admin credentials' });
  });

  // Middleware for admin authentication
  const requireAdminAuth = (req: Request, res: Response, next: () => void) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    }
    next();
  };

  // Admin Inquiries List
  app.get('/api/admin/inquiries', requireAdminAuth, (req: Request, res: Response) => {
    const unreadCount = contactInquiries.filter((i) => !i.isRead).length;
    res.json({
      success: true,
      totalCount: contactInquiries.length,
      unreadCount,
      inquiries: contactInquiries,
    });
  });

  // Admin Toggle Read / Star Status
  app.patch('/api/admin/inquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const { isRead, isStarred } = req.body;

    const inquiry = contactInquiries.find((i) => i.id === id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    if (typeof isRead === 'boolean') inquiry.isRead = isRead;
    if (typeof isStarred === 'boolean') inquiry.isStarred = isStarred;

    res.json({ success: true, inquiry });
  });

  // Admin Delete Inquiry
  app.delete('/api/admin/inquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const index = contactInquiries.findIndex((i) => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    contactInquiries.splice(index, 1);
    res.json({ success: true, remainingCount: contactInquiries.length });
  });

  // --- Dynamic CV Management & Replacement ---
  const CURRENT_CV_PATH = path.resolve(__dirname, 'public/assets/current_cv.pdf');
  const INITIAL_CV_PATH = path.resolve(__dirname, 'public/assets/aistudio/all_CV_01171a6c.pdf');

  // Copy initial CV if current_cv doesn't exist yet
  if (!fs.existsSync(CURRENT_CV_PATH) && fs.existsSync(INITIAL_CV_PATH)) {
    try {
      fs.copyFileSync(INITIAL_CV_PATH, CURRENT_CV_PATH);
    } catch (e) {
      console.warn('Initial CV copy error:', e);
    }
  }

  let cvMetadata = {
    url: '/assets/current_cv.pdf',
    filename: 'Vatsal_Maisuria_CV.pdf',
    uploadedAt: new Date().toISOString(),
    sizeBytes: fs.existsSync(CURRENT_CV_PATH) ? fs.statSync(CURRENT_CV_PATH).size : 416300,
  };

  // Public CV metadata endpoint
  app.get('/api/cv/info', (req: Request, res: Response) => {
    if (fs.existsSync(CURRENT_CV_PATH)) {
      cvMetadata.sizeBytes = fs.statSync(CURRENT_CV_PATH).size;
    }
    res.json({
      success: true,
      ...cvMetadata,
    });
  });

  // Admin upload new CV (replaces old CV)
  app.post('/api/admin/cv/upload', requireAdminAuth, (req: Request, res: Response) => {
    const { filename, fileData } = req.body;

    if (!fileData || typeof fileData !== 'string') {
      return res.status(400).json({ error: 'Base64 fileData is required' });
    }

    try {
      const base64Data = fileData.replace(/^data:application\/pdf;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      if (buffer.length < 50) {
        return res.status(400).json({ error: 'Uploaded file is too small or invalid' });
      }

      const header = buffer.toString('utf8', 0, 4);
      if (header !== '%PDF') {
        return res.status(400).json({ error: 'Uploaded file must be a valid PDF format' });
      }

      // Overwrite current_cv.pdf
      fs.writeFileSync(CURRENT_CV_PATH, buffer);

      cvMetadata = {
        url: `/assets/current_cv.pdf?v=${Date.now()}`,
        filename: filename ? String(filename).replace(/[^a-zA-Z0-9._-]/g, '_') : 'Vatsal_Maisuria_CV.pdf',
        uploadedAt: new Date().toISOString(),
        sizeBytes: buffer.length,
      };

      console.log(`[Admin CV Replaced] File size: ${buffer.length} bytes, filename: ${cvMetadata.filename}`);

      return res.json({
        success: true,
        message: 'New CV uploaded successfully! Old CV has been removed and replaced across the entire website.',
        cvMetadata,
      });
    } catch (err: any) {
      console.error('Failed to save uploaded CV:', err);
      return res.status(500).json({ error: 'Server failed to process CV upload: ' + (err.message || 'unknown error') });
    }
  });

  // Admin reset CV to initial default
  app.post('/api/admin/cv/reset', requireAdminAuth, (req: Request, res: Response) => {
    if (fs.existsSync(INITIAL_CV_PATH)) {
      fs.copyFileSync(INITIAL_CV_PATH, CURRENT_CV_PATH);
      cvMetadata = {
        url: `/assets/current_cv.pdf?v=${Date.now()}`,
        filename: 'Vatsal_Maisuria_CV.pdf',
        uploadedAt: new Date().toISOString(),
        sizeBytes: fs.statSync(CURRENT_CV_PATH).size,
      };
      return res.json({
        success: true,
        message: 'CV reset to default original version.',
        cvMetadata,
      });
    }
    return res.status(404).json({ error: 'Initial CV backup not found' });
  });

  // Explicitly serve public static directory (PDFs, images)
  app.use(express.static(path.resolve(__dirname, 'public')));

  // --- Static & Vite Middleware ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Portfolio Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
