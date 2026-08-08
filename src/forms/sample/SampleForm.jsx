import React from 'react'
import Form from '../../layout/Form'
import FormRow from '../../components/form/FormRow'
import Input from '../../components/input/Input'
import { useGetSpan } from '../../utils/get-spans'
const SampleForm = () => {
  const getSpan = useGetSpan()

  return (
    <>
      <Form>
        <FormRow>
          <Input
            placeholder="Hello1"
            label="Name"
            error="Hellow"
            style={{
              gridColumn: getSpan(),
            }}
          />
          <Input
            placeholder="Hello2"
            style={{
              gridColumn: getSpan(),
            }}
          />
        </FormRow>
        <FormRow>
          <Input
            placeholder="Hello3"
            label="Name"
            error="This field is required"
            style={{
              gridColumn: getSpan(),
            }}
          />
          <Input
            placeholder="Hello4"
            style={{
              gridColumn: getSpan(),
            }}
          />
        </FormRow>
      </Form>
    </>
  )
}

export default SampleForm
