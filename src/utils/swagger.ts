import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Gem Global B2B API',
            version: '1.0.0',
            description: 'API documentation for Gem Global B2B backend',
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // adjust path if your routes are elsewhere
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Registers Swagger UI on /api-docs
 */
export default function swaggerDocs(app: Express) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('✅ Swagger docs available at http://localhost:5000/api-docs');
}
