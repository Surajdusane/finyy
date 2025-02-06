"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { value: string, label: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

export const Select = ({
  onChange,
  onCreate,
  options,
  value,
  disabled,
  placeholder,
}: Props) => {
    const onSelect = (
        options: SingleValue<{ value: string; label: string }>
    ) => {
        onChange(options?.value);
    }
    const formattedOptions = useMemo(() => {
        return options?.find((option) => option.value === value);   
    }, [options, value]);
    
    return (
        <CreatableSelect 
        placeholder={placeholder}
        className="text-sm h-10"
        styles={{
            control: (base) => ({
                ...base,
                borderColor: "#e2e8f0",
                ":hover": {
                    borderColor: "#e2e8f0",
                },
            })
        }}
        isDisabled={disabled}
        onChange={onSelect}
        options={options}
        value={formattedOptions}    
        onCreateOption={onCreate}
        />
    )
}