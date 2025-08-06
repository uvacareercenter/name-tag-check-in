import {
  TextField as MuiTextField,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Autocomplete
} from '@mui/material';
import { useFormContext, Controller, RegisterOptions } from 'react-hook-form';

export const TextField = ({
                            name, options = {} as RegisterOptions,
                            disabled = false,
                            ...props
                          }) => {
  const { register, formState: { errors, isSubmitting } } = useFormContext();

  return (
    <MuiTextField
      {...props}
      name={name}
      {...register(name, options)}
      error={!!errors[name]}
      required={!!options.required}
      helperText={errors[name]?.message?.toString() || ''}
      disabled={disabled || isSubmitting}
    />
  );
};

export const CheckboxField = ({
                                name,
                                label,
                                options = {},
                                disabled = false
                              }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      rules={options}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Checkbox
              {...field}
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={disabled}
            />
          }
          label={label}
        />
      )}
    />
  );
};

export const SelectField = ({
                              name,
                              options = {} as RegisterOptions,
                              disabled,
                              items,
                              ...props
                            }) => {
  const { control, formState: { errors, isSubmitting } } = useFormContext();

  return (
    <>
      {Array.isArray(items) && items.length > 0 ? (
        <FormControl
          {...props}
          error={!!errors[name]}
          disabled={disabled || isSubmitting}
        >
          <Controller
            name={name}
            control={control}
            rules={options}
            render={({ field: { onChange } }) => (
              <Autocomplete
                id={name}
                options={items}
                getOptionLabel={(option) => String(option)}
                onChange={(_, value) => onChange(value)}
                disabled={disabled || isSubmitting}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    required={!!options.required}
                    label={props.label}
                    error={!!errors[name]}
                    helperText={errors[name]?.message?.toString() || ''}
                  />
                )}
              />
            )}
          />
          {!!errors[name] && (
            <FormHelperText>{errors[name]?.message?.toString() || ''}</FormHelperText>
          )}
        </FormControl>
      ) : (
        <TextField
          name={name}
          label={props.label}
          options={options}
          disabled={disabled}
          {...props}
        />
      )}
    </>
  );
};
