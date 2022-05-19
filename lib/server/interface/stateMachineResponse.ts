export type StateMachineResponse = {
  responseData: {
    nextStateId: string | null
    nextStateParams: any | null
    operationCompleted: boolean
  },
  responseInfo: {
    type: "success" | "error",
    errMsg?: string
  }
  }