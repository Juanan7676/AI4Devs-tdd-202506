import { validateCandidateData } from '../application/validator';

describe('Candidate Data Validator', () => {
    describe('Validación de Campos Obligatorios', () => {
        test('debería validar datos completos con todos los campos requeridos', () => {
            const validData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería fallar cuando falta firstName', () => {
            const invalidData = {
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
        });

        test('debería fallar cuando falta lastName', () => {
            const invalidData = {
                firstName: 'Juan',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
        });

        test('debería fallar cuando falta email', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez'
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid email');
        });

        test('debería fallar con datos completamente vacíos', () => {
            const invalidData = {};

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
        });
    });

    describe('Validación de Nombres', () => {
        test('debería validar nombres con caracteres normales', () => {
            const validData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería validar nombres con acentos', () => {
            const validData = {
                firstName: 'José',
                lastName: 'François',
                email: 'jose@email.com'
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería fallar con nombres muy cortos', () => {
            const invalidData = {
                firstName: 'A',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
        });

        test('debería fallar con nombres muy largos', () => {
            const longName = 'A'.repeat(101);
            const invalidData = {
                firstName: longName,
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
        });

        test('debería fallar con nombres con números', () => {
            const invalidData = {
                firstName: 'Juan123',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
        });

        test('debería fallar con nombres con caracteres especiales', () => {
            const invalidData = {
                firstName: 'Juan@',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
        });
    });

    describe('Validación de Email', () => {
        test('debería validar email estándar', () => {
            const validData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería validar email con subdominios', () => {
            const validData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@empresa.co.uk'
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería fallar con email sin @', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juanemail.com'
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid email');
        });

        test('debería fallar con email sin dominio', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@'
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid email');
        });

        test('debería fallar con email con espacios', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan @email.com'
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid email');
        });

        test('debería fallar con email vacío', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: ''
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid email');
        });
    });

    describe('Validación de Teléfono', () => {
        test('debería validar teléfono español válido', () => {
            const validData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                phone: '612345678'
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería validar sin teléfono (campo opcional)', () => {
            const validData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería fallar con teléfono con formato incorrecto', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                phone: '123456789'
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid phone');
        });

        test('debería fallar con teléfono con letras', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                phone: '61234567a'
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid phone');
        });
    });

    describe('Validación de Dirección', () => {
        test('debería validar dirección normal', () => {
            const validData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                address: 'Calle Mayor 123'
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería validar sin dirección (campo opcional)', () => {
            const validData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería fallar con dirección muy larga', () => {
            const longAddress = 'A'.repeat(101);
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                address: longAddress
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid address');
        });
    });

    describe('Validación de Educación', () => {
        test('debería validar educación completa con fechas válidas', () => {
            const validData = {
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

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería validar sin educación', () => {
            const validData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería fallar con institución vacía', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                educations: [{
                    institution: '',
                    title: 'Ingeniero Informático',
                    startDate: '2018-09-01'
                }]
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid institution');
        });

        test('debería fallar con título vacío', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                educations: [{
                    institution: 'Universidad de Madrid',
                    title: '',
                    startDate: '2018-09-01'
                }]
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid title');
        });

        test('debería fallar con fecha de inicio inválida', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                educations: [{
                    institution: 'Universidad de Madrid',
                    title: 'Ingeniero Informático',
                    startDate: 'fecha-invalida'
                }]
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid date');
        });

        test('debería fallar con fecha de fin inválida', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                educations: [{
                    institution: 'Universidad de Madrid',
                    title: 'Ingeniero Informático',
                    startDate: '2018-09-01',
                    endDate: 'fecha-invalida'
                }]
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid end date');
        });

        test('debería fallar con institución muy larga', () => {
            const longInstitution = 'A'.repeat(101);
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                educations: [{
                    institution: longInstitution,
                    title: 'Ingeniero Informático',
                    startDate: '2018-09-01'
                }]
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid institution');
        });
    });

    describe('Validación de Experiencia Laboral', () => {
        test('debería validar experiencia completa con fechas válidas', () => {
            const validData = {
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

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería validar sin experiencia laboral', () => {
            const validData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería fallar con empresa vacía', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                workExperiences: [{
                    company: '',
                    position: 'Desarrollador Senior',
                    startDate: '2022-01-01'
                }]
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid company');
        });

        test('debería fallar con posición vacía', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                workExperiences: [{
                    company: 'TechCorp',
                    position: '',
                    startDate: '2022-01-01'
                }]
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid position');
        });

        test('debería fallar con descripción muy larga', () => {
            const longDescription = 'A'.repeat(201);
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                workExperiences: [{
                    company: 'TechCorp',
                    position: 'Desarrollador Senior',
                    description: longDescription,
                    startDate: '2022-01-01'
                }]
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid description');
        });

        test('debería fallar con fecha de inicio inválida', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                workExperiences: [{
                    company: 'TechCorp',
                    position: 'Desarrollador Senior',
                    startDate: 'fecha-invalida'
                }]
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid date');
        });

        test('debería fallar con fecha de fin inválida', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                workExperiences: [{
                    company: 'TechCorp',
                    position: 'Desarrollador Senior',
                    startDate: '2022-01-01',
                    endDate: 'fecha-invalida'
                }]
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid end date');
        });
    });

    describe('Validación de CV', () => {
        test('debería validar CV con filePath y fileType válidos', () => {
            const validData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                cv: {
                    filePath: '/uploads/cv.pdf',
                    fileType: 'application/pdf'
                }
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería validar sin CV', () => {
            const validData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        test('debería fallar con CV sin filePath', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                cv: {
                    fileType: 'application/pdf'
                }
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid CV data');
        });

        test('debería fallar con CV sin fileType', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                cv: {
                    filePath: '/uploads/cv.pdf'
                }
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid CV data');
        });

        test('debería fallar con CV con tipos de datos incorrectos', () => {
            const invalidData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                cv: {
                    filePath: 123,
                    fileType: 'application/pdf'
                }
            };

            expect(() => validateCandidateData(invalidData)).toThrow('Invalid CV data');
        });
    });

    describe('Validación de Edición (con ID)', () => {
        test('debería permitir edición cuando se proporciona ID', () => {
            const editData = {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com'
            };

            expect(() => validateCandidateData(editData)).not.toThrow();
        });

        test('debería permitir edición con campos opcionales vacíos', () => {
            const editData = {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@email.com',
                phone: '',
                address: ''
            };

            expect(() => validateCandidateData(editData)).not.toThrow();
        });
    });
}); 