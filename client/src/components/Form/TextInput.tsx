import type { ComponentWithProps } from "@/types/components"
import { useFieldContext } from "@/hook/form-context"

type TextInputProps = {
  label: string
  errors?: string[]
}

/**
 * Responsible for handling tanstack form related logic and
 * passing it to the dumb, ui component.
 */
export default function TextInputWrapper({ label }: { label: string }) {
  const field = useFieldContext<string>()
  return (
    <TextInput
      label={label}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      errors={!field.state.meta.isValid ? field.state.meta.errors : undefined}
    />
  )
}
export function TextInput({ label, value, onChange, name, errors }: ComponentWithProps<TextInputProps, 'input'>) {
  return (
    <div>
      <label className="block mb-4">
        <span className="text-gray-700 text-sm">{label}</span>
        <input id={name || ''} name={name || ''} type="text" value={value} onChange={onChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500" />
      </label>
      {errors && errors.map(error => (
        <span key={error}>{error}</span>
      ))

      }
    </div>
  )
}