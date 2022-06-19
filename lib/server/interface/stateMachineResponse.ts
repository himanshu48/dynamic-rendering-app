export type StateMachineResponse = {
  responseData: {
    nextStateId: number | null
    nextStateParams: any | null
    operationCompleted: boolean
  },
  responseInfo: {
    type: "success" | "error",
    errMsg?: string
  }
  }