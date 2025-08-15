import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/api/insights', (req: Request, res: Response) => {
    const insightsPath = path.join(__dirname, 'data', 'insights.json');
    fs.readFile(insightsPath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading insights data.' });
        }
        const insights = JSON.parse(data);
        res.json({
            message: "AI Insights API",
            insights
        });
    });
});

app.get('/', (req: Request, res: Response) => {
    res.send('API is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});