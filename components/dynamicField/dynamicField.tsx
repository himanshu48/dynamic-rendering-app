import { FC } from 'react'

interface IDynamicFieldProps {
  paramType: string
}

const DynamicField: FC<IDynamicFieldProps> = (props) => {
  const {paramType} = props;
  return <div className='dynamic-field'>
    {(() => {
      switch (paramType.toLowerCase()) {
        case 'text':
          return <input type="text" />
        case 'email':
          return <input type="email" />
        case 'password':
          return <input type="password" />
        case 'submitbutton':
          return <button>Submit</button>
      
        default:
          return null;
      }
    })()}
  </div>
}

export default DynamicField;