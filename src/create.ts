import type { BirpcGroup, BirpcOptions, BirpcReturn } from 'birpc'
import type { RpcFunctionsCollector } from './types'
import { createBirpc, createBirpcGroup } from 'birpc'

export function createBirpcFromCollector<
  RemoteFunctions extends object,
  LocalFunctions extends object,
  SetupContext,
>(
  collector: RpcFunctionsCollector<LocalFunctions, SetupContext>,
  options: BirpcOptions<RemoteFunctions>,
): BirpcReturn<RemoteFunctions, LocalFunctions> {
  return createBirpc<RemoteFunctions, LocalFunctions>(
    collector.functions,
    {
      get eventNames(): (keyof RemoteFunctions)[] {
        return [
          ...Array.from(collector.definitions.values())
            .filter(definition => definition.type === 'event')
            .map(definition => definition.name as keyof RemoteFunctions),
          ...(options.eventNames ?? []),
        ]
      },
      ...options,
    },
  )
}

export function createBirpcGroupFromCollector<
  RemoteFunctions extends object,
  LocalFunctions extends object,
  SetupContext,
>(
  collector: RpcFunctionsCollector<LocalFunctions, SetupContext>,
  options: BirpcOptions<RemoteFunctions>,
): BirpcGroup<RemoteFunctions, LocalFunctions> {
  return createBirpcGroup<RemoteFunctions, LocalFunctions>(
    collector.functions,
    [],
    {
      get eventNames(): (keyof RemoteFunctions)[] {
        return [
          ...Array.from(collector.definitions.values())
            .filter(definition => definition.type === 'event')
            .map(definition => definition.name as keyof RemoteFunctions),
          ...(options.eventNames ?? []),
        ]
      },
      ...options,
    },
  )
}
