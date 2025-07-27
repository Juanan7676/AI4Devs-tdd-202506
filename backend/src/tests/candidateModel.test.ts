import { Candidate } from '../domain/models/Candidate';

// Mock del módulo @prisma/client
jest.mock('@prisma/client', () => {
    const mockPrismaClient = {
        candidate: {
            create: jest.fn(),
            update: jest.fn(),
            findUnique: jest.fn()
        }
    };

    const PrismaClientInitializationError = class extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'PrismaClientInitializationError';
        }
    };

    return {
        PrismaClient: jest.fn(() => mockPrismaClient),
        Prisma: {
            PrismaClientInitializationError
        }
    };
});

// Mock de los modelos relacionados
jest.mock('../domain/models/Education', () => ({
    Education: jest.fn().mockImplementation((data) => ({
        ...data,
        save: jest.fn()
    }))
}));

jest.mock('../domain/models/WorkExperience', () => ({
    WorkExperience: jest.fn().mockImplementation((data) => ({
        ...data,
        save: jest.fn()
    }))
}));

jest.mock('../domain/models/Resume', () => ({
    Resume: jest.fn().mockImplementation((data) => ({
        ...data,
        save: jest.fn()
    }))
}));

describe('Candidate Model (Fixed)', () => {
    let mockPrismaClient: any;
    let candidate: Candidate;

    beforeEach(() => {
        jest.clearAllMocks();

        // Obtener la instancia mock de PrismaClient
        const { PrismaClient } = require('@prisma/client');
        mockPrismaClient = new PrismaClient();
    });

    describe('Constructor', () => {
        test('debería crear una instancia con datos básicos', () => {
            const data = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            candidate = new Candidate(data);

            expect(candidate.firstName).toBe('Juan');
            expect(candidate.lastName).toBe('Pérez');
            expect(candidate.email).toBe('juan@email.com');
            expect(candidate.education).toEqual([]);
            expect(candidate.workExperience).toEqual([]);
            expect(candidate.resumes).toEqual([]);
        });

        test('debería crear una instancia con datos completos', () => {
            const data = {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                phone: '612345678',
                address: 'Calle Mayor 123'
            };

            candidate = new Candidate(data);

            expect(candidate.id).toBe(1);
            expect(candidate.phone).toBe('612345678');
            expect(candidate.address).toBe('Calle Mayor 123');
            expect(candidate.education).toEqual([]);
            expect(candidate.workExperience).toEqual([]);
            expect(candidate.resumes).toEqual([]);
        });
    });

    describe('save() - Creación de nuevo candidato', () => {
        beforeEach(() => {
            candidate = new Candidate({
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            });
        });

        test('debería crear un candidato básico exitosamente', async () => {
            const mockCreatedCandidate = {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                phone: null,
                address: null
            };

            mockPrismaClient.candidate.create.mockResolvedValue(mockCreatedCandidate);

            const result = await candidate.save();

            expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
                data: {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan@email.com'
                }
            });
            expect(result).toEqual(mockCreatedCandidate);
        });

        test('debería crear un candidato con todos los campos', async () => {
            candidate.phone = '612345678';
            candidate.address = 'Calle Mayor 123';

            const mockCreatedCandidate = {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                phone: '612345678',
                address: 'Calle Mayor 123'
            };

            mockPrismaClient.candidate.create.mockResolvedValue(mockCreatedCandidate);

            const result = await candidate.save();

            expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
                data: {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan@email.com',
                    phone: '612345678',
                    address: 'Calle Mayor 123'
                }
            });
            expect(result).toEqual(mockCreatedCandidate);
        });

        test('debería crear un candidato con educación', async () => {
            const { Education } = require('../domain/models/Education');
            const mockEducation = new Education({
                institution: 'Universidad de Madrid',
                title: 'Ingeniero Informático',
                startDate: new Date('2018-09-01'),
                endDate: new Date('2022-06-30')
            });

            candidate.education = [mockEducation];

            const mockCreatedCandidate = {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            mockPrismaClient.candidate.create.mockResolvedValue(mockCreatedCandidate);

            await candidate.save();

            expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
                data: {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan@email.com',
                    educations: {
                        create: [{
                            institution: 'Universidad de Madrid',
                            title: 'Ingeniero Informático',
                            startDate: new Date('2018-09-01'),
                            endDate: new Date('2022-06-30')
                        }]
                    }
                }
            });
        });

        test('debería crear un candidato con experiencia laboral', async () => {
            const { WorkExperience } = require('../domain/models/WorkExperience');
            const mockExperience = new WorkExperience({
                company: 'TechCorp',
                position: 'Desarrollador Senior',
                description: 'Desarrollo de aplicaciones web',
                startDate: new Date('2022-01-01'),
                endDate: new Date('2023-12-31')
            });

            candidate.workExperience = [mockExperience];

            const mockCreatedCandidate = {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            mockPrismaClient.candidate.create.mockResolvedValue(mockCreatedCandidate);

            await candidate.save();

            expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
                data: {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan@email.com',
                    workExperiences: {
                        create: [{
                            company: 'TechCorp',
                            position: 'Desarrollador Senior',
                            description: 'Desarrollo de aplicaciones web',
                            startDate: new Date('2022-01-01'),
                            endDate: new Date('2023-12-31')
                        }]
                    }
                }
            });
        });

        test('debería crear un candidato con CV', async () => {
            const { Resume } = require('../domain/models/Resume');
            const mockResume = new Resume({
                filePath: '/uploads/cv.pdf',
                fileType: 'application/pdf'
            });

            candidate.resumes = [mockResume];

            const mockCreatedCandidate = {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            mockPrismaClient.candidate.create.mockResolvedValue(mockCreatedCandidate);

            await candidate.save();

            expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
                data: {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan@email.com',
                    resumes: {
                        create: [{
                            filePath: '/uploads/cv.pdf',
                            fileType: 'application/pdf'
                        }]
                    }
                }
            });
        });

        test('debería manejar error de conexión a base de datos', async () => {
            const { Prisma } = require('@prisma/client');
            const dbError = new Prisma.PrismaClientInitializationError('Database connection failed');
            mockPrismaClient.candidate.create.mockRejectedValue(dbError);

            await expect(candidate.save()).rejects.toThrow(
                'No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.'
            );
        });

        test('debería propagar errores genéricos', async () => {
            const genericError = new Error('Generic database error');
            mockPrismaClient.candidate.create.mockRejectedValue(genericError);

            await expect(candidate.save()).rejects.toThrow('Generic database error');
        });
    });

    describe('save() - Actualización de candidato existente', () => {
        beforeEach(() => {
            candidate = new Candidate({
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            });
        });

        test('debería actualizar un candidato existente', async () => {
            const mockUpdatedCandidate = {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                phone: '612345678'
            };

            mockPrismaClient.candidate.update.mockResolvedValue(mockUpdatedCandidate);

            candidate.phone = '612345678';
            const result = await candidate.save();

            expect(mockPrismaClient.candidate.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan@email.com',
                    phone: '612345678'
                }
            });
            expect(result).toEqual(mockUpdatedCandidate);
        });

        test('debería manejar error de registro no encontrado', async () => {
            const notFoundError = new Error('Record not found');
            (notFoundError as any).code = 'P2025';
            mockPrismaClient.candidate.update.mockRejectedValue(notFoundError);

            await expect(candidate.save()).rejects.toThrow(
                'No se pudo encontrar el registro del candidato con el ID proporcionado.'
            );
        });

        test('debería manejar error de conexión a base de datos en actualización', async () => {
            const { Prisma } = require('@prisma/client');
            const dbError = new Prisma.PrismaClientInitializationError('Database connection failed');
            mockPrismaClient.candidate.update.mockRejectedValue(dbError);

            await expect(candidate.save()).rejects.toThrow(
                'No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.'
            );
        });
    });

    describe('findOne()', () => {
        test('debería encontrar un candidato por ID', async () => {
            const mockCandidate = {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                phone: '612345678',
                address: 'Calle Mayor 123'
            };

            mockPrismaClient.candidate.findUnique.mockResolvedValue(mockCandidate);

            const result = await Candidate.findOne(1);

            expect(mockPrismaClient.candidate.findUnique).toHaveBeenCalledWith({
                where: { id: 1 }
            });
            expect(result).toBeInstanceOf(Candidate);
            expect(result?.firstName).toBe('Juan');
            expect(result?.lastName).toBe('Pérez');
            expect(result?.email).toBe('juan@email.com');
        });

        test('debería retornar null si no encuentra el candidato', async () => {
            mockPrismaClient.candidate.findUnique.mockResolvedValue(null);

            const result = await Candidate.findOne(999);

            expect(mockPrismaClient.candidate.findUnique).toHaveBeenCalledWith({
                where: { id: 999 }
            });
            expect(result).toBeNull();
        });
    });

    describe('Manejo de campos undefined', () => {
        test('debería excluir campos undefined al guardar', async () => {
            candidate = new Candidate({
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                phone: undefined,
                address: undefined
            });

            const mockCreatedCandidate = {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            mockPrismaClient.candidate.create.mockResolvedValue(mockCreatedCandidate);

            await candidate.save();

            expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
                data: {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan@email.com'
                }
            });
        });
    });
}); 