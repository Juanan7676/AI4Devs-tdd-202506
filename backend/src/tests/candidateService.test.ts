import { addCandidate } from '../application/services/candidateService';

// Mock del validador
jest.mock('../application/validator', () => ({
    validateCandidateData: jest.fn()
}));

// Mock del modelo Candidate
const mockSave = jest.fn();
const mockCandidateInstance = {
    education: [],
    workExperience: [],
    resumes: [],
    save: mockSave
};

jest.mock('../domain/models/Candidate', () => ({
    Candidate: jest.fn().mockImplementation((data) => ({
        ...data,
        education: data.education || [],
        workExperience: data.workExperience || [],
        resumes: data.resumes || [],
        save: mockSave
    }))
}));

// Mock de los modelos Education, WorkExperience y Resume
const mockEducationSave = jest.fn();
const mockWorkExperienceSave = jest.fn();
const mockResumeSave = jest.fn();

jest.mock('../domain/models/Education', () => ({
    Education: jest.fn().mockImplementation((data) => ({
        ...data,
        candidateId: undefined,
        save: mockEducationSave
    }))
}));

jest.mock('../domain/models/WorkExperience', () => ({
    WorkExperience: jest.fn().mockImplementation((data) => ({
        ...data,
        candidateId: undefined,
        save: mockWorkExperienceSave
    }))
}));

jest.mock('../domain/models/Resume', () => ({
    Resume: jest.fn().mockImplementation((data) => ({
        ...data,
        candidateId: undefined,
        save: mockResumeSave
    }))
}));

describe('Candidate Service (Fixed)', () => {
    let mockValidateCandidateData: jest.MockedFunction<any>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Obtener las referencias a los mocks
        const { validateCandidateData } = require('../application/validator');
        mockValidateCandidateData = validateCandidateData;

        // Resetear los mocks de save
        mockSave.mockReset();
        mockEducationSave.mockReset();
        mockWorkExperienceSave.mockReset();
        mockResumeSave.mockReset();
    });

    describe('addCandidate', () => {
        test('debería crear un candidato básico exitosamente', async () => {
            const candidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            const mockSavedCandidate = {
                id: 1,
                ...candidateData
            };

            mockValidateCandidateData.mockImplementation(() => { });
            mockSave.mockResolvedValue(mockSavedCandidate);

            const result = await addCandidate(candidateData);

            expect(mockValidateCandidateData).toHaveBeenCalledWith(candidateData);
            expect(mockSave).toHaveBeenCalled();
            expect(result).toEqual(mockSavedCandidate);
        });

        test('debería crear un candidato con educación', async () => {
            const candidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                educations: [{
                    institution: 'Universidad de Madrid',
                    title: 'Ingeniero Informático',
                    startDate: '2018-09-01',
                    endDate: '2022-06-30'
                }]
            };

            const mockSavedCandidate = {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            mockValidateCandidateData.mockImplementation(() => { });
            mockSave.mockResolvedValue(mockSavedCandidate);
            mockEducationSave.mockResolvedValue({});

            const result = await addCandidate(candidateData);

            expect(mockValidateCandidateData).toHaveBeenCalledWith(candidateData);
            expect(mockSave).toHaveBeenCalled();
            expect(mockEducationSave).toHaveBeenCalled();
            expect(result).toEqual(mockSavedCandidate);
        });

        test('debería crear un candidato con experiencia laboral', async () => {
            const candidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                workExperiences: [{
                    company: 'TechCorp',
                    position: 'Desarrollador Senior',
                    description: 'Desarrollo de aplicaciones web',
                    startDate: '2022-01-01',
                    endDate: '2023-12-31'
                }]
            };

            const mockSavedCandidate = {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            mockValidateCandidateData.mockImplementation(() => { });
            mockSave.mockResolvedValue(mockSavedCandidate);
            mockWorkExperienceSave.mockResolvedValue({});

            const result = await addCandidate(candidateData);

            expect(mockValidateCandidateData).toHaveBeenCalledWith(candidateData);
            expect(mockSave).toHaveBeenCalled();
            expect(mockWorkExperienceSave).toHaveBeenCalled();
            expect(result).toEqual(mockSavedCandidate);
        });

        test('debería crear un candidato con CV', async () => {
            const candidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                cv: {
                    filePath: '/uploads/cv.pdf',
                    fileType: 'application/pdf'
                }
            };

            const mockSavedCandidate = {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            mockValidateCandidateData.mockImplementation(() => { });
            mockSave.mockResolvedValue(mockSavedCandidate);
            mockResumeSave.mockResolvedValue({});

            const result = await addCandidate(candidateData);

            expect(mockValidateCandidateData).toHaveBeenCalledWith(candidateData);
            expect(mockSave).toHaveBeenCalled();
            expect(mockResumeSave).toHaveBeenCalled();
            expect(result).toEqual(mockSavedCandidate);
        });

        test('debería fallar cuando la validación falla', async () => {
            const candidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'invalid-email'
            };

            const validationError = new Error('Invalid email');
            mockValidateCandidateData.mockImplementation(() => {
                throw validationError;
            });

            await expect(addCandidate(candidateData)).rejects.toThrow('Invalid email');
            expect(mockValidateCandidateData).toHaveBeenCalledWith(candidateData);
            expect(mockSave).not.toHaveBeenCalled();
        });

        test('debería manejar error de email duplicado', async () => {
            const candidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            const duplicateError = new Error('The email already exists in the database');
            (duplicateError as any).code = 'P2002';

            mockValidateCandidateData.mockImplementation(() => { });
            mockSave.mockRejectedValue(duplicateError);

            await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
            expect(mockValidateCandidateData).toHaveBeenCalledWith(candidateData);
            expect(mockSave).toHaveBeenCalled();
        });

        test('debería propagar errores genéricos', async () => {
            const candidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            const genericError = new Error('Database connection failed');

            mockValidateCandidateData.mockImplementation(() => { });
            mockSave.mockRejectedValue(genericError);

            await expect(addCandidate(candidateData)).rejects.toThrow('Database connection failed');
            expect(mockValidateCandidateData).toHaveBeenCalledWith(candidateData);
            expect(mockSave).toHaveBeenCalled();
        });
    });
}); 