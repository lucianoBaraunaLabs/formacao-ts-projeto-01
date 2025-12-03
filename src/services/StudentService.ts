import { ClassRepository } from '../data/ClassRepository.js'
import { ConflictError } from '../domain/errors/Conflict.js'
import { Parent } from '../domain/Parent.js'
import { Student, StudentCreationType, StudentUpdateType } from '../domain/Student.js'
import { Service } from './BaseService.js'
import { ParentService } from './ParentService.js'

export class StudentService extends Service {

    // Acessando outro serviço para possíveis validações futuras
    constructor(repository: ClassRepository, private readonly parentService: ParentService) {
        super(repository)
    }

    update(id: string, newData: StudentUpdateType) {
        const existing = this.findById(id) as Student
        const updated = new Student({
            ...existing.toObject(),
            ...newData
        })
        this.repository.save(updated)
        return updated
    }

    create(creationData: StudentCreationType) {
        const existing = this.repository.listBy('document', creationData.document)
        if(existing.length > 0) {
            throw new ConflictError({document: creationData.document}, Student)
        }

        creationData.parents.forEach((parent) => {
            this.parentService.findById(parent)
        })

        const entity = new Student(creationData)
        this.repository.save(entity)
        return entity

    }

    getParents(studentId: string) {
        const student = this.findById(studentId) as Student
        return student.parents.map((parentId) => this.parentService.findById(parentId)) as Parent[]
    }

    linkParents(id: string, parentsToUpdate: StudentCreationType['parents']) {
        const student = this.findById(id) as Student // FIXME: Como melhorar?
        parentsToUpdate.forEach((parentId) => this.parentService.findById(parentId))

        student.parents = parentsToUpdate
        this.repository.save(student)
        return student
    }
    
}