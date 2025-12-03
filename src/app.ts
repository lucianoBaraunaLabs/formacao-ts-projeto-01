import { appConfig, type AppConfig } from './config.js'
import { ClassRepository } from './data/ClassRepository.js'
import { ParentRepository } from './data/ParentRepository.js'
import { StudentRepository } from './data/StudentRepository.js'
import { TeacherRepository } from './data/TeacherRepository.js'
import { WebLayer } from './presentation/index.js'
import { ClassService } from './services/ClassService.js'
import { ParentService } from './services/ParentService.js'
import { StudentService } from './services/StudentService.js'
import { TeacherService } from './services/TeacherService.js'

export type Application = (config: AppConfig, services: any) => Promise<{
    start: () => Promise<void>,
    stop: () => Promise<void>,
}>

export type ServiceList = ReturnType<typeof initDependencies>['services']
function initDependencies(config: AppConfig) {
    const repositories = {
        class: new ClassRepository(),
        teacher: new TeacherRepository(),
        parent: new ParentRepository(),
        student: new StudentRepository(),
    }

    const teachersService = new TeacherService(repositories.teacher)
    const parentsService = new ParentService(repositories.parent)
    const studentsService = new StudentService( repositories.student,
        parentsService)
    const classesService = new ClassService(repositories.class,
        teachersService,
        studentsService)
    // Iniciar camadas de serviço, repositórios, etc.
    return {
        services:{
            teacher: teachersService,
            parent: parentsService,
            student: studentsService,
            class: classesService,
        }
    }
}
async function main(layers: Application, config: AppConfig){
    const {services} = initDependencies(config)
    const {start, stop} = await layers(config, services)

   
  process.on('SIGINT', () => {
    console.info('SIGINT signal received.')
    stop()
  })
  process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.')
    stop()
  })
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection', reason)
  })
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception', error)
    stop()
  })
    return start()
}

await main(WebLayer, appConfig)