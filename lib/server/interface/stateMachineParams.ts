export interface IStateMachineParams{
    stateParamId: number;
    stateParamKey: string;
    displayLabel: string;
    helpText: string;
    maxLength: number;
    minLength: number;
    optionalField: boolean;
    paramType: string;
    validPossibleValues: string;
    regex: string;
  }