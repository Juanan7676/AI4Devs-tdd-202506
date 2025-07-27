import { Request, Response } from 'express';
import { addCandidateController } from '../presentation/controllers/candidateController';

// Mock del servicio
jest.mock('../application/services/candidateService', () => ({
    addCandidate: jest.fn()
}));

describe('Candidate Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockAddCandidate: jest.MockedFunction<any>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock del servicio
        const { addCandidate } = require('../application/services/candidateService');
        mockAddCandidate = addCandidate;

        // Mock de request y response
        mockRequest = {
            body: {}
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe('addCandidateController', () => {
        test('debería retornar 201 cuando se crea un candidato exitosamente', async () => {
            const candidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            const savedCandidate = {
                id: 1,
                ...candidateData
            };

            mockRequest.body = candidateData;
            mockAddCandidate.mockResolvedValue(savedCandidate);

            await addCandidateController(mockRequest as Request, mockResponse as Response);

            expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Candidate added successfully',
                data: savedCandidate
            });
        });

        test('debería retornar 400 cuando hay un error de validación', async () => {
            const candidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'invalid-email'
            };

            const validationError = new Error('Invalid email');

            mockRequest.body = candidateData;
            mockAddCandidate.mockRejectedValue(validationError);

            await addCandidateController(mockRequest as Request, mockResponse as Response);

            expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Error adding candidate',
                error: 'Invalid email'
            });
        });

        test('debería retornar 400 cuando hay un error de email duplicado', async () => {
            const candidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            const duplicateError = new Error('The email already exists in the database');

            mockRequest.body = candidateData;
            mockAddCandidate.mockRejectedValue(duplicateError);

            await addCandidateController(mockRequest as Request, mockResponse as Response);

            expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Error adding candidate',
                error: 'The email already exists in the database'
            });
        });

        test('debería retornar 400 cuando hay un error genérico', async () => {
            const candidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            const genericError = new Error('Database connection failed');

            mockRequest.body = candidateData;
            mockAddCandidate.mockRejectedValue(genericError);

            await addCandidateController(mockRequest as Request, mockResponse as Response);

            expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Error adding candidate',
                error: 'Database connection failed'
            });
        });

        test('debería manejar errores no Error', async () => {
            const candidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            const nonError = 'This is not an Error object';

            mockRequest.body = candidateData;
            mockAddCandidate.mockRejectedValue(nonError);

            await addCandidateController(mockRequest as Request, mockResponse as Response);

            expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Error adding candidate',
                error: 'Unknown error'
            });
        });
    });
}); 