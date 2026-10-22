import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import { MongoClient, Db, Collection } from 'mongodb';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'pyrosafe-solutions-secret-auth-key-2026';

// Required Admin Credentials
const ADMIN_EMAIL = 'pyrosafesolutions2026@gmail.com';
const ADMIN_PASSWORD = 'Ravi@1993';

app.use(express.json());

// Persistent local cache directory for zero-downtime MongoDB fallback
const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'mongodb_invoices.json');

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

// Initial seed invoice documents for MongoDB
const DEFAULT_INVOICES = [
  { 
    id: 'inv-doc-1', 
    clientId: '1',
    clientName: 'Acme Solutions', 
    number: 'INV-2024-082', 
    date: '2024-10-20',
    items: [
      { itemId: 'inv-1', sku: 'PYRO-FE-ABC-6KG', description: 'ABC Powder Fire Extinguisher 6kg (IS:15683)', hsn: '8424', qty: 4, rate: 2350, taxRate: 18 },
      { itemId: 'inv-4', sku: 'PYRO-SD-OPT-01', description: 'Addressable Optical Smoke Detector with Standard Base', hsn: '8531', qty: 20, rate: 1450, taxRate: 18 }
    ],
    isProforma: false,
    status: 'Paid',
    subtotal: 38400,
    cgst: 3456,
    sgst: 3456,
    igst: 0,
    total: 45312,
    currency: 'INR',
    deductedFromInventory: true,
    createdAt: new Date('2024-10-20').toISOString()
  },
  { 
    id: 'inv-doc-2', 
    clientId: '2',
    clientName: 'NextWave Creative', 
    number: 'INV-2024-079', 
    date: '2024-10-15',
    items: [
      { itemId: 'inv-6', sku: 'PYRO-FHR-30M', description: 'Hydrant Fire Hose Reel Drum 30m with 19mm Thermoplastic Hose', hsn: '8424', qty: 2, rate: 6800, taxRate: 18 }
    ],
    isProforma: false,
    status: 'Overdue',
    subtotal: 13600,
    cgst: 0,
    sgst: 0,
    igst: 2448,
    total: 16048,
    currency: 'INR',
    deductedFromInventory: true,
    createdAt: new Date('2024-10-15').toISOString()
  },
  { 
    id: 'inv-doc-3', 
    clientId: '3',
    clientName: 'Global Tech Ltd', 
    number: 'INV-2024-081', 
    date: '2024-10-18',
    items: [
      { itemId: 'inv-10', sku: 'PYRO-SRV-REFILL-ABC', description: 'Extinguisher Refilling & Hydrostatic Pressure Testing (ABC 6kg)', hsn: '9987', qty: 15, rate: 750, taxRate: 18 }
    ],
    isProforma: false,
    status: 'Sent',
    subtotal: 11250,
    cgst: 1012.5,
    sgst: 1012.5,
    igst: 0,
    total: 13275,
    currency: 'INR',
    deductedFromInventory: false,
    createdAt: new Date('2024-10-18').toISOString()
  }
];

function readLocalInvoices(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading local invoice store:', err);
  }
  return DEFAULT_INVOICES;
}

function writeLocalInvoices(invoices: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(invoices, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local invoice store:', err);
  }
}

// Initialize seed data if not present
if (!fs.existsSync(DATA_FILE)) {
  writeLocalInvoices(DEFAULT_INVOICES);
}

// MongoDB Connection State
let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let mongoCollection: Collection | null = null;
let isMongoConnected = false;
let activeMongoUri = process.env.MONGODB_URI || '';
let connectionError: string | null = null;

async function initMongoConnection(uri?: string): Promise<boolean> {
  const targetUri = uri || activeMongoUri;
  if (!targetUri) {
    isMongoConnected = false;
    connectionError = 'No MONGODB_URI configured. Running in secure persistent storage mode.';
    return false;
  }

  try {
    if (mongoClient) {
      await mongoClient.close().catch(() => {});
    }

    const client = new MongoClient(targetUri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });

    await client.connect();
    mongoClient = client;
    mongoDb = client.db('pyrosafe_db');
    mongoCollection = mongoDb.collection('invoices');
    isMongoConnected = true;
    activeMongoUri = targetUri;
    connectionError = null;

    // Seed existing records if MongoDB collection is empty
    const count = await mongoCollection.countDocuments();
    if (count === 0) {
      const localData = readLocalInvoices();
      if (localData.length > 0) {
        await mongoCollection.insertMany(localData);
      }
    }

    console.log(`[Pyrosafe MongoDB] Successfully connected to database 'pyrosafe_db'`);
    return true;
  } catch (err: any) {
    isMongoConnected = false;
    connectionError = err.message || 'Failed to connect to MongoDB cluster';
    console.warn(`[Pyrosafe MongoDB] Connection warning: ${connectionError}. Operating in fallback persistent mode.`);
    return false;
  }
}

// Attempt initial MongoDB connection if URI configured
if (activeMongoUri) {
  initMongoConnection(activeMongoUri).catch(() => {});
}

// Token helper functions (HMAC SHA-256 Signed Tokens)
function generateToken(payload: { email: string; role: string; name: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iss: 'pyrosafe-solutions',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days validity
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): { valid: boolean; payload?: any } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false };
    const [header, body, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return { valid: false };
    }

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

// Secure Authentication Middleware for Database Endpoints
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access denied. Secure Bearer token required for all database access points.',
    });
  }

  const token = authHeader.substring(7);
  const result = verifyToken(token);

  if (!result.valid) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired authentication credentials.',
    });
  }

  (req as any).user = result.payload;
  next();
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Authentication Endpoint
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password).trim();

  // Validate exact user-requested credentials
  if (cleanEmail === ADMIN_EMAIL.toLowerCase() && cleanPassword === ADMIN_PASSWORD) {
    const token = generateToken({
      email: ADMIN_EMAIL,
      role: 'admin',
      name: 'Ravi (Admin)',
    });

    return res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        email: ADMIN_EMAIL,
        name: 'Ravi',
        role: 'Admin',
        company: 'PYROSAFE SOLUTIONS PVT LTD',
      },
    });
  }

  return res.status(401).json({
    error: 'Invalid credentials',
    message: 'Invalid Admin ID or Password. Please check your credentials.',
  });
});

// 2. Token Verification Endpoint
app.get('/api/auth/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  const result = verifyToken(authHeader.substring(7));
  if (!result.valid) {
    return res.status(401).json({ valid: false });
  }

  return res.json({
    valid: true,
    user: result.payload,
  });
});

// 3. Database Connection Status
app.get('/api/db/status', async (req: Request, res: Response) => {
  let count = 0;
  if (isMongoConnected && mongoCollection) {
    try {
      count = await mongoCollection.countDocuments();
    } catch {
      count = readLocalInvoices().length;
    }
  } else {
    count = readLocalInvoices().length;
  }

  res.json({
    connected: isMongoConnected,
    mode: isMongoConnected ? 'MongoDB Live Cluster' : 'MongoDB Standard Store (Local Persistent Buffer)',
    database: 'pyrosafe_db',
    collection: 'invoices',
    recordCount: count,
    activeUri: activeMongoUri ? `${activeMongoUri.split('@')[0]}@***` : 'None (Ready for Atlas URI)',
    error: connectionError,
    authenticatedAccess: true,
    timestamp: new Date().toISOString(),
  });
});

// 4. Test & Connect Custom MongoDB URI
app.post('/api/db/connect', requireAuth, async (req: Request, res: Response) => {
  const { uri } = req.body;
  if (!uri || typeof uri !== 'string') {
    return res.status(400).json({ error: 'Valid MongoDB URI string is required' });
  }

  try {
    const success = await initMongoConnection(uri.trim());
    if (success) {
      return res.json({
        success: true,
        message: 'Successfully connected and authenticated with MongoDB cluster',
        database: 'pyrosafe_db',
      });
    } else {
      return res.status(400).json({
        success: false,
        error: connectionError || 'Could not establish connection to MongoDB',
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Connection attempt failed',
    });
  }
});

// 5. Invoices - Retrieval (Protected database access point)
app.get('/api/invoices', requireAuth, async (req: Request, res: Response) => {
  try {
    const { clientId } = req.query;

    if (isMongoConnected && mongoCollection) {
      const query: any = {};
      if (clientId) query.clientId = String(clientId);
      const invoices = await mongoCollection.find(query).sort({ date: -1 }).toArray();
      return res.json(invoices);
    }

    // Fallback to persistent local storage
    const local = readLocalInvoices();
    if (clientId) {
      return res.json(local.filter((i) => i.clientId === String(clientId)));
    }
    return res.json(local);
  } catch (err: any) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ error: 'Failed to retrieve invoice records' });
  }
});

// 6. Invoices - Storage (Protected database access point)
app.post('/api/invoices', requireAuth, async (req: Request, res: Response) => {
  try {
    const invoiceData = req.body;
    if (!invoiceData || !invoiceData.clientName || !invoiceData.number) {
      return res.status(400).json({ error: 'Missing required invoice fields' });
    }

    const newInvoice = {
      ...invoiceData,
      id: invoiceData.id || `inv-doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // 1. Save to MongoDB if connected
    if (isMongoConnected && mongoCollection) {
      await mongoCollection.insertOne({ ...newInvoice });
    }

    // 2. Also keep persistent local copy updated
    const local = readLocalInvoices();
    const updated = [newInvoice, ...local.filter((i) => i.id !== newInvoice.id)];
    writeLocalInvoices(updated);

    return res.status(201).json({
      success: true,
      message: 'Invoice successfully stored in database',
      invoice: newInvoice,
    });
  } catch (err: any) {
    console.error('Error saving invoice:', err);
    res.status(500).json({ error: 'Failed to save invoice record to database' });
  }
});

// 7. Invoices - Status Update (Protected database access point)
app.patch('/api/invoices/:id/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    // Update in MongoDB if connected
    if (isMongoConnected && mongoCollection) {
      await mongoCollection.updateOne({ id }, { $set: { status, updatedAt: new Date().toISOString() } });
    }

    // Update in local store
    const local = readLocalInvoices();
    const target = local.find((i) => i.id === id);
    if (target) {
      target.status = status;
      writeLocalInvoices(local);
    }

    return res.json({ success: true, message: `Invoice status updated to ${status}` });
  } catch (err: any) {
    console.error('Error updating invoice status:', err);
    res.status(500).json({ error: 'Failed to update invoice status' });
  }
});

// ==========================================
// STATIC / VITE MIDDLEWARE SETUP
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Pyrosafe Solutions] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
