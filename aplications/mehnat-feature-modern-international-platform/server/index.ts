import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { storage } from './storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the client build
app.use(express.static(path.join(__dirname, '../dist')));

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Simple demo authentication
  if (email === "admin@safedocs.uz" && password === "admin123") {
    res.json({ success: true, user: { email } });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Video Materials routes
app.get('/api/video-materials', async (req, res) => {
  try {
    const materials = await storage.getAllVideoMaterials();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch video materials" });
  }
});

app.post('/api/video-materials', async (req, res) => {
  try {
    const material = await storage.createVideoMaterial(req.body);
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.put('/api/video-materials/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const material = await storage.updateVideoMaterial(id, req.body);
    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }
    res.json(material);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.delete('/api/video-materials/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteVideoMaterial(id);
    if (!success) {
      return res.status(404).json({ error: "Material not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete material" });
  }
});

// Slides routes
app.get('/api/slides', async (req, res) => {
  try {
    const slides = await storage.getAllSlaydlar();
    res.json(slides);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch slides" });
  }
});

app.post('/api/slides', async (req, res) => {
  try {
    const slide = await storage.createSlayd(req.body);
    res.status(201).json(slide);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.put('/api/slides/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const slide = await storage.updateSlayd(id, req.body);
    if (!slide) {
      return res.status(404).json({ error: "Slide not found" });
    }
    res.json(slide);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.delete('/api/slides/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteSlayd(id);
    if (!success) {
      return res.status(404).json({ error: "Slide not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete slide" });
  }
});

// Banners routes
app.get('/api/banners', async (req, res) => {
  try {
    const banners = await storage.getAllBanners();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch banners" });
  }
});

app.post('/api/banners', async (req, res) => {
  try {
    const banner = await storage.createBanner(req.body);
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.put('/api/banners/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const banner = await storage.updateBanner(id, req.body);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }
    res.json(banner);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.delete('/api/banners/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteBanner(id);
    if (!success) {
      return res.status(404).json({ error: "Banner not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete banner" });
  }
});

// Manuals routes  
app.get('/api/manuals', async (req, res) => {
  try {
    const manuals = await storage.getAllKasbYoriqnomalari();
    res.json(manuals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch manuals" });
  }
});

app.post('/api/manuals', async (req, res) => {
  try {
    const manual = await storage.createKasbYoriqnoma(req.body);
    res.status(201).json(manual);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.put('/api/manuals/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const manual = await storage.updateKasbYoriqnoma(id, req.body);
    if (!manual) {
      return res.status(404).json({ error: "Manual not found" });
    }
    res.json(manual);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.delete('/api/manuals/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteKasbYoriqnoma(id);
    if (!success) {
      return res.status(404).json({ error: "Manual not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete manual" });
  }
});

// Railway Documents routes
app.get('/api/railway-docs', async (req, res) => {
  try {
    const docs = await storage.getAllTemirYolHujjatlari();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch railway documents" });
  }
});

app.post('/api/railway-docs', async (req, res) => {
  try {
    const doc = await storage.createTemirYolHujjat(req.body);
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.put('/api/railway-docs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const doc = await storage.updateTemirYolHujjat(id, req.body);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json(doc);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.delete('/api/railway-docs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteTemirYolHujjat(id);
    if (!success) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete document" });
  }
});

// Normative Documents routes
app.get('/api/normative-docs', async (req, res) => {
  try {
    const docs = await storage.getAllNormativHujjatlar();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch normative documents" });
  }
});

app.post('/api/normative-docs', async (req, res) => {
  try {
    const doc = await storage.createNormativHujjat(req.body);
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.put('/api/normative-docs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const doc = await storage.updateNormativHujjat(id, req.body);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json(doc);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.delete('/api/normative-docs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteNormativHujjat(id);
    if (!success) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete document" });
  }
});

// Rules routes
app.get('/api/rules', async (req, res) => {
  try {
    const rules = await storage.getAllQoidalar();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rules" });
  }
});

app.post('/api/rules', async (req, res) => {
  try {
    const rule = await storage.createQoida(req.body);
    res.status(201).json(rule);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.put('/api/rules/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const rule = await storage.updateQoida(id, req.body);
    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }
    res.json(rule);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.delete('/api/rules/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteQoida(id);
    if (!success) {
      return res.status(404).json({ error: "Rule not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete rule" });
  }
});

// Dashboard routes
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

app.get('/api/dashboard/recent-activity', async (req, res) => {
  try {
    const activity = await storage.getRecentActivity();
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recent activity" });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});