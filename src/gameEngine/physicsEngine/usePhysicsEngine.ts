export const usePhysicsEngine = (): TPhysicsEngine => {
  const executeLoop = () => {
    // TODo
  }

  return {
    executeLoop,
  }
}

type TPhysicsEngine = {
  executeLoop: () => void
}
