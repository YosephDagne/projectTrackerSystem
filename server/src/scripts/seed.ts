import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import * as dotenv from 'dotenv';
import { HealthLevel, OverallProjectStatus } from '../types/enums.js';

dotenv.config();

const seedData = [
    {
        key: 'PROJ-001',
        name: 'Unified Analytics Platform',
        description: 'A data-driven project to consolidate analytics from various sources into a single dashboard.',
        lead: 'Sarah Connor',
        health: {
            level: HealthLevel.Good,
            score: 92,
            status: 'On track'
        },
        progress: {
            onTrackPercentage: 85,
            completedTasks: 42,
            totalTasks: 50
        },
        overallProjectStatus: OverallProjectStatus.Active,
        executiveSummary: 'The project is moving steadily. Core integration is complete, currently focusing on UI refinement.',
    },
    {
        key: 'PROJ-002',
        name: 'Customer Portal Overhaul',
        description: 'Deeper redesign of the client-facing portal to improve user experience and interface consistency.',
        lead: 'John Smith',
        health: {
            level: HealthLevel.Fair,
            score: 65,
            status: 'Minor delays'
        },
        progress: {
            onTrackPercentage: 60,
            completedTasks: 18,
            totalTasks: 35
        },
        overallProjectStatus: OverallProjectStatus.Active,
        executiveSummary: 'Resource availability has caused some delays. We are currently mitigating by onboarding an extra developer.',
    }
];

const seedDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/projecttraker';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB for seeding...');

        // Only seed if empty
        const count = await Project.countDocuments();
        if (count === 0) {
            await Project.insertMany(seedData);
            console.log('✅ Seeded database with initial projects!');
        } else {
            console.log('Database already has data, skipping seed.');
        }

        await mongoose.connection.close();
        console.log('Disconnected from MongoDB.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

seedDB();
