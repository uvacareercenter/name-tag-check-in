import React from 'react';
import {
  TextField as MuiTextField,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Autocomplete
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

export const TextField = ({ name, options = {}, disabled, ...props }) => {
  const { register, formState: { errors, isSubmitting } } = useFormContext();

  return (
    <MuiTextField
      {...props}
      name={name}
      {...register(name, options)}
      error={!!errors[name]}
      required={options.required || false}
      helperText={errors[name] && errors[name].message}
      disabled={disabled || isSubmitting}
    />
  );
};

export const CheckboxField = ({ name, options = {}, disabled, ...props }) => {
  const { control, formState: { errors, isSubmitting } } = useFormContext();

  return (
    <FormControl
      required={options.required || false}
      error={!!errors[name]}
      disabled={disabled || isSubmitting}
    >
      <FormControlLabel
        control={
          <Controller
            name={name}
            control={control}
            rules={options}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Checkbox
                onChange={onChange}
                onBlur={onBlur}
                checked={value}
                inputRef={ref}
                {...props}
              />
            )}
          />
        }
        label={props.label}
      />
      {!!errors[name] && (
        <FormHelperText>{errors[name].message}</FormHelperText>
      )}
    </FormControl>
  );
};

export const SelectField = ({
                              name,
                              options = {},
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
                    required={options.required || false}
                    label={props.label}
                    error={!!errors[name]}
                    helperText={errors[name] && errors[name].message}
                  />
                )}
              />
            )}
          />
          {!!errors[name] && (
            <FormHelperText>{errors[name].message}</FormHelperText>
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
