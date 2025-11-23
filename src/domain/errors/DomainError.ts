// O domain erro é um erro relacionado às regras de negócio da aplicação.

import { SerializableStatic } from '../types.js'

interface DomainErrorOptions extends ErrorOptions {
    code?: string
    status?: number
}

export abstract class DomainError extends Error {
    readonly code: string
    readonly status: number

    constructor(message: string, entity: SerializableStatic, options?: DomainErrorOptions) {
        super(message, options)
        this.stack = new Error().stack // aqui estamos capturando a stack trace correta do javascript
        this.code = options?.code ?? 'DOMAIN_ERROR'
        this.name = `${entity.name}Error`
        this.status = options?.status ?? 500
    }
}